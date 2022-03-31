import {mappings} from "../store";

/** @typedef {String} NodeId  ID of a node */
/** @typedef {String} ScopeId ID of a scope */

export default class NodeInquiry {
  constructor(nodeData, nodeScopes) {
    this.nodes = new Map();
    this.nodeData = nodeData;
    this.nodeScopes = nodeScopes;
  }

  get(nodeId) {
    if (!this.nodeData.hasNode(nodeId)) return false;
    if (this.nodes.has(nodeId)) return this.nodes.get(nodeId);
    let node = new Node(nodeId, this.nodeData, this.nodeScopes);
    this.nodes.set(nodeId, node);
    return node;
  }

}

class Node {
  constructor(id, nodeData, nodeScopes) {
    /** @property {NodeId} _id */
    this._id = id;
    this.nodeData = nodeData;
    this.nodeScopes = nodeScopes;
    this.acessed = new Map();
    return new Proxy(this, {get: this._proxyHandler, set: (_, _, _) => {}});
  }

  _proxyHandler(target, prop, receiver) {
    // allow accessing the data with the mapped value
    let fieldName = mappings.get("nodeFields")[prop];
    if (fieldName) return this.nodeData.getNodeAttribute(this._id, fieldName);
    // memorize accessed function
    if (target.accessed.has(prop)) return target.accessed.get(prop);
    let result = Reflect.get(...arguments);
    target.accessed.set(prop, result);
    return result;
  }

  /**
   * get the id of this node
   * @returns {NodeId}
   */
  get id() {return this._id;}
  
  /**
   * get this node's raw data, same as the data sent from the server
   * @returns {NodeObject | undefined}
   */
  get rawData() {return this.nodeData.getNode(this._id);}

  /**
   * get the all the scopes associated with this node
   * @returns {Set<ScopeId>|undefined}
   */
  get scopes() {return this.nodeScopes.getScopesByNodeId(this._id);}

  /**
   * check if this node follows any more nodes.
   * @returns {Boolean}
   */
  get isEndNode() {return this.nodeData.isEndNode(this._id);}

  /**
   * check if this node diverges into more nodes.
   * @returns {Boolean}
   */
  get isLobbyNode() {return this.nodeData.isLobbyNode(this_id);}

  /**
   * check if this node diverges from any node.
   * @returns {Boolean}
   */
  get isChoiceNode() {return this.nodeData.isChoiceNode(this._id);}

  /**
   * check if this node is in any scope.
   * @returns {Boolean}
   */
  get isInScope() {return this.nodeScopes.isInScope(this._id);}

  /**
   * get an array of the node IDs that follow this node.
   * @returns {Array<NodeId> | undefined}
   */
  get nextIds() {return this.nodeData.nextIdsOf(this._id);}

  /**
   * get an array of the nodes that follow this node.
   * @returns {Array<NodeObject> | undefined}
   */
  get nextNodes() {return this.nodeData.nextNodesOf(this._id);}

}