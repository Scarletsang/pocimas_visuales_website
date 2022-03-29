import getNodeInfo from "./models/node";
import store from "./store";

export default class NodeWalker {
  constructor(root, nodePointer) {
    this.nodePointer = nodePointer;
    this.root = root;
    this.walked = [root];
    this.chose = [];
  }

  teleport(nodeId) {
    let node = getNodeInfo(nodeId, store);
    if (!node) return false;
    let lastNode = getNodeInfo(this.walked.slice(-1)[0]);
    if (lastNode.nextIds?.includes(nodeId)) {
      this.walked.push(nodeId);
      if (lastNode.isLobbyNode) this.chose.push(nodeId);
    } else {
      let {walked, chose} = this.walkFromTo(root, nodeId);
      this.walked = walked;
      this.chose = chose;
    }
    return this;
  }

  walk(nextId = null) {

  }

  walkFromTo(fromId, destId) {

  }

  walkInScopeTo(scopeId, destId) {

  }

}