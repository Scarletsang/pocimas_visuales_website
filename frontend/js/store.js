import { MediaPreloader, Cache } from "./helpers";
import EventDispatcher from "./eventDispatcher";

let store;
export default store = new Map();

store.set("cache", new Cache());
store.set("mediaPreloader",  new MediaPreloader());
store.set("eventDispatcher", new EventDispatcher());
store.set("entryNodeId", "home");
store.set("nodeFields", {
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
})