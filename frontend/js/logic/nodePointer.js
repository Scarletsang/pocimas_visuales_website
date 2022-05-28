/** @module LogicModules.NodePointer */
import { global, mappings } from "store";
import NodeWalker from "logic/nodeWalker";

/**
 * A singleton class that points to the node that the user is currently on. It is a duo with the {@link LogicModules.module:NodeWalker NodeWalker class}, which handles pure calculation for node traversal, while this class trigger the following side effects:
 * 
 * 1. stores the state of the user
 * 2. Calling the {@link RendererModules.module:ComponentRenderer ComponentRenderer class} to dispatch updates for the web components.
 * 
 * Every controller of the web components has a reference to this singleton class, so this class also serves as an interface for the web components get data from.
 */
export default class NodePointer {
  _id;
  constructor() {
    /** @type {DataModules.module:Inqury.NodeInquiry} */
    this.nodeInquiry = global.get("nodeInquiry");

    /** @type {RendererModules.module:ComponentRenderer} */
    this.componentRenderer = global.get("componentRenderer");

    /** @type {LogicModules.module:NodeWalker} */
    this.nodeWalker = new NodeWalker(mappings.get("entryNodeId"), this.nodeInquiry, global.get("nodeScopes"));
  }

  get id() {return this._id;}

  /**
   * Gets the Node Object of the current node that this class is pointing to. This function usually serves the purpose for getting information about the node.
   * 
   * Example:
   * 
   * Using getters provided by the NodeObject interface
   * ```javascript
   * nodePointer.attr.scopes
   * nodePointer.attr.isInScope
   * ```
   * 
   * There is a proxy wrapping the NodeObject class that allows you to access the raw data of the nodes.
   * ```javascript
   * nodePointer.attr.structure
   * ```
   * 
   * @type {DataModules.module:Inquiry.PropInquiry}
   */
  get attr() {return this.nodeInquiry.get(this._id);}

  /**
   * Calculate the {@link ScopeId} of the node that this class is pointing to. 
   * 
   * @see {@link LogicModules.module:NodeWalker#chooseScope} see the documentation of this function to understanding the calculation involves.
   * @type {BasicTypes.ScopeId | false}
   */
  get scopeId() {return this.nodeWalker.chooseScope(this._id);}

  /**
   * @type {ScopeData["name"]}
   */
  get scopeName() {return this.nodeWalker.nodeScopes.getScope(this.scopeId)[mappings.get("scopeFields").name];}
  
  /**
   * @type {Array<DataModules.module:Inquiry.PropInquiry>}
   */
  get walked() {return this.nodeIdsToNodes(this.nodeWalker.walked);}

  /**
   * @type {Array<DataModules.module:Inquiry.PropInquiry> | false}
   */
  get walkedInScope() {
    let scopeId = this.scopeId;
    if (!scopeId) return false;
    let result = this.nodeWalker.walkedPathInScope(scopeId, this._id);
    if (!result) return false;
    return this.nodeIdsToNodes(result);
  }

  /**
   * @param {BasicTypes.NodeId} newId
   */
  set id(newId) {
    if (!this.nodeInquiry.get(newId)) {
      console.error(`unknown nodeId: ${newId}`);
      return ;
    }
    this._id = newId;
    this._triggerSideEffects();
  }
  
  _triggerSideEffects() {
    this.nodeWalker.teleport(this._id);
    this.componentRenderer.render();
  }

  /**
   * All calculations in the {@link LogicModules.module:NodeWalker NodeWalker} class returns a {@link BasicTypes.NodeId Node ID}. This is a helper function to convert the calculation results into usable data about an array of nodes.
   * @param {Array<BasicTypes.NodeId>} nodeIds 
   * @returns {Array<DataModules.module:Inquiry.PropInquiry>}
   */
  nodeIdsToNodes(nodeIds) {
    return nodeIds?.map((id) => this.nodeInquiry.get(id));
  }
}