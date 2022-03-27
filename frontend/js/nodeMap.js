import store from "./store";

export default class NodeMap {
  constructor(jsonObj, fieldNameForNextNode = store.get("nodeFields").nextIds) {
    this._nodes = new Map(Object.entries(jsonObj));
    this.fieldNameForNextNode = fieldNameForNextNode;
  }

  hasNode(nodeId) { return this._nodes.has(nodeId); }

  getNode(nodeId) { return this._nodes.get(nodeId); }

  getNodeByAttribute(nodeId, attribute) {
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
    return this.getNodeByAttribute(nodeId, this.fieldNameForNextNode);
  }

  nextNodesOf(nodeId) {
    let nodesArray = this.nextIdsOf(nodeId)?.map(id => this._nodes.get(id));
    return nodesArray;
  }
}

export class Scopes {
  constructor(jsonObj) {
    const scopes = Object.entries(jsonObj);
    this._scopeById      = new Map(scopes);
    this._scopesByHead   = new Map();
    this._scopesByNodeId = new Map();
    this._constructScopesByhead(scopes);
    this._constructScopesByNodeId(scopes);
  }

  scopeExist(scopeId)  { return this._scopeById.has(scopeId); }

  getScopeObj(scopeId) { return this._scopeById.get(scopeId); }

  getScopeByAttribute(scopeId, attribute) {
    return this.getScopeObj(scopeId)?.[attribute];
  }

  nodeIsInScope(nodeId) { return this._scopesByNodeId.has(nodeId); }
  
  getScopeNamesByNodeId(nodeId)  { return this._scopesByNodeId.get(nodeId); }

  nodeIsScopeHead(nodeId) { return this._scopesByHead.has(nodeId); }

  getScopeNamesByHeadId(nodeId) {return this._scopesByHead.get(nodeId); }

  _constructScopesByhead(scopes) {
    const headField = store.get("scopeFields").head;
    for(let [scopeName, scopeObj] of scopes) {
      let headId = scopeObj[headField];
      if (this._scopesByHead.has(headId)) {
        this._scopesByHead.get(headId).add(scopeName);
      } else {
        this._scopesByHead.set(headId, new Set([scopeName]));
      }
    }
  }

  _constructScopesByNodeId(scopes) {
    const membersField = store.get("scopeFields").members;
    for(let [scopeName, scopeObj] of scopes) {
      for(let memberId of scopeObj[membersField]) {
        if (this._scopesByNodeId.has(memberId)) {
          this._scopesByNodeId.get(memberId).add(scopeName);
        } else {
          this._scopesByNodeId.set(memberId, new Set([scopeName]));
        }
      }
    }
  }
}