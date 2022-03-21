import { MediaPreloader, Cache } from "./helpers";
import EventDispatcher from "./eventDispatcher";

export const body = document.getElementsByTagName("body")[0];
export const nav  =  document.getElementsByTagName("nav")[0];
export const main = document.getElementsByTagName("main")[0];
export const nextLessonButton = document.getElementById("next-lesson-btn");
export const popup = document.getElementById("popup");
export const cache = new Cache();
export const mediaPreloader = new MediaPreloader();

export const ENTRY_NODE_ID = "home";
export const NODE_FIELD_NAMES = {
  nodeTitle: "title",
  structure: "structure",
  nextNode: "next"
};


let store;
export default store = new Map();

store.set("cache", new Cache());
store.set("mediaPreloader", new MediaPreloader());
store.set("eventDispatcher", new EventDispatcher());