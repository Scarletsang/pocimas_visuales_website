import ComponentRenderer from "./renderer/componentRenderer";
import NodeScopes from "./data/scopes";
import NodeData from "./data/nodes";
import MediaData from "./data/media";

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