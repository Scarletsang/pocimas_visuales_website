import store from "../store";
import { constructSetMap } from "../helpers";

export default class NodeScopes {
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
    const extractFunction = (scopeObj) => {
      return [scopeObj[headField]];
    }
    constructSetMap(scopes, this._scopesByHead, extractFunction);
  }

  _constructScopesByNodeId(scopes) {
    const membersField = store.get("scopeFields").members;
    const extractFunction = (scopeObj) => {
      return scopeObj[membersField];
    };
    constructSetMap(scopes, this._scopesByNodeId, extractFunction);
  }
}