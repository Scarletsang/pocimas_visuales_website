import { global, mappings } from "./store";
import NodeWalker from "./nodeWalker"

export default class NodePointer {
  _id;
  constructor() {
    this.nodeInquiry = global.get("nodeInquiry");
    this.componentRenderer = global.get("componentRenderer");
    this.nodeWalker = new NodeWalker(mappings.get("entryNodeId"), this.nodeInquiry, global.get("nodeScopes"));
  }

  get id() {return this._id;}

  get attr() {return this.nodeInquiry.get(this._id);}

  get scopeId() {return this.nodeWalker.chooseScope(this._id);}

  get scopeName() {return this.nodeWalker.nodeScopes.getScope(this.scopeId)[mappings.get("scopeFields").name];}
  
  get walked() {return this.nodeIdsToNodes(this.nodeWalker.walked);}

  get walkedInScope() {
    let result = this.nodeWalker.walkedPathInScope(this.scopeId, this._id);
    return this.nodeIdsToNodes(result);
  }

  set id(newId) {
    if (!this.nodeInquiry.get(newId)) {
      console.error(`unknown nodeId: ${newId}`);
      return ;
    }
    this._id = newId;
    this._triggerSideEffects();
  }
  
  _triggerSideEffects() {
    this.nodeWalker.teleport(this._id);
    this.componentRenderer.render();
  }

  nodeIdsToNodes(nodeIds) {
    return nodeIds?.map((id) => this.nodeInquiry.get(id));
  }
}