import LessonList from "./components/lessonList.js";
import NavigationBar from "./components/navigationBar.js";
import store, { ENTRY_NODE_ID } from "./store";
import NodeWalker from "./nodeWalker.js";

function main() {
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = ENTRY_NODE_ID;
  // setup
  let nodeWalker = NodeWalker.fromTemplateTag(pageId);
  store.set("nodeWalker", nodeWalker);
  customElements.define('lesson-list', LessonList);
  customElements.define('navigation-bar', NavigationBar);

  window.addEventListener('hashchange', (event) => {
    let pageId = window.location.hash.slice(1);
    nodeWalker.teleport(pageId);
  })
  nodeWalker.teleport(pageId);
}

window.addEventListener('DOMContentLoaded', main);