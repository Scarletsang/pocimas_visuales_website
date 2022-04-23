/** @module RendererModules.ComponentController */

import { global } from "../store";
import { generateUID } from "../utils/general";

/**
 * A base for a lit component controller that register itself with the event dispatcher, so that the singleton class nodeWalker will update the target component when {@link LogicModules.module:NodeWalker#teleport NodeWalker's teleport function} is called.
 */
export default class ComponentController {
  constructor(host) {
    /** 
     * The lit eomponent that this controller controls.
     * @type {LitElement}
    */
    (this.host = host).addController(this);

    /**
     * A unique id for each component.
     *  @type {string} 
     */
    this.id = generateUID();

    /** 
     * A reference to the singleton NodePointer class.
     * @type {LogicModules.module:NodePointer}
    */
    this.nodePointer = global.get("nodePointer");

    /** 
     * A reference to the component renderer.
     * @type {RendererModules.module:ComponentRenderer}
     */
    this.componentRenderer = global.get("componentRenderer");
  }

  onHashChange() {}
  
  hostConnected() {
    let func = () => {
      this.onHashChange.call(this)
    }
    this.componentRenderer.append(this.id, func);
    this.onHashChange();
  }

  hostDisconnected() {
    this.componentRenderer.delete(this.id);
  }
}