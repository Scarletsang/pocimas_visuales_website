export default function controlledByEvent(eventSerielizer, componentName) {
  return class ComponentController {
    host;
    constructor(host) {
      (this.host = host).addController(this);
    }

    callback(event) {throw "callback not implemented.";}

    hostConnected() {
      eventSerielizer.append(componentName, this.callback);
    }

    hostDisconnected() {
      eventSerielizer.delete(componentName);
    }
  }
}