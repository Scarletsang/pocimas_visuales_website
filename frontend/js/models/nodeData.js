import store from "../store";
import { constructSetMap } from "../helpers";

export default class NodeData {
  constructor(jsonObj, fieldNameForNextNode = store.get("nodeFields").nextIds) {
    const nodes = Object.entries(jsonObj);
    this._nodes = new Map(nodes);
    this._choiceNodes = new Map();
    this.fieldNameForNextNode = fieldNameForNextNode;
    this._constructChoiceNodes(nodes);
  }

  hasNode(nodeId) { return this._nodes.has(nodeId); }

  getNode(nodeId) { return this._nodes.get(nodeId); }

  isChoiceNode(nodeId) { return this._choiceNodes.has(nodeId);}

  getNodeByAttribute(node, attribute) {
    let nodeObj = typeof node === "string" ? this.getNode(node) : node;
    // console.log(node, nodeId);
    if (nodeObj) {
      if (!nodeObj.hasOwnProperty(attribute)) return null;
      return nodeObj[attribute];
    }
    return nodeObj;
  }
  
  isEndNode(node) {
    let nodeObj = typeof node === "string" ? this.getNode(node) : node;
    if (nodeObj) return !nodeObj.hasOwnProperty(this.fieldNameForNextNode);
    return nodeObj;
  }
  
  isLobbyNode(node) {
    return !this.isEndNode(node) && (this.nextIdsOf(node)?.length > 1);
  }

  nextIdsOf(node) {
    return this.getNodeByAttribute(node, this.fieldNameForNextNode);
  }

  nextNodesOf(node) {
    let nodesArray = this.nextIdsOf(node)?.map(id => this._nodes.get(id));
    return nodesArray;
  }

  _constructChoiceNodes(nodes) {
    const nextIdsField = store.get("nodeFields").nextIds;
    const extractFunction = (nodeObj) => {
      if (!nodeObj.hasOwnProperty(nextIdsField)) return [];
      let nextids = nodeObj[nextIdsField];
      if (nextids.length <= 1) return [];
      return nextids;
    }
    constructSetMap(nodes, this._choiceNodes, extractFunction);
  }
}