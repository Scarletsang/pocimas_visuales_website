/** @module DataModules.Inquiry */
import NodeData from "./nodes";

/**
 * A singleton class that creates a {@link DataModules.module:Inquiry.PropInquiry PropInquiry} upon inquiry. Inquired nodes will be memorized.
 */
export default class NodeInquiry {
  constructor(nodeData, mediaData, nodeScopes) {
    this.nodes      = new Map();
    this.nodeData   = nodeData;
    this.mediaData  = mediaData;
    this.nodeScopes = nodeScopes;
  }

  /**
   * 
   * @param {NodeId} nodeId 
   * @returns {PropInquiry}
   */
  get(nodeId) {
    if (!this.nodeData.hasNode(nodeId)) return false;
    if (this.nodes.has(nodeId)) return this.nodes.get(nodeId);
    let node = new PropInquiry(nodeId, this.nodeData, this.mediaData, this.nodeScopes);
    this.nodes.set(nodeId, node);
    return node;
  }

}

/**
 * An interface for the logic modules ({@link LogicModules.module:NodeWalker NodeWalker class} and {@link LogicModules.module:NodePointer NodePointer class}) to get data of a node. Calculations perform in the getters is memorized.
 */
export class PropInquiry {
  constructor(id, nodeData, mediaData, nodeScopes) {
    this._id        = id;
    this.nodeData   = nodeData;
    this.mediaData  = mediaData;
    this.nodeScopes = nodeScopes;
    this.accessed   = new Map();
    return new Proxy(this, {get: this._proxyHandler, set: () => {}});
  }

  _proxyHandler(target, prop, receiver) {
    // allow accessing the data with the mapped value
    let fieldName = NodeData.JSONFields[prop];
    if (fieldName) {
      let propValue = target.nodeData.getNodeAttribute(target._id, fieldName);
      if (prop != "data") return propValue;
      let mediaData = target.mediaData.get(propValue);
      return mediaData? mediaData : propValue;
    }
    // memorize accessed function
    if (target.accessed.has(prop)) return target.accessed.get(prop);
    let result = Reflect.get(...arguments);
    target.accessed.set(prop, result);
    return result;
  }

  /**
   * get the id of this node
   * @type {NodeId}
   */
  get id() {return this._id;}
  
  /**
   * get this node's raw data, same as the data sent from the server
   * @type {ServerTypes.NodeRawData | undefined}
   */
  get rawData() {return this.nodeData.getNode(this._id);}

  /**
   * get the all the scopes associated with this node
   * @type {Set<BasicTypes.ScopeId>|undefined}
   */
  get scopes() {return this.nodeScopes.getScopesByNodeId(this._id);}

  /**
   * check if this node follows any more nodes.
   * @type {Boolean}
   */
  get isEndNode() {return this.nodeData.isEndNode(this._id);}

  /**
   * check if this node diverges into more nodes.
   * @type {Boolean}
   */
  get isLobbyNode() {return this.nodeData.isLobbyNode(this.id);}

  /**
   * check if this node diverges from any node.
   * @type {Boolean}
   */
  get isChoiceNode() {return this.nodeData.isChoiceNode(this._id);}

  /**
   * check if this node is in any scope.
   * @type {Boolean}
   */
  get isInScope() {return this.nodeScopes.isInScope(this._id);}

  /**
   * get an array of the node IDs that follow this node.
   * @type {Array<BasicTypes.NodeId> | undefined}
   */
  get nextIds() {return this.nodeData.nextIdsOf(this._id);}

  /**
   * get an array of the nodes that follow this node.
   * @type {Array<ServerTypes.NodeRawData> | undefined}
   */
  get nextNodes() {return this.nodeData.nextNodesOf(this._id);}

}