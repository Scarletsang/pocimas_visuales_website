import { global, mappings } from "./store";
import { firstItemInSet, firstIntersectItem, subArrayByItemValues } from "./helpers";

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
    let index = this.walked.indexOf(nodeId);
    if (index != -1) {
      this.walked = this.walked.slice(0, index + 1);
      this.chose = this.chose.filter((choice) => {
        return this.walked.includes(choice);
      });
    }
    else if (lastNode.nextIds?.includes(nodeId)) {
      this.walked.push(nodeId);
      if (lastNode.isLobbyNode) this.chose.push(nodeId);
    }
    else {
      // generate default route
      let result = this.walkFromTo(this.root, nodeId);
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
    let dest = this.nodeInquiry.get(destId);
    if (!dest) return false;
    walked.push(fromId);
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
      return this.walkFromTo(choiceNodeId, destId, Array.from(walked), Array.from(chose), Array.from(originalChose));
    }
    for (const id of node.nextIds) {
      if (walked.includes(id)) continue;
      let result = this.walkFromTo(id, destId, Array.from(walked), Array.from(chose), Array.from(originalChose));
      if (result) return result;
    }
    return false;
  }

  walkedPathInScope(scopeId, nodeId) {
    let scopeHeadId = this.nodeScopes.getScope(scopeId)?.[mappings.get("scopeFields").head];
    if (!scopeHeadId) return false;
    return subArrayByItemValues(this.walked, scopeHeadId, nodeId);
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