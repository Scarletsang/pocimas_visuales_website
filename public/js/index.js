import LessonList from "./components/lessonList";
import NavigationBar from "./components/navigationBar";
import PageContent from "./components/pageContent"
import Page from "./components/page"
import store, { ENTRY_NODE_ID } from "./store";
import NodeWalker from "./nodeWalker";

function main() {
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = ENTRY_NODE_ID;
  // setup
  let nodeWalker;
  fetchJSON("/data/nodes.json")
  .then((data) => {
    nodeWalker = NodeWalker.fromJSON(data, pageId);
  })
  .catch((err) => console.error("can't load nodes", err));
  store.set("nodeWalker", nodeWalker);

  customElements.define('lesson-list', LessonList);
  customElements.define('navigation-bar', NavigationBar);
  customElements.define('page-content', PageContent);
  customElements.define('page-element', Page);

  window.addEventListener('hashchange', (event) => {
    let pageId = window.location.hash.slice(1);
    nodeWalker.teleport(pageId);
  })
  nodeWalker.teleport(pageId);
}

async function fetchJSON(path) {
	let response = await fetch(path);
  return response.json;
}

window.addEventListener('DOMContentLoaded', main);