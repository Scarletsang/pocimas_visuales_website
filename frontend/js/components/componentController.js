import {global} from "../store";
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

    /** @property {NodePointer} nodePointer A reference to the singleton NodePointer class */
    this.nodePointer = global.get("nodePointer");

    /** @property {ComponentRenderer} componentRenderer A reference to the component renderer */
    this.componentRenderer = store.get("componentRenderer");
  }

  onHashChange() {}
  
  hostConnected() {
    let func = () => {
      this.host.structure = this.nodePointer.node.structure;
      this.onHashChange.call(this)
    }
    this.componentRenderer.append(this.id, func);
    this.onHashChange();
  }

  hostDisconnected() {
    this.componentRenderer.delete(this.id);
  }
}