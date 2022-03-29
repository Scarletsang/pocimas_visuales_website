import ComponentRenderer from "./componentRenderer";

let store;
export default store = new Map();

export function importDefaultDataToStore() {
  store.set("componentRenderer", new ComponentRenderer());
  store.set("entryNodeId", "home");
  store.set("nodeFields", {
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
  store.set("scopeFields", {
    head: "head",
    members: "members"
  });
  store.set("dataJSONFields", {
    nodes: "nodes",
    scope: "scope"
  });
}

export function importDataToStore(jsonObj) {
  store.set("nodeData", jsonObj[store.get("dataJSONFields").nodes]);
  store.set("nodeScopes", jsonObj[store.get("dataJSONFields").scope]);
}