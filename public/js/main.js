import * as Render from "./renderer.js";
import { NavigationBar } from "./navigationBar.js";
import { NodeWalker } from "./nodeWalker.js";
import { ENTRY_NODE_ID } from "./constants.js";

function main(event) {
  let ref = {
    body: document.getElementsByTagName("body")[0],
    nav:  document.getElementsByTagName("nav")[0],
    main: document.getElementsByTagName("main")[0],
    lessonContent: document.getElementById("lesson-content"),
    nextLessonButton: document.getElementById("next-lesson-btn"),
    lessonList: new NavigationBar(document.getElementById("lesson-list")),
    nodeWalker: NodeWalker.fromTemplateTag(ENTRY_NODE_ID)
  }
  let page = window.location.hash.slice(1);
  if (!page) window.location.hash = `#${ENTRY_NODE_ID}`;
  Render.run(page, ref);
  window.addEventListener("hashchange", (event) => {
    let newId = window.location.hash.slice(1);
    Render.run(newId, ref);
  });
  ref.main.addEventListener("wheel", (event) => {
    if (ref.body.classList.contains("choice-view")) {
      ref.main.scrollLeft += event.deltaY;
    }
  });
  Render.startButton("start-btn", ref);
  Render.iconButton("website-title", ref);
  Render.nextLessonButton("next-lesson-btn", ref);
}

window.addEventListener('DOMContentLoaded', main);