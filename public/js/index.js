import LessonList from "./components/lessonList";
import NavigationBar from "./components/navigationBar";
import PageContent from "./components/pageContent"
import Page from "./components/page"
import Choice from "./components/choice";
import store, { ENTRY_NODE_ID } from "./store";
import NodeWalker from "./nodeWalker";

function main() {
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = ENTRY_NODE_ID;
  // setup
  nodesContext( nodesObj => {
    const nodeWalker = NodeWalker.fromJSON(nodesObj, pageId);
    store.set("nodeWalker", nodeWalker);
    customElements.define('lesson-list', LessonList);
    customElements.define('navigation-bar', NavigationBar);
    customElements.define('page-content', PageContent);
    customElements.define('page-element', Page);
    customElements.define('choice-element', Choice);
    window.addEventListener('hashchange', (event) => {
      let pageId = window.location.hash.slice(1);
      nodeWalker.teleport(pageId);
    })
    nodeWalker.teleport(pageId);
  });
}

function nodesContext(func) {
  fetchJSON("/data/nodes.json")
  .then( nodesObj => func(nodesObj))
  .catch((err) => console.error(`can't load nodes. Received error: ${err}`));
}

async function fetchJSON(path) {
	let response = await fetch(path);
  return response.json();
}

window.addEventListener('DOMContentLoaded', main);