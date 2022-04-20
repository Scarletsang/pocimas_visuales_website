import ComponentRenderer from "./componentRenderer";
import NodeScopes from "./models/nodeScopes";
import NodeData from "./models/nodeData";
import MediaData from "./models/mediaData";

export const global   = new Map();
export const mappings = new Map();

export function initStore() {
  global.set("componentRenderer", new ComponentRenderer());
  mappings.set("entryNodeId", "home");
  mappings.set("nodeFields", NodeData.JSONFields);
  mappings.set("scopeFields", NodeScopes.JSONFields);
  mappings.set("mediaFields", MediaData.JSONFields);
  mappings.set("dataJSONFields", {
    nodes: "nodes",
    scope: "scope",
    media: "media"
  });
}