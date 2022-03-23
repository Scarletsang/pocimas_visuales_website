import store from "./store";

class NodeHistory {
  constructor(root) {
    this.root = root;
    this.record = [];
    this._choices = [];
  }

  get choices() {
    return this._choices
  }

  set choices(array) {
    this._choices = array;
  }

  addChoice(nodeId) {
    this.choices.push(nodeId);
  }

  add(nodeId) {
    if (nodeId == this.root) {
      this.record = [];
      this.choices = [];
      return this;
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

  clone() {
    let clone = new NodeHistory(this.root);
    clone.record = Array.from(this.record);
    clone.choices = Array.from(this.choices);
    return clone;
  }
}

class NodeMap {
  constructor(jsonObj, fieldNameForNextNode = store.get("nodeFields").nextIds) {
    this.nodes = new Map(Object.entries(jsonObj));
    this.fieldNameForNextNode = fieldNameForNextNode;
  }

  hasNode(nodeId) { return this.nodes.has(nodeId); }

  getNode(nodeId) { return this.nodes.get(nodeId); }

  getNodeAttribute(nodeId, attribute) {
    let node = this.getNode(nodeId);
    // console.log(node, nodeId);
    if (node) {
      if (!node.hasOwnProperty(attribute)) return null;
      return node[attribute];
    }
    return node;
  }

  isEndNode(nodeId) {
    let node = this.getNode(nodeId);
    if (node) return !node.hasOwnProperty(this.fieldNameForNextNode);
    return node;
  }
  
  isChoiceNode(nodeId) {
    return !this.isEndNode(nodeId) && (this.nextIdsOf(nodeId)?.length > 1);
  }

  nextIdsOf(nodeId) {
    return this.getNodeAttribute(nodeId, this.fieldNameForNextNode);
  }

  nextNodesOf(nodeId) {
    let nodesArray = this.nextIdsOf(nodeId)?.map(id => this.nodes.get(id));
    return nodesArray;
  }
}

/**
 * A Pseudo iterator (not strictly following the @iterator protoco)
 * that tranverse from a HTML sections to another one. A Node here 
 * referes to each HTML section that one is walking through.
 */
export default class NodeWalker {
  /**
   * @param {NodeList} nodes 
   * @param {String} fieldName
   * @param {String} id 
   */
  constructor(startId, nodeMap, history, eventDispatcher) {
    this._currentId = startId;
    this.nodeMap = nodeMap;
    this.history = history;
    this.eventDispatcher = eventDispatcher;
    if (eventDispatcher) store.set("eventDispatcher", eventDispatcher);
    const handler = {
      get: function(target, prop, receiver) {
        if (prop in target) return Reflect.get(...arguments);
        const regex = /current([A-Z][a-zA-Z0-9]*)/;
        let fieldName = prop.match(regex)?.at(1);
        if (!fieldName) return ;
        fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
        let attribute = store.get("nodeFields")[fieldName];
        if (!attribute) return ;
        return target.nodeMap.getNodeAttribute(target._currentId, attribute);
      }
    };
    return new Proxy(this, handler);
  }

  get currentId()        {return this._currentId; }
  get currentNode()      {return this.nodeMap.getNode(this._currentId); }
  get isEndNode()        {return this.nodeMap.isEndNode(this._currentId); }
  get isChoiceNode()     {return this.nodeMap.isChoiceNode(this._currentId); }
  get nextIds()          {return this.nodeMap.nextIdsOf(this._currentId); }
  get nextNodes()        {return this.nodeMap.nextNodesOf(this._currentId); }

  /**
   * Create a NodeWaler pseudo iterator from nodes
   * stored in the first encountered template tag.
   * @param {Object} jsonObj
   * @param {String} startId
   * @returns {NodeWalker}
   */
  static fromJSON(jsonObj, startId) {
    let nodes   = jsonObj;
    let nodeMap = new NodeMap(nodes);
    let history = new NodeHistory(startId);
    let eventDispatcher = store.get("eventDispatcher");
    return new NodeWalker(startId, nodeMap, history, eventDispatcher);
  }

  clone() {
    let startId = this._currentId;
    let nodeMap = this.nodeMap;
    let history = this.history.clone();
    return new NodeWalker(startId, nodeMap, history, null);
  }

  /**
   * Iterator function.
   * @param {String} nextId 
   * @returns {{value: Node, done: Boolean} | Boolean}
   */
  next(nextId = null) {
    if (this.isEndNode) return false;
    if (this.isChoiceNode) {
      if (this.nextIds?.includes(nextId)) return this.teleport(nextId);
      return false;
    }
    return this.teleport(this.nextIds?.at(0));
  }
  
  teleport(destId) {
    if (!this.nodeMap.hasNode(destId)) return false;
    this.history.add(destId);
    if (this.isChoiceNode) this.history.addChoice(destId);
    this._currentId = destId;
    if (this.eventDispatcher) this.eventDispatcher.dispatch();
    return {value: this.currentNode, done: this.isEndNode};
  }

  /**
   * Runs the iterator repeatedly until no node is found or multiple
   * nodes are found to be connected to the current node.
   * @returns {Array<Node>}
   */
  wanderTillNodeChoice() {
    let clone = this.clone();
    let arr = [];
    while (clone.next()) {
      arr.push(clone.currentNode);
    }
    return arr;
  }

  /**
   * Perform a depth first search from a node to another node,
   * When the target node is found, returns an array of nodes that
   * have been traversed in the search. Otherwise, return the current node.
   * @param {String} fromId 
   * @param {String} destId 
   * @returns {Array<Node> }
   */
  wanderFromTo(fromId, destId) {
    let clone = this.clone();
    let nodeResult = clone.teleport(fromId);
    if (!nodeResult) return false;
    let arr = [];
    do {
      arr.push(clone.currentNode);
      if (clone.currentId == destId) {
        return arr;
      }
    } while (clone.next());
    if (clone.isEndNode) return false;
    let choice = clone.history.choices.shift();
    let node = clone.next(choice);
    if (node) {
      return arr.concat(clone.wanderFromTo(clone.currentId, destId));
    }
    // If there is a choice, make a depth first search recursively.
    for (let id of clone.nextIds) {
      let nodesAfterChoice = clone.wanderFromTo(id, destId);
      if (nodesAfterChoice) return arr.concat(nodesAfterChoice);
    }
    return false;
  }

  /** private method */
  unmatchedNextIdErrorMsg(nextId){
    return `Unexsisting Next Id.\n - Current Node id: ${this._currentId}.\n - Expecting next id(s): ${this.nextIds()}.\n - Received next id: ${nextId}.`
  }

  shoutInvalidIdError(id) {
    console.error(`Invalid Node Id Input. Received Node Id: ${id}`);
  }
}