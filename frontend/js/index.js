import defineCustomElements from "./components";
import store, {importDefaultDataToStore, importDataToStore} from "./store";
import NodePointer from "./nodePointer";

function main() {
  importDefaultDataToStore();
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = store.get("entryNodeId");
  // setup
  nodesContext( jsonObj => {
    importDataToStore(jsonObj);
    defineCustomElements();
    let nodePointer = new NodePointer(pageId);
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