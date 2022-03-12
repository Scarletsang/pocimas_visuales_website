import LessonList from "./components/lessonList.js";
import NavigationBar from "./components/navigationBar.js";
import { nodeWalker, ENTRY_NODE_ID } from "./store";

function main() {
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = ENTRY_NODE_ID;
  customElements.define('lesson-list', LessonList);
  customElements.define('navigation-bar', NavigationBar);
}

window.addEventListener('DOMContentLoaded', main);