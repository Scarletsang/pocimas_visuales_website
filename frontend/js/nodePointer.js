import {global, mappings} from "./store";
import NodeWalker from "./nodeWalker"

export default class NodePointer {
  constructor(startId) {
    this._id = startId;
    this.nodeInquiry = global.get("nodeInquiry");
    this.componentRenderer = global.get("componentRenderer");
    this.nodeWalker = new NodeWalker(mappings.get("entryNodeId"));
    this._triggerSideEffects();
  }

  get id() {return this._id;}

  get node() {return this.nodeInquiry.get(this._id);}

  get scope() {return this.nodeWalker.chooseScope(this._id);}
  
  get walked() {return this._nodeIdsToNodes(this.nodeWalker.walked);}

  walkedInScope() {
    let nodeIds = this.nodeWalker.walkInScopeTo(this.scope, this._id);
    return this._nodeIdsToNodes(nodeIds);
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

  _nodeIdsToNodes(nodeIds) {
    return nodeIds?.map((id) => this.nodeInquiry.get(id));
  }
}