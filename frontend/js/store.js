import ComponentRenderer from "./componentRenderer";

export const global   = new Map();
export const mappings = new Map();

export function initStore() {
  global.set("componentRenderer", new ComponentRenderer());
  mappings.set("entryNodeId", "home");
  mappings.set("nodeFields", {
    id: "id",
    structure: "structure",
    navStructure: "nav",
    title: "title",
    nextLessonBtnText: "nextLessonBtnText",
    nextIds: "nextIds",
    startId: "startId",
    startText: "startText",
    coverImage: "coverImage",
    content: "html",
    data: "data"
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