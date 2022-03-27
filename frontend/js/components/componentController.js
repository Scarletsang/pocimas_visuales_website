import store from "../store";
import { generateUID } from "../helpers";

/**
 * A base for a lit component controller that register itself with the event dispatcher, so that the singleton class nodeWalker will update the target component when {@link NodeWalker.teleport} is called.
 */
export default class ComponentController {
  constructor(host) {
    /** @property {LitElement} host The lit eomponent that this controller controls*/
    (this.host = host).addController(this);

    /** @property {String} id A unique id for each component */
    this.id = generateUID();

    /** @property {NodeWalker} nodeWalker A reference to the singleton NodeWalker class */
    this.nodeWalker = store.get("nodeWalker");

    /** @property {EventDispatcher} eventDispatcher A reference to the event dispatcher */
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