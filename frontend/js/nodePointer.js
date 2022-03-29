import store from "./store";
import NodeWalker from "./nodeWalker"

export default class NodePointer {
  constructor(startId) {
    this._id = startId;
    this.componentRenderer = store.get("componentRenderer");
    this.nodeWalker = new NodeWalker(store.get("entryNodeId"), this);
    this._triggerSideEffects();
  }

  get id() {return this._id;}

  set id(newId) {
    this._id = newId;
    this._triggerSideEffects();
  }
  
  _triggerSideEffects() {
    this.nodeWalker.teleport(this._id);
    this.componentRenderer.render();
  }
}