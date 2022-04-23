/** @module LogicModules.NodeWalker */
import { mappings } from "./store";
import { firstItemInSet, firstIntersectItem, subArrayByItemValues } from "./helpers";

/**
 * A singleton class responsible for making calculations that involves traversing the nodes in a directed graph, where each node represents one page of the website.
 * 
 * In this version (version 2), this class calculate the following:
 * 
 * 1. the traversed path from the root node to any given nodes.
 * 2. choosing scope for the node pointed by the NodePointer class.
 * 
 * This is part of the singleton nodePointer class, but isolated out, merely for pure calculation that does no side effects.
 */
export default class NodeWalker {
  /**
   * Called by the nodePointer class.
   * @param {BasicTypes.NodeId} root 
   */
  constructor(root, nodeInquiry, nodeScopes) {
    /** @type {DataModules.module:Inquiry.NodeInquiry} */
    this.nodeInquiry = nodeInquiry;

    /** @type {DataModules.module:NodeScopes} */
    this.nodeScopes  = nodeScopes;

    /** 
     * The id of the root node that the nodeWalker starts to traverse from by default.
     * @type {BasicTypes.NodeId} 
     */
    this.root = root;

    /** 
     * An array of the walked path of the nodePointer. This is not a state by any means, but a means of memorization for storing the traversed path from the previous calculation.
     * @type {Array<BasicTypes.NodeId>} 
     * @public
     */
    this.walked = [root];
    
    /** 
     * An array of the choices (in order) that the user has made when they encountered a divergent node. When the NodeWalker encounters a divergent node during the traversal of nodes, the NodeWalker would depend on this variable to traverse (if possible) to the node that the user has chosen previously to walked on.
     * @type {Array<BasicTypes.NodeId>} 
     */
    this.chose = [];
  }

  /**
   * When the user choose to go to a new node, the nodePointer class will call this function to calculate the new traversed path, and store the result in the {@link LogicModules.module:NodeWalker#walked walked property} variable. Meanwhile {@link LogicModules.module:NodeWalker#chose chose property} variable will also be updated based on the path. This is the only function in this class that is capable of updating the {@link LogicModules.module:NodeWalker#walked walked property} and the {@link LogicModules.module:NodeWalker#chose chose property} variables.
   * 
   * Returns false if any operations in the process has failed. Otherwise returns the current instance of the NodeWalker class.
   * 
   * @param {BasicTypes.NodeId} nodeId 
   * @returns {this | false}
   */
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

  /**
   * Walk a step forward in the graph, then return the id of the node. If the current node diverges into multiple nodes, this function will step to the node with the ID specified in the `nextId` parameter. Return false if the `nextId` specified is invalid when the current node diverges. This method does not update any properties of this class.
   * 
   * @param {BasicTypes.NodeId} fromId 
   * @param {BasicTypes.NodeId | null} nextId 
   * @returns {BasicTypes.NodeId | false}
   */
  walk(fromId, nextId = null) {
    let node = this.nodeInquiry.get(fromId);
    if (!node || node.isEndNode) return false;
    if (node.nextIds.length == 1) return node.nextIds[0];
    if (node.nextIds.includes(nextId)) return nextId;
    return false;
  }

  /**
   * An Object that can be used to update the {@link LogicModules.module:NodeWalker#walked walked property} and {@link LogicModules.module:NodeWalker#chose chose property} of this class. 
   * @typedef {object} NodeWalkerStatesObject
   * @property {Array<BasicTypes.NodeId>} walked
   * @property {Array<BasicTypes.NodeId>} chose
   */

  /**
   * Calculate the path from a starting node to a destination node.
   * @param {BasicTypes.NodeId} fromId 
   * @param {BasicTypes.NodeId} destId 
   * @param {Array<BasicTypes.NodeId>} walked Accumulator
   * @param {Array<BasicTypes.NodeId>} chose Accumulator
   * @param {Number} choseIndex Accumulator
   * @returns {NodeWalkerStatesObject | false}
   */
  walkFromTo(fromId, destId, walked = [], chose = [], choseIndex = 0) {
    // Base case
    let dest = this.nodeInquiry.get(destId);
    if (!dest) return false;
    walked.push(fromId);
    if (fromId === destId) return {walked: walked, chose: chose};
    
    // 1. Walk until hitting a divergence (choice node)
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

    // 2. If the NodeWalker hits a divergence, make a choice based on the chosen nodes
    let choiceNodeId = this.walk(nodeId, this.chose[choseIndex++]);
    if (choiceNodeId) {
      walked.push(choiceNodeId);
      chose.push(choiceNodeId);
      if (choiceNodeId === destId) return {walked: walked, chose: chose};
      return this.walkFromTo(choiceNodeId, destId, Array.from(walked), Array.from(chose), choseIndex);
    }

    // 3. If choice is unsucessful, perform a depth first search
    for (const id of node.nextIds) {
      if (walked.includes(id)) continue;
      let result = this.walkFromTo(id, destId, Array.from(walked), Array.from(chose), choseIndex);
      if (result) return result;
    }
    return false;
  }

  /**
   * Returns the first group of consecutive nodes in the traversed path that are a member of the specified scope.
   * @param {BasicTypes.ScopeId} scopeId 
   * @param {BasicTypes.NodeId} nodeId 
   * @returns {Array<BasicTypes.NodeId> | false}
   */
  walkedPathInScope(scopeId, nodeId) {
    let scopeHeadId = this.nodeScopes.getScope(scopeId)?.[mappings.get("scopeFields").head];
    if (!scopeHeadId) return false;
    return subArrayByItemValues(this.walked, scopeHeadId, nodeId);
  }

  /**
   * Determines the scope that the given node is in. (A node might be a member of multiple scopes) This method make the decision based on the traversed path (stored in the {@link LogicModules.module:NodeWalker#walked walked property}). Returns false if the node is not a member of any scopes.
   * @param {BasicTypes.NodeId} nodeId 
   * @returns {BasicTypes.ScopeId | false}
   */
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