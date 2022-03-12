import store from "../store.js";
import { generateUID } from "../helpers.js"

export default class ComponentController {
  constructor(host) {
    (this.host = host).addController(this);
    this.id = generateUID();
    this.nodeWalker = store.get("nodeWalker");
    this.eventDispatcher = store.get("eventDispatcher");
  }

  callback() {throw "callback not implemented.";}
  
  hostConnected() {
    let func = () => {this.callback.call(this)}
    this.eventDispatcher.append(this.id, func);
    this.callback();
  }

  hostDisconnected() {
    this.eventDispatcher.delete(this.id);
  }
}