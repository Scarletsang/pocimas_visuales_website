export default class EventDispatcher {
  constructor() {
    this._events = [];
    this._unresolved = new Map();
  }

  append(id, func) {
    this._events.push({id: id, func: func});
    if (this._unresolved.has(id)) this._resolve(id);
  }

  prepend(id, func) {
    this._events.unshift({id: id, func: func});
    if (this._unresolved.has(id)) this._resolve(id);
  }

  delete(id) {
    let index = this._events.findIndex((event) => event.id == id);
    if (index >= 0) this._events.splice(index, 1);
  }

  _resolve(id) {
    this._unresolved.get(id).forEach((eventObject) => {
      let insertFunction;
      if (eventObject.mode == "before") insertFunction = this.insertBefore;
      if (eventObject.mode == "after")  insertFunction = this.insertAfter;
      insertFunction(id, eventObject.id, eventObject.func);
    });
    this._unresolved.delete(id);
  }

  insertAtIndex(index, eventObject) {
    if (index < 0) {
      if (this._unresolved.has(nextId)) {
        this._unresolved.set(nextId, this._unresolved.get(nextId).push(eventObject))
      } else {
        this._unresolved.set(nextId, [eventObject]);
      }
    } else {
      this._events.splice(index, 0, eventObject);
    }
  }

  insertBefore(nextId, id, func) {
    let nextIdIndex = this._events.findIndex((event) => event.id == nextId);
    let eventObject = {mode: "before", id: id, func: func};
    this.insertAtIndex(nextIdIndex, eventObject);
  }

  insertAfter(lastId, id, func) {
    let lastIdIndex = this._events.findIndex((event) => event.id == lastId);
    let eventObject = {mode: "after", id: id, func: func};
    this.insertAtIndex(lastIdIndex + 1, eventObject);
  }

  dispatch() {
    this._events.forEach(({id, func}) => func() );
  }

}