import { NODE_FIELD_NAMES } from "./constants.js";
import EventDispatcher from "./eventDispatcher.js";

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
  constructor(nodes, fieldNameForNextNode = NODE_FIELD_NAMES.nextNode) {
    this.map = new Map();
    this.fieldNameForNextNode = fieldNameForNextNode;
    for (let node of nodes) {
      if (node.nodeName == "SECTION") this.map.set(node.id, node.cloneNode(true));
    }
  }

  hasNode(nodeId) { return this.map.has(nodeId); }

  getNode(nodeId) { return this.map.get(nodeId); }

  getNodeAttribute(nodeId, attribute) {
    let node = this.getNode(nodeId);
    if (node) {
      if (!node.hasAttribute(attribute)) return null;
      return node.getAttribute(attribute);
    }
    return node;
  }

  getNodeStructure(nodeId) {
    return this.getNodeAttribute(nodeId, NODE_FIELD_NAMES.structure);
  }

  getNodeTitle(nodeId) {
    return this.getNodeAttribute(nodeId, NODE_FIELD_NAMES.nodeTitle);
  }

  isEndNode(nodeId) {
    return this.getNode(nodeId)?.hasAttribute(this.fieldNameForNextNode);
  }
  
  isChoiceNode(nodeId) {
    return !this.isEndNode(nodeId) && (this.nextIdsOf(nodeId)?.length > 1);
  }

  /**
   * Returns an array of id(s) of next Node(s).
   * @returns {Array<String>}
   */
  nextIdsOf(nodeId) {
    return this.getNodeAttribute(nodeId, this.fieldNameForNextNode)?.split(',');
  }

  nextNodesOf(nodeId) {
    let nodesArray = this.nextIds(nodeId)?.map(id => this.map.get(id));
    return nodesArray;
  }
}

/**
 * A Pseudo iterator (not strictly following the @iterator protoco)
 * that tranverse from a HTML sections to another one. A Node here 
 * referes to each HTML section that one is walking through.
 */
export class NodeWalker {
  /**
   * @param {NodeList} nodes 
   * @param {String} fieldName
   * @param {String} id 
   */
  constructor(startId, nodeMap, history, eventDispatcher = new EventDispatcher(this)) {
    this._currentId = startId;
    this.nodeMap = nodeMap;
    this.history = history;
    this.eventDispatcher = eventDispatcher;
  }

  get currentId()        {return this._currentId; }
  get currentNode()      {return this.nodeMap.getNode(this._currentId); }
  get currentStructure() {return this.nodeMap.getNodeStructure(this._currentId); }
  get currentTitle()     {return this.nodeMap.getNodeTitle(this._currentId); }
  get isEndNode()        {return this.nodeMap.isEndNode(this._currentId); }
  get isChoiceNode()     {return this.nodeMap.isChoiceNode(this._currentId); }
  get nextIds()          {return this.nodeMap.nextIdsOf(this._currentId); }
  get nextNodes()        {return this.nodeMap.nextNodesOf(this._currentId); }

  /**
   * Create a NodeWaler pseudo iterator from nodes
   * stored in the first encountered template tag.
   * @param {String} id 
   * @returns {NodeWalker}
   */
  static fromTemplateTag(startId) {
    let nodes = document.getElementsByTagName("template")[0].content.childNodes;
    let nodeMap = new NodeMap(nodes);
    let history = new NodeHistory(startId);
    return new NodeWalker(startId, nodeMap, history);
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
    let nextIds = this.nextIds();
    if (this.isChoiceNode) {
      if (nextIds?.includes(nextId)) return this.teleport(nextId);
      return false;
    }
    return this.teleport(nextIds[0]);
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
    for (let id of clone.nextIds()) {
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