import {global, mappings} from "./store";
import { firstItemInSet, firstIntersectItem} from "./helpers";

export default class NodeWalker {
  constructor(root) {
    this.nodeInquiry = global.get("nodeInquiry");
    this.nodeScopes  = global.get("nodeScopes");
    this.root = root;
    this.walked = [root];
    this.chose = [];
  }

  teleport(nodeId) {
    let node = this.nodeInquiry.get(nodeId);
    if (!node) return false;
    let lastNode = this.nodeInquiry.get(this.walked.slice(-1)[0]);
    if (lastNode.nextIds?.includes(nodeId)) {
      this.walked.push(nodeId);
      if (lastNode.isLobbyNode) this.chose.push(nodeId);
    } else {
      let result = this.walkFromTo(root, nodeId);
      if (!result) return false;
      this.walked = result.walked;
      this.chose = result.chose;
    }
    return this;
  }

  walk(fromId, nextId = null) {
    let node = this.nodeInquiry.get(fromId);
    if (!node || node.isEndNode) return false;
    if (node.nextIds.length == 1) return node.nextIds[0];
    if (node.nextIds.includes(nextId)) return nextId;
    return false;
  }

  walkFromTo(fromId, destId, walked = [], chose = [], originalChose = Array.from(this.chose)) {
    let destId = this.nodeInquiry.get(destId);
    if (!dest) return false;
    if (fromId === destId) return {walked: walked, chose: chose};
    let nodeId = fromId;
    while (true) {
      let nextNodeId = this.walk(nodeId);
      if (!nextNodeId) break;
      nodeId = nextNodeId;
      walked.push(nextNodeId);
      if (nodeId === destId) return {walked: walked, chose: chose};
    }
    let node = this.nodeInquiry.get(nodeId);
    if (node.isEndNode) return false;
    let choiceNodeId = this.walk(nodeId, originalChose.shift());
    if (choiceNodeId) {
      walked.push(choiceNodeId);
      chose.push(choiceNodeId);
      if (choiceNodeId === destId) return {walked: walked, chose: chose};
      return this.walkFromTo(nextNodeId, destId, walked, chose, originalChose);
    }
    for (const id of node.nextIds) {
      if (walked.includes(id)) continue;
      let result = this.walkFromTo(nodeId, destId, walked, chose, originalChose);
      if (result) return result;
    }
    return false;
  }

  walkInScopeTo(scopeId, destId) {
    let scopeHeadId = this.nodeScopes.getScope(scopeId)?.[mappings.get("scopeFields").head];
    if (!scopeHeadId) return false;
    return this.walkFromTo(scopeHeadId, destId);
  }

  chooseScope(nodeId) {
    let scopes = this.nodeInquiry.get(nodeId)?.scopes;
    if (!scopes) return false;
    if (scopes.size === 1 || this.walked.length === 1) {
      return firstItemInSet(scopes);
    }
    for (const walked of this.walked) {
      let scopes2 = this.nodeScopes.getScopesByHeadId(walked);
      if (!scopes2) continue;
      let scope = firstIntersectItem(scopes, scopes2);
      if (scope) return scope;
    }
    return firstItemInSet(scopes);
  }

}