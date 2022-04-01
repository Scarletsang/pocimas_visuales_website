import defineCustomElements from "./components";
import NodeInquiry from "./models/nodeInquiry";
import NodeData from "./models/nodeData";
import NodeScopes from "./models/nodeScopes";
import { global, mappings, initStore } from "./store";
import NodePointer from "./nodePointer";

function main() {
  initStore();
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = mappings.get("entryNodeId");
  // setup
  nodesContext( jsonObj => {
    importDataToStore(jsonObj);
    let nodePointer = new NodePointer();
    global.set("nodePointer", nodePointer);
    defineCustomElements();
    window.addEventListener('hashchange', (event) => {
      let pageId = window.location.hash.slice(1);
      nodePointer.id = pageId;
    })
    nodePointer.id = pageId;
  });
}

function importDataToStore(jsonObj) {
  let nodeDataObj   = jsonObj[mappings.get("dataJSONFields").nodes];
  let nodeScopesObj = jsonObj[mappings.get("dataJSONFields").scope];
  let nodeData      = new NodeData(nodeDataObj);
  let nodeScopes    = new NodeScopes(nodeScopesObj);
  global.set("nodeScopes", nodeScopes);
  global.set("nodeInquiry", new NodeInquiry(nodeData, nodeScopes));
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