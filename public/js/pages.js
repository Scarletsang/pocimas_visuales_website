import { ENTRY_NODE_ID } from "./constants.js";
import { PageRenderer } from "./renderer.js";

/**
 * **Renderer main function.** Render a node with the given id to the screen.
 * @param {String} newId the id of the node that will be rendered.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
export function run(newId, ref) {
  let lastId = ref.nodeWalker.currentId;
  if (ref.nodeWalker.teleport(newId)) return router(lastId, ref);
  ref.nodeWalker.shoutInvalidIdError(newId);
}

function router(lastId, ref) {
  let routes = {
    "main": MainPage,
    "content": ContentPage,
    "choice": ChoicePage,
    "resource": ResourcePage,
    "info": InfoPage,
    "cinema": CinemaPage
  }
  let structureType = ref.nodeWalker.currentNode.getAttribute("structure");
  if (!structureType) console.error(`There is no structure attribute defined on this node. Node id: ${ref.nodeWalker.currentId}`);
  let renderer = routes[structureType];
  if (!renderer) console.error(`Invalid structure type detected on this node. Node id: ${ref.nodeWalker.currentId}`);
  new renderer(lastId, ref).render();
}

class MainPage extends PageRenderer {
  renderStyles() {
    this.ref.body.classList = "";
    this.ref.body.classList.add("main-view");
    this.ref.main.classList.add("center-menu");
    this.ref.nav.classList.add("center-menu");
    this.ref.nextLessonButton.classList.add("hide");
    this.ref.main.classList.remove("overflow-x-scroll");
    this.ref.main.classList.remove("overflow-y-scroll");
  }

  renderNav() {
    let nodeArray = this.ref.nodeWalker.nextIdsOf(ENTRY_NODE_ID);
    nodeArray.splice(-1);
		this.ref.lessonList.usePrefix = false;
		this.renderNavFrom(nodeArray);
  }
}

// Default page renderer
class ContentPage extends PageRenderer {
  renderStyles() {
    this.defaultStyles();
    this.defaultNextLessonBtnStyles();
    this.verticalScroll();
  }
}

class ChoicePage extends PageRenderer {
  renderStyles() {
    this.defaultStyles();
    this.horizontalScroll();
    this.defaultNextLessonBtnStyles();
    this.ref.body.classList.add("choice-view");
  }

  attachEventListeners() {
    let choices = this.ref.main.getElementsByClassName("lesson-content")[0].getElementsByTagName("section");
    let nextIds = this.ref.nodeWalker.nextIds();
    for (let i = 0; i < choices.length; i++) {
      choices[i].addEventListener("click", () => {
        window.location.hash = `#${nextIds[i]}`;
      });
    }
  }
}

class ResourcePage extends PageRenderer {
  renderStyles() {
    this.defaultStyles();
    this.verticalScroll();
    this.defaultNextLessonBtnStyles();
    this.ref.body.classList.add("resource-view");
  }
}

class InfoPage extends PageRenderer {
  renderStyles() {
    this.defaultStyles();
    this.verticalScroll();
    this.ref.nextLessonButton.classList.add("hide");
  }
  
  renderNav() {
    let nodeArray = this.ref.nodeWalker.nextIdsOf(ENTRY_NODE_ID);
    nodeArray.splice(-1);
    this.ref.lessonList.usePrefix = false;
    this.renderNavFrom(nodeArray);
  }
}

class CinemaPage extends PageRenderer {
  renderStyles() {
    this.defaultStyles();
    this.verticalScroll();
    this.defaultNextLessonBtnStyles();
    this.ref.body.classList.add("cinema-view");
  }

  renderNav() {
    this.ref.lessonList.clear();
  }
}

export function iconButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    window.location.hash = `#${ENTRY_NODE_ID}`;
  });
}

export function startButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    let nextIds = ref.nodeWalker.nextIds();
    let startNodeId = nextIds[nextIds.length - 1];
    window.location.hash = `#${startNodeId}`;
  });
}

export function nextLessonButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    if (!ref.nodeWalker.isEndNode && !ref.nodeWalker.isChoiceNode) {
      let nextNodeId = ref.nodeWalker.nextIds()[0];
      window.location.hash = `#${nextNodeId}`;
    }
  });
}

export function closePopupButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    ref.popup.classList.add("hide");
  });
}