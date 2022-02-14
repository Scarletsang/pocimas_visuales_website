import { renderNodeWalker } from "./nodewalker.js";
import { ENTRY_NODE_FIELD_NAMES, ENTRY_NODE_ID } from "./constants.js";

/**
 * **Renderer main function.** Render a node with the given id to the screen.
 * @param {String} newId the id of the node that will be rendered.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
export function run(newId, ref) {
  let oldId = ref.nodeWalker.currentId;
  console.log(ref);
  if (newId == ENTRY_NODE_ID) {
    ref.nodeWalker.currentId = ENTRY_NODE_ID;
    clearLessonContent(ref);
    homePageStyles(ref);
    homePageNav(ref);
  } 
  else if (!ref.nodeWalker.hash.has(newId)) {
    ref.nodeWalker.shoutInvalidIdError(newId);
  } 
  else {
    ref.nodeWalker.currentId = newId;
    lessonPageStyles(ref, oldId);
    lessonPageContent(ref);
    ref.lessonList.usePrefix = true;
    if (!ref.lessonList.isItemInList(newId)) {
      lessonPageNav(ref);
    }
    ref.lessonList.highlight(newId);
  }
}

/**
 * Render Styles of home page.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
export function homePageStyles(ref) {
  ref.body.classList.add("main-view");
  ref.main.classList.add("center-menu");
  ref.nav.classList.add("center-menu");
  ref.main.classList.remove("overflow-y-scroll");
}

/**
 * Render the home page navigation bar.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
export function homePageNav(ref) {
  ref.lessonList.clear();
  ref.lessonList.usePrefix = false;
  ref.nodeWalker.sandbox(nodeWalker => {
    nodeWalker.fieldNameForNextNode = ENTRY_NODE_FIELD_NAMES.nav;
    nodeWalker.nextIds().forEach(id => {
      nodeWalker.currentId = id;
      ref.lessonList.append(nodeWalker.currentNode);
    });
  });
}

export function lessonPageStyles(ref, oldId) {
  ref.body.classList.remove("main-view");
  ref.main.classList.remove("center-menu");
  ref.nav.classList.remove("center-menu");
  if (oldId == ENTRY_NODE_ID) {
    setTimeout(() => {
      ref.main.classList.add("overflow-y-scroll");
    }, 1000);
  }
  else {ref.main.classList.add("overflow-y-scroll");}
}

export function lessonPageContent(ref) {
  clearLessonContent(ref);
  renderNodeWalker(ref.nodeWalker, ref.lessonContent);
}

export function lessonPageNav(ref) {
  let nodeList = ref.nodeWalker.wanderFromTo(ENTRY_NODE_ID, ref.nodeWalker.currentId);
  let nodeList2 = ref.nodeWalker.wanderTillNodeChoice();
  ref.lessonList.clear();
  ref.lessonList.usePrefix = true;
  ref.lessonList.appendMultiple(nodeList);
  ref.lessonList.appendMultiple(nodeList2);
}

/**
 * Attach event listeners to the icon button.
 * @param {*} elementId id of the icon button.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
export function iconButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    window.location.hash = `#${ENTRY_NODE_ID}`;
  });
}

/**
 * Attach event listeners to the start button.
 * @param {*} elementId id of the start button.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
export function startButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    let startNodeId = ref.nodeWalker.currentNode.getAttribute(ENTRY_NODE_FIELD_NAMES.start);
    window.location.hash = `#${startNodeId}`;
  });
}

export function nextNodeContent(ref, nodeId = null) {
  clearLessonContent(ref);
  let node = ref.nodeWalker.next(nodeId);
  if (node) renderNodeWalker(ref.nodeWalker, ref.lessonContent);
}

export function clearLessonContent(ref) {
  ref.lessonContent.innerHTML = "";
}