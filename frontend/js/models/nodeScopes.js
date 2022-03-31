import {mappings} from "../store";
import { constructSetMap } from "../helpers";

export default class NodeScopes {
  constructor(jsonObj) {
    const scopes = Object.entries(jsonObj);
    this._searchById     = new Map(scopes);
    this._searchByHead   = new Map();
    this._searchByNodeId = new Map();
    this._constructSearchByhead(scopes);
    this._constructSearchByNodeId(scopes);
  }

  getScope(scopeId) { return this._searchById.get(scopeId); }

  hasScope(scopeId)  { return this._searchById.has(scopeId); }

  isInScope(nodeId) { return this._searchByNodeId.has(nodeId); }

  IsScopeHead(nodeId) { return this._searchByHead.has(nodeId); }

  getScopesByNodeId(nodeId)  { return this._searchByNodeId.get(nodeId); }

  getScopesByHeadId(nodeId) {return this._searchByHead.get(nodeId); }

  _constructSearchByhead(scopes) {
    const headField = mappings.get("scopeFields").head;
    const extractFunction = (scopeObj) => {
      return [scopeObj[headField]];
    }
    constructSetMap(scopes, this._searchByHead, extractFunction);
  }

  _constructSearchByNodeId(scopes) {
    const membersField = mappings.get("scopeFields").members;
    const extractFunction = (scopeObj) => {
      return scopeObj[membersField];
    };
    constructSetMap(scopes, this._searchByNodeId, extractFunction);
  }
}