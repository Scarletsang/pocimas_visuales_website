import { constructMemberSetsMap } from "../helpers";

/** @typedef {String} NodeId  ID of a node */

/**
 * An interface to get the data of every node (a.k.a. every page of the website).
 */
export default class NodeData {
  /**
   * 
   * @param {{[nodeId: String]: RawNodeData}} jsonObj 
   */
  constructor(jsonObj) {
    const nodes = Object.entries(jsonObj);
    this._nodes = new Map(nodes);
    this._choiceNodes = this._constructChoiceNodes(nodes);
  }

  static JSONFields = {
    id: "id",
    structure: "structure",
    navStructure: "nav",
    title: "title",
    nextLessonBtnText: "nextLessonBtnText",
    nextIds: "nextIds",
    content: "html",
    data: "data"
  }

  hasNode(nodeId) { return this._nodes.has(nodeId); }

  getNode(nodeId) { return this._nodes.get(nodeId); }

  isChoiceNode(nodeId) { return this._choiceNodes.has(nodeId);}

  getNodeAttribute(node, attribute) {
    let nodeObj = typeof node === "string" ? this.getNode(node) : node;
    if (nodeObj) {
      if (!nodeObj.hasOwnProperty(attribute)) return null;
      return nodeObj[attribute];
    }
    return nodeObj;
  }
  
  isEndNode(node) {
    let nodeObj = typeof node === "string" ? this.getNode(node) : node;
    if (nodeObj) return !nodeObj.hasOwnProperty(this.constructor.JSONFields.nextIds);
    return nodeObj;
  }
  
  isLobbyNode(node) {
    return this.nextIdsOf(node)?.length > 1;
  }

  nextIdsOf(node) {
    return this.getNodeAttribute(node, this.constructor.JSONFields.nextIds);
  }

  nextNodesOf(node) {
    let nodesArray = this.nextIdsOf(node)?.map(id => this._nodes.get(id));
    return nodesArray;
  }

  _constructChoiceNodes(nodes) {
    const nextIdsField = this.constructor.JSONFields.nextIds;
    const extractFunction = (nodeObj) => {
      if (!nodeObj.hasOwnProperty(nextIdsField)) return [];
      let nextids = nodeObj[nextIdsField];
      if (nextids.length <= 1) return [];
      return nextids;
    }
    return constructMemberSetsMap(nodes, extractFunction);
  }
}