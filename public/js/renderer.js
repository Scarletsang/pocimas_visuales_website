import { renderNodeWalker } from "./nodewalker.js";
import { ENTRY_NODE_FIELD_NAMES, ENTRY_NODE_ID } from "./constants.js";

/**
 * **Renderer main function.** Render a node with the given id to the screen.
 * @param {String} newId the id of the node that will be rendered.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
export function run(newId, ref) {
  let lastId = ref.nodeWalker.currentId;
  ref.nodeWalker.currentId = newId;
  if (ref.nodeWalker.hash.has(newId)) return router(lastId, ref);
  ref.nodeWalker.shoutInvalidIdError(newId);
}

function router(lastId, ref) {
  let routes = {
    "main": mainPage,
    "content": contentPage,
    "choice": choicePage,
    "resource": resourcePage
  }
  let structureType = ref.nodeWalker.currentNode.getAttribute("structure");
  if (!structureType) console.error(`There is no structure attribute defined on this node. Node id: ${ref.nodeWalker.currentId}`);
  let structureFunction = routes[structureType];
  if (!structureFunction) console.error(`Invalid structure type detected on this node. Node id: ${ref.nodeWalker.currentId}`);
  structureFunction(lastId, ref);
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

function mainPage(lastId, ref) {
  clearLessonContent(ref);
  ref.body.classList = "";
  ref.body.classList.add("main-view");
  ref.main.classList.add("center-menu");
  ref.nav.classList.add("center-menu");
  ref.lessonContent.classList.add("focus");
  ref.main.classList.remove("overflow-x-scroll");
  ref.main.classList.remove("overflow-y-scroll");
  homePageNav(ref);
}

function contentPage(lastId, ref) {
  lessonPageBase(lastId, ref);
  ref.main.classList.remove("overflow-x-scroll");
  let addScrollFunction = () => {ref.main.classList.add("overflow-y-scroll")};
  if (lastId == ENTRY_NODE_ID) {
    setTimeout(addScrollFunction, 1000);
  }
  else {addScrollFunction()};
}

function choicePage(lastId, ref) {
  lessonPageBase(lastId, ref);
  ref.body.classList.add("choice-view");
  ref.main.classList.remove("overflow-y-scroll");
  let addScrollFunction = () => {ref.main.classList.add("overflow-x-scroll")};
  if (lastId == ENTRY_NODE_ID) {
    setTimeout(addScrollFunction, 1000);
  }
  else {addScrollFunction()};
}

function resourcePage(lastId, ref) {
  lessonPageBase(lastId, ref);
  ref.body.classList.add("resource-view");
  ref.main.classList.remove("overflow-x-scroll");
  let addScrollFunction = () => {ref.main.classList.add("overflow-y-scroll")};
  if (lastId == ENTRY_NODE_ID) {
    setTimeout(addScrollFunction, 1000);
  }
  else {addScrollFunction()};
}

function lessonPageBase(lastId, ref) {
  lessonPageStyles(ref, lastId);
  lessonPageContent(ref);
  ref.lessonList.usePrefix = true;
  lessonPageNav(ref);
}

/**
 * Render the home page navigation bar.
 * @param {*} ref A global store that get passed down in every renderer functions.
 */
function homePageNav(ref) {
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

function lessonPageStyles(ref, oldId) {
  ref.body.classList = "";
  ref.main.classList.remove("center-menu");
  ref.nav.classList.remove("center-menu");
}

function lessonPageContent(ref) {
  clearLessonContent(ref);
  renderNodeWalker(ref.nodeWalker, ref.lessonContent);
}

function lessonPageNav(ref) {
  if (!ref.lessonList.isItemInList(ref.nodeWalker.currentId)) {
    let nodeList = ref.nodeWalker.wanderFromTo(ENTRY_NODE_ID, ref.nodeWalker.currentId);
    let nodeList2 = ref.nodeWalker.wanderTillNodeChoice();
    ref.lessonList.clear();
    ref.lessonList.usePrefix = true;
    ref.lessonList.appendMultiple(nodeList);
    ref.lessonList.appendMultiple(nodeList2);
  }
  ref.lessonList.highlight(ref.nodeWalker.currentId);
}

function nextNodeContent(ref, nodeId = null) {
  clearLessonContent(ref);
  let node = ref.nodeWalker.next(nodeId);
  if (node) renderNodeWalker(ref.nodeWalker, ref.lessonContent);
}

function clearLessonContent(ref) {
  ref.lessonContent.innerHTML = "";
}