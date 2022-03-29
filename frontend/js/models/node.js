/** @typedef {String} NodeId  ID of a node */
/** @typedef {String} ScopeId ID of a scope */

export default function getNodeInfo(nodeId, store) {
  let nodeData = store.get("nodeData");
  if (!nodeData.hasNode(nodeId)) return false;
  return new Node(nodeId, nodeData, store.get("nodeScopes"));
}

class Node {
  constructor(id, nodeData, nodeScopes) {
    /** @property {NodeId} _id */
    this._id = id;
    this.nodeData = nodeData;
    this.nodeScopes = nodeScopes;
    if (this.constructor === Node) Object.freeze(this);
  }

  /**
   * get the id of this node
   * @returns {NodeId}
   */
  get id() {return this._id;}

  /**
   * get this node's object
   * @returns {NodeObject | undefined} data is structurally the same as the JSON from the server
   */
  get data() {return this.nodeData.getNode(this._id);}

  /**
   * get the all the scopes associated with this node
   * @returns {Set<ScopeId>|undefined}
   */
  get scopes() {return this.nodeScopes.getScopeNamesByNodeId(this._id);}

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
  get isInScope() {return this.nodeScopes.nodeIsInScope(this._id);}

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