import { ENTRY_NODE_FIELD_NAMES, ENTRY_NODE_ID } from "./constants.js";

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

function mainPage(lastId, ref) {
  lessonPageContent(ref);
  preloadNextLessonMedia(ref);
  ref.body.classList = "";
  ref.body.classList.add("main-view");
  ref.main.classList.add("center-menu");
  ref.nav.classList.add("center-menu");
  ref.nextLessonButton.classList.add("hide");
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
  choicePageCLickableSections(ref);
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

////////////////////////////////////
///////  General renderers  ////////
////////////////////////////////////

function lessonPageBase(lastId, ref) {
  lessonPageStyles(ref);
  lessonPageContent(ref);
  preloadNextLessonMedia(ref);
  ref.lessonList.usePrefix = true;
  lessonPageNav(ref);
}

function lessonPageStyles(ref) {
  ref.body.classList = "";
  ref.main.classList.remove("center-menu");
  ref.nav.classList.remove("center-menu");
  if (ref.nodeWalker.isEndNode || ref.nodeWalker.isChoiceNode) {
    ref.nextLessonButton.classList.add("hide");
  } else {
    ref.nextLessonButton.classList.remove("hide");
  }
}

function preloadNextLessonMedia(ref) {
  if (ref.nodeWalker.isEndNode) return ;
  ref.nodeWalker.nextIds().forEach( id => {
    let nextNode = ref.nodeWalker.hash.get(id);
    let images = nextNode.getElementsByTagName("img");
    for (const image of images) {
      ref.mediaPreloader.addImage(image.src);
    }
  });
}

function lessonPageContent(ref) {
  clearLessonContent(ref);
  ref.main.insertBefore(ref.nodeWalker.currentNode, ref.nextLessonButton);
}

function lessonPageNav(ref) {
  if (!ref.lessonList.isItemInList(ref.nodeWalker.currentId)) {
    let nodeList = ref.nodeWalker.wanderFromTo(ENTRY_NODE_ID, ref.nodeWalker.currentId);
    let nodeList2 = ref.nodeWalker.wanderTillNodeChoice();
    ref.lessonList.clear();
    ref.lessonList.usePrefix = true;
    ref.lessonList.appendMultiple(nodeList.slice(1)); //slice to prevent showing home page in the navigation bar.
    ref.lessonList.appendMultiple(nodeList2);
  }
  ref.lessonList.highlight(ref.nodeWalker.currentId);
}

function clearLessonContent(ref) {
  let cache = document.getElementById("cache");
  let lessonContents = ref.main.getElementsByTagName("section");
  for (let content of lessonContents) {
    cache.appendChild(content);
  }
}

////////////////////////////////////
//// Individual pages renderers ////
////////////////////////////////////

function homePageNav(ref) {
  ref.lessonList.clear();
  ref.lessonList.usePrefix = false;
  let clone = ref.nodeWalker.clone();
  clone.fieldNameForNextNode = ENTRY_NODE_FIELD_NAMES.nav;
  clone.nextIds().forEach(id => {
    ref.lessonList.append(clone.hash.get(id));
  });
}

function choicePageCLickableSections(ref) {
  let choices = ref.main.getElementsByClassName("lesson-content")[0].getElementsByTagName("section");
  let nextIds = ref.nodeWalker.nextIds();
  for (let i = 0; i < choices.length; i++) {
    choices[i].addEventListener("click", () => {
      window.location.hash = `#${nextIds[i]}`;
    });
  }
}

////////////////////////////////////
/////  Button's event attacher /////
//////////////////////////////////// 

export function iconButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    window.location.hash = `#${ENTRY_NODE_ID}`;
  });
}

export function startButton(elementId, ref) {
  document.getElementById(elementId).addEventListener("click", (event) => {
    let startNodeId = ref.nodeWalker.currentNode.getAttribute(ENTRY_NODE_FIELD_NAMES.start);
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