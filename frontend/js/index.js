import defineCustomElements from "./components";
import {mappings, global, initStore, importDataToStore} from "./store";
import NodePointer from "./nodePointer";

function main() {
  initStore();
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = mappings.get("entryNodeId");
  // setup
  nodesContext( jsonObj => {
    importDataToStore(jsonObj);
    defineCustomElements();
    let nodePointer = new NodePointer(pageId);
    global.set("nodePointer", nodePointer);
    window.addEventListener('hashchange', (event) => {
      let pageId = window.location.hash.slice(1);
      nodePointer.id = pageId;
    })
  });
}

function nodesContext(func) {
  fetchJSON("/data/data.json")
  .then(data => func(data))
  .catch((err) => console.error("can't load nodes. Received error:", err));
}

async function fetchJSON(path) {
	let response = await fetch(path);
  return response.json();
}

window.addEventListener('DOMContentLoaded', main);