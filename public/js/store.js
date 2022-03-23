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
  content: "html",
  choices: "choices"
});