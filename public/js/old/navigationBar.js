import { NODE_FIELD_NAMES } from "../store.js";

/**
 * An interface to dynamically create and manipulate the navigation bar
 * where each item in the navigation bar is a link to a lesson (which is 
 * internally seen as a node).
 */
export class NavigationBar {
  /**
   * @param {HTMLOListElement} ol A live ordered list element
   */
  constructor(ol) {
    this.node = ol;
    this.currentOrder = 1;
    this.usePrefix = true;
  }

  /**
   * Append an item to the navigation bar.
   * @param {Node} node
   */
  append(node) {
    let item = this.createItem(node.id, node.getAttribute(NODE_FIELD_NAMES.nodeTitle));
    this.node.appendChild(item);
  }

  /**
   * Extract the information from a given array of nodes to create
   * a navigation bar where each list item is a link to a node in the
   * given list.
   * @param {NodeList} nodeList 
   */
  appendMultiple(nodeList) {
    let fragment = document.createDocumentFragment();
    nodeList.forEach( node => {
      let item = this.createItem(node.id, node.getAttribute(NODE_FIELD_NAMES.nodeTitle));
      fragment.appendChild(item);
    })
    // for (let node of nodeList) {
    // 	let item = this.createItem(node.id, node.getAttribute("lesson-title"));
    // 	fragment.appendChild(item);
    // }
    this.node.appendChild(fragment);
  }

  /**
   * Clear the navigation bar
   */
  clear() {
    this.node.innerHTML = "";
    this.currentOrder = 1;
  }

  /**
   * See if an item is in the navigation bar.
   * @param {String} nodeId 
   * @returns {Boolean}
   */
  isItemInList(nodeId) {
    for (let item of this.node.children) {
      let itemId = new URL(item.href).hash.slice(1);
      if (itemId == nodeId) return true;
    }
    return false;
  }

  /**
   * Turn on highlight of the list item with the given id,
   * and turn off all highlights of other items.
   * @param {String} id
   */
  highlight(id) {
    for (let item of this.node.children) {
      let itemId = new URL(item.href).hash.slice(1);
      if (itemId == id) {
        item.classList.add("highlight");
      } 
      else {
        item.classList.remove("highlight");
      }
    }
  }

  /** private method */
  addPrefix() {
    return `${this.currentOrder}. `;
  }

  /** private method */
  createItem(nodeId, lessonTitle) {
    let a = document.createElement("a");
    a.href = '#' + nodeId;
    a.innerHTML = this.usePrefix? this.addPrefix() + lessonTitle : lessonTitle;
    this.currentOrder++;
    return a;
  }
}