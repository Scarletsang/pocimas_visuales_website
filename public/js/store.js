import { NavigationBar } from "./old/navigationBar.js";
import { NodeWalker } from "./nodeWalker.js";
import { ENTRY_NODE_ID } from "./constants.js";
import { MediaPreloader, Cache} from "./helpers.js";

export const body = document.getElementsByTagName("body")[0];
export const nav  =  document.getElementsByTagName("nav")[0];
export const main = document.getElementsByTagName("main")[0];
export const nextLessonButton = document.getElementById("next-lesson-btn");
export const popup = document.getElementById("popup");
export const cache = new Cache();
export const lessonList = new NavigationBar(document.getElementById("lesson-list"));
export const nodeWalker = NodeWalker.fromTemplateTag(ENTRY_NODE_ID);
export const mediaPreloader = new MediaPreloader();

export const ENTRY_NODE_ID = "home";
export const NODE_FIELD_NAMES = {
  nodeTitle: "lesson-title",
  structure: "structure",
  nextNode: "next"
};

console.log("hihi");