import store from "../store";
import { generateUID } from "../helpers"

export default class ComponentController {
  constructor(host) {
    (this.host = host).addController(this);
    this.id = generateUID();
    this.nodeWalker = store.get("nodeWalker");
    this.eventDispatcher = store.get("eventDispatcher");
  }

  onStructureChange() {}
  
  hostConnected() {
    let func = () => {
      this.host.structure = this.nodeWalker.currentStructure;
      this.onStructureChange.call(this)
    }
    this.eventDispatcher.append(this.id, func);
    this.onStructureChange();
  }

  hostDisconnected() {
    this.eventDispatcher.delete(this.id);
  }
}