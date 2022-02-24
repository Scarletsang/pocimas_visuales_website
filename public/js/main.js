import * as Render from "./renderer.js";
import { NavigationBar } from "./navigationBar.js";
import { NodeWalker } from "./nodeWalker.js";
import { ENTRY_NODE_ID } from "./constants.js";
import { browserSupportsPassiveEvent, MediaPreloader, Cache} from "./helpers.js";

function main(event) {
  let ref = {
    body: document.getElementsByTagName("body")[0],
    nav:  document.getElementsByTagName("nav")[0],
    main: document.getElementsByTagName("main")[0],
    nextLessonButton: document.getElementById("next-lesson-btn"),
    popup: document.getElementById("popup"),
    cache: new Cache(),
    lessonList: new NavigationBar(document.getElementById("lesson-list")),
    nodeWalker: NodeWalker.fromTemplateTag(ENTRY_NODE_ID),
    mediaPreloader: new MediaPreloader()
  }
  let pageId = window.location.hash.slice(1);
  if (!pageId) pageId = ENTRY_NODE_ID;
  Render.run(pageId, ref);
  window.addEventListener("hashchange", (event) => {
    let newId = window.location.hash.slice(1);
    Render.run(newId, ref);
  });
  ref.main.addEventListener("wheel", (event) => {
    if (ref.body.classList.contains("choice-view")) {
      ref.main.scrollLeft += event.deltaY;
    }
  }, browserSupportsPassiveEvent ? {passive: true} : false);
  Render.startButton("start-btn", ref);
  Render.iconButton("website-icon-image", ref);
  Render.nextLessonButton("next-lesson-btn", ref);
  Render.closePopupButton("close-popup-btn", ref);
}

window.addEventListener('DOMContentLoaded', main);