/** @module DataModules.NodeScopes */
import { constructMemberSetsMap } from "utils/general";

/**
 * An interface to get useful information or properties of the scopes.
 */
export default class NodeScopes {
  constructor(jsonObj) {
    const scopes = Object.entries(jsonObj);
    this._searchById     = new Map(scopes);
    this._searchByHead   = this._constructSearchByhead(scopes);
    this._searchByNodeId = this._constructSearchByNodeId(scopes);
  }

  static JSONFields = {
    head: "head",
    members: "members",
    name: "name"
  };

  getScope(scopeId) { return this._searchById.get(scopeId); }

  hasScope(scopeId)  { return this._searchById.has(scopeId); }

  isInScope(nodeId) { return this._searchByNodeId.has(nodeId); }

  IsScopeHead(nodeId) { return this._searchByHead.has(nodeId); }

  getScopesByNodeId(nodeId)  { return this._searchByNodeId.get(nodeId); }

  getScopesByHeadId(nodeId) {return this._searchByHead.get(nodeId); }

  _constructSearchByhead(scopes) {
    const headField = this.constructor.JSONFields.head;
    const extractFunction = (scopeObj) => {
      return [scopeObj[headField]];
    }
    return constructMemberSetsMap(scopes, extractFunction);
  }

  _constructSearchByNodeId(scopes) {
    const membersField = this.constructor.JSONFields.members;
    const extractFunction = (scopeObj) => {
      return scopeObj[membersField];
    };
    return constructMemberSetsMap(scopes, extractFunction);
  }
}