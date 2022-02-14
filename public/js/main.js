import * as Render from "./renderer.js";
import { NavigationBar } from "./navigationBar.js";
import { NodeWalker } from "./nodewalker.js";
import { ENTRY_NODE_ID } from "./constants.js";

function main(event) {
  let ref = {
    body: document.getElementsByTagName("body")[0],
    nav:  document.getElementsByTagName("nav")[0],
    main: document.getElementsByTagName("main")[0],
    lessonContent: document.getElementById("lesson-content"),
    lessonList: new NavigationBar(document.getElementById("lesson-list")),
    nodeWalker: NodeWalker.fromTemplateTag(ENTRY_NODE_ID)
  }
  if (window.location.hash.slice(1)) window.location.hash = `#${ENTRY_NODE_ID}`;
  Render.run(ENTRY_NODE_ID, ref);
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
}

window.addEventListener('DOMContentLoaded', main);