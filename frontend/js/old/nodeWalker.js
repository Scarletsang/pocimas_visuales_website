import store from "../store";
import NodeMap, {Scopes} from "../nodeObjData";

/** @typedef {String} NodeId  ID of a node */
/** @typedef {String} ScopeId ID of a scope */

/**
 * A JSON object defined on the server side. It's field is stored in the Store.
 * @typedef {Object} NodeObject
 */

/**
 * A singleton class responsible for traversing nodes and telling the event dispatcher (when set) to render contents for the current node. The website is designed for non-linear contents, so every page is described as a "node". 
 */
export default class NodeWalker {
  /**
   * @param {NodeId} startId 
   * @param {NodeMap} nodeMap 
   * @param {Scopes} scope 
   * @param {NodeHistory} history 
   * @param {EventDispatcher} eventDispatcher
   */
  constructor(startId, nodeMap, scope, history, eventDispatcher) {
    /** @property {NodeId} _currentId keeps track of the current node id (read-only) */
    this._currentId      = startId;

    /** @property {NodeMap} nodeMap internal reference for the NodeMap object. It stores the data of all the nodes. @see {NodeMap} */
    this.nodeMap         = nodeMap;

    /** @property {Scopes} scope internal reference for the Scopes object. It stores the scoping of the nodes. @see {Scopes} */
    this.scope           = scope;

    /** @property {NodeHistory} history internal reference for the NodeHistory object. Users have options to choose their the route they desired to go through. This object keeps track of the these choices. @see {NodeHistory} */
    this.history         = history;

    /** @property {EventDispatcher} eventDispatcher internal reference for the EventDispatcher object. It is responsible for dispatching changes to update the rendering of the content on the website. When this reference is set to null, NodeWalker act as an interface solely for traversing nodes without triggering any updates to the rendering. @see {EventDispatcher} */
    this.eventDispatcher = eventDispatcher;

    if (eventDispatcher) store.set("eventDispatcher", eventDispatcher);
    const handler = {
      get: this.proxyGetHandler
    };
    return new Proxy(this, handler);
  }

  /**
   * get the current node id 
   * @returns {NodeId}
   */
  get currentId()    {return this._currentId; }
  /**
   * get the current node
   * @returns {NodeObject | undefined} data is structurally the same as the JSON from the server
   */
  get currentNode()  {return this.nodeMap.getNode(this._currentId); }
  /**
   * check if the current node follows any more nodes.
   * @returns {Boolean}
   */
  get isEndNode()    {return this.nodeMap.isEndNode(this._currentId); }
  /**
   * check if the current node diverges into more nodes.
   * @returns {Boolean}
   */
  get isChoiceNode() {return this.nodeMap.isChoiceNode(this._currentId); }
  /**
   * get an array of the node IDs that follow the current node.
   * @returns {Array<NodeId> | undefined}
   */
  get nextIds()      {return this.nodeMap.nextIdsOf(this._currentId); }
  /**
   * get an array of the nodes that follow the current node.
   * @returns {Array<NodeObject> | undefined}
   */
  get nextNodes()    {return this.nodeMap.nextNodesOf(this._currentId); }
  /**
   * check if the current node is in any scope.
   * @returns {Boolean}
   */
  get isInScope()    {return this.scope.nodeIsInScope(this._currentId); }
  /**
   * get the scope of the current node. If multiple matching scopes are found, the first found would be returned.
   * @returns {ScopeId|undefined}
   */
  get currentScope() {
    let scopes = this.scope.getScopeNamesByNodeId(this._currentId);
    if (!scopes) return scopes;
    const getFirstScope = (scopeSet) => {
      let [scopeId] = scopeSet;
      return scopeId;
    };
    if (scopes.size === 1 || this.history.record.length === 0) {
      return getFirstScope(scopes)
    }
    for (const record of this.history.record) {
      let recordScopes = this.scope.getScopeNamesByHeadId(record);
      if (!recordScopes) continue;
      for (const scopeId of scopes) {
        if (recordScopes.has(scopeId)) return scopeId;
      }
    }
    return getFirstScope(scopes);
}

  /**
   * Initialize a nodeWalker from the incoming JSON object that stores the nodes and the scopes.
   * @param {Object} jsonObj the JSON object incoming from the server.
   * @param {NodeId} startId the first node to traverse from.
   * @returns {NodeWalker}
   */
  static fromJSON(jsonObj, startId) {
    let jsonFields = store.get("dataJSONFields");
    let nodeMap = new NodeMap(jsonObj[jsonFields.nodes]);
    let scope   = new Scopes(jsonObj[jsonFields.scope])
    let history = new NodeHistory(store.get("entryNodeId"));
    let eventDispatcher = store.get("eventDispatcher");
    return new NodeWalker(startId, nodeMap, scope, history, eventDispatcher);
  }

  /**
   * Teleport to the node with the id specified.  
   * This is the only function in this class that make the following side effects:  
   * 1. add the destination node's id to the NodeHistory object.
   * 2. If eventDispatcher is attached, it will trigger update to the rendering of the website based on the destination node object.
   * @param {NodeId} destId 
   * @returns {{value: NodeObject, done: Boolean} | false}
   */
  teleport(destId) {
    if (!this.nodeMap.hasNode(destId)) return false;
    this.history.add(destId);
    this._currentId = destId;
    if (this.isChoiceNode) this.history.addChoice(destId);
    console.log(destId, this.nodeMap, this.history);
    if (this.eventDispatcher) this.eventDispatcher.dispatch();
    return {value: this.currentNode, done: this.isEndNode};
  }

  /**
   * Traverse to the next node. 
   * @param {NodeId | null} nextId If the ID of the next node is given, it will traverse to this node, only if this node follows the current node. If there is only only node follows the current one, this function will ignore the nextID given, and directly traverse to the next node.
   * @returns {{value: NodeObject, done: Boolean} | false}
   */
  next(nextId = null) {
    if (this.isEndNode) return false;
    if (this.isChoiceNode) {
      if (this.nextIds?.includes(nextId)) return this.teleport(nextId);
      return false;
    }
    return this.teleport(this.nextIds?.at(0));
  }

  /**
   * Traverse the nodes until the node diverges into multiple nodes (aka choice node).
   * @returns {Array<NodeObject>} An array of the nodes traversed.
   */
  wanderTillNodeChoice() {
    let clone = this.clone();
    let arr = [];
    while (clone.next()) {
      arr.push(clone.currentNode);
    }
    return arr;
  }

  _wanderFromTo(fromId, destId, arr = []) {
    let clone = this.clone();
    let nodeResult = clone.teleport(fromId);
    if (!nodeResult) return false;
    do {
      arr.push(clone.currentId);
      if (clone.currentId == destId) {
        return arr;
      }
    } while (clone.next());
    if (clone.isEndNode) return false;
    let choice = clone.history.choices.shift();
    let node = clone.next(choice);
    if (node) {
      return clone._wanderFromTo(clone.currentId, destId, Array.from(arr));
    }
    // If there is a choice, make a depth first search recursively.
    for (let id of clone.nextIds) {
      if (arr.includes(id)) continue;
      let nodesAfterChoice = clone._wanderFromTo(id, destId, Array.from(arr));
      if (nodesAfterChoice) return nodesAfterChoice;
    }
    return false;
  }

  /**
   * Perform a depth first search from a node to another node. When the target node is found, returns an array of nodes that have been traversed in the search. Otherwise, return false.
   * @param {NodeId} fromId 
   * @param {NodeId} destId 
   * @returns {Array<NodeObject> | false} Return false if the search fails
   */
  wanderFromTo(fromId, destId) {
    let arr = this._wanderFromTo(fromId, destId);
    if (!arr) return arr;
    return arr.map((nodeId) => this.nodeMap.getNode(nodeId));
  }

  /**
   *  Perform a depth first search, same as the {@link wanderFromTo} function. But instead specifying the id to traverse from, a scope ID is specified instead. And it traverse from the head of the scope.
   * @param {NodeId} scopeId 
   * @param {NodeId} destId 
   * @returns {Array<NodeObject> | false} Return false if the search fails
   */
  wanderFromScopeHeadTo(scopeId, destId) {
    let scopeHead = this.scope.getScopeObj(scopeId)[store.get("scopeFields").head];
    if (!scopeHead) return false;
    return this.wanderFromTo(scopeHead, destId);
  }

  /**
   * Creates a clone of the current nodeWalker instance. This clone will not dispatch any updates to the rendering of the website. The clone is meant for pure traversing nodes without triggering any side effects.
   * @returns {NodeWalker}
   */
  clone() {
    let startId = this._currentId;
    let nodeMap = this.nodeMap;
    let scope   = this.scope;
    let history = this.history.clone();
    return new NodeWalker(startId, nodeMap, scope, history, null);
  }

  /**
   * A proxy handler that dynamically handle getters of the NodeWalker object to get certain attributes from the current node.
   * @example
   * this.currentStructure // will gets the structure of the current node
   * this.currentTitle     // will gets the title of the current node
   * @type {ProxyHandler}
   */
  proxyGetHandler(target, prop, receiver) {
    if (prop in target) return Reflect.get(...arguments);
    const regex = /current([A-Z][a-zA-Z0-9]*)/
    let matchedRegexObj = prop.match(regex);
    if (!matchedRegexObj) return ;
    let fieldName = matchedRegexObj[1];
    if (!fieldName) return ;
    fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
    let attribute = store.get("nodeFields")[fieldName];
    if (!attribute) return ;
    return target.nodeMap.getNodeByAttribute(target._currentId, attribute);
  }
}

/**
 * An object that keeps track of the nodes that have been traversed in the correct order. It also keeps track of the choice that the user has made. For example, if one node diverges to 3 following nodes, this object will mark down which choice have the user made. If the user go back to previous nodes, this object will also keep track of such actions.
 */
class NodeHistory {
  /**
   * @param {NodeId} root A node ID that specify the node to traverse from.
   */
  constructor(root, nodeWalker) {
    /** @property {NodeId} root */
    this.root = root;

    /** @property {Array<ScopeId>} record An array of nodeID in the order that the nodes are traversed. */
    this.record = [];

    /** @property {Array<NodeId>} choices */
    this._choices = [];
  }

  get choices() { return this._choices; }

  set choices(array) { this._choices = array; }

  /**
   * At diverging node, add the user's choice of the node that follows.
   * @param {NodeId} nodeId 
   */
  addChoice(nodeId) {
    this.choices.push(nodeId);
  }

  /**
   * Add an entry to the NodeHistory object.
   * @param {NodeId} nodeId 
   */
  add(nodeId) {
    if (nodeId == this.root) {
      this.record = [];
      this.choices = [];
      return ;
    }
    let nodeIndexInRecord = this.record.indexOf(nodeId);
    if (nodeIndexInRecord >= 0) {
      this.record = this.record.slice(0, nodeIndexInRecord + 1);
      this.choices = this.choices.filter((choice) => {
        return this.record.includes(choice);
      });
    }
    else {
      this.record.push(nodeId);
    }
  }

  reRoot() {

  }

  /**
   * Deep cloning a copy of the current instance of NodeHistory object.
   * @returns {NodeHistory}
   */
  clone() {
    let clone = new NodeHistory(this.root);
    clone.record = Array.from(this.record);
    clone.choices = Array.from(this.choices);
    return clone;
  }
}