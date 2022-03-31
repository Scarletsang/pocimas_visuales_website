import ComponentRenderer from "./componentRenderer";
import NodeInquiry from "./models/nodeInquiry";
import NodeData from "./models/nodeData";
import NodeScopes from "./models/nodeScopes";

export const global   = new Map();
export const mappings = new Map();

export function initStore() {
  global.set("componentRenderer", new ComponentRenderer());
  mappings.set("entryNodeId", "home");
  mappings.set("nodeFields", {
    id: "id",
    structure: "structure",
    title: "title",
    nextLessonBtnText: "nextLessonBtnText",
    nextIds: "nextIds",
    startId: "startId",
    startText: "startText",
    content: "html",
    choices: "choices"
  });
  mappings.set("scopeFields", {
    head: "head",
    members: "members"
  });
  mappings.set("dataJSONFields", {
    nodes: "nodes",
    scope: "scope"
  });
}

export function importDataToStore(jsonObj) {
  let nodeDataObj   = jsonObj[mappings.get("dataJSONFields").nodes];
  let nodeScopesObj = jsonObj[mappings.get("dataJSONFields").scope];
  let nodeData      = new NodeData(nodeDataObj);
  let nodeScopes    = new NodeScopes(nodeScopesObj);
  global.set("nodeScopes", nodeScopes);
  global.set("nodeInquiry", new NodeInquiry(nodeData, nodeScopes));
}