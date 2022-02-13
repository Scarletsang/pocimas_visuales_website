import * as Render from "./eventListeners.js";
import { LessonList } from "./lessonListElement.js";
import { NodeWalker } from "./nodewalker.js";

const ENTRY_NODE_ID = "home";

function main(event) {
	let ref = {
		body: document.getElementsByTagName("body")[0],
		nav:  document.getElementsByTagName("nav")[0],
		main: document.getElementsByTagName("main")[0],
		lessonContent: document.getElementById("lesson-content"),
		lessonList: new LessonList(document.getElementById("lesson-list")),
		nodeWalker: NodeWalker.fromTemplateTag(ENTRY_NODE_ID)
	}
	window.location.hash = "#home";
	hashChangeCallback(ref);
	window.addEventListener("hashchange", (event) => {hashChangeCallback(ref);});
	Render.startButton("start-btn", ref);
	Render.iconButton("website-title", ref);
}

function hashChangeCallback(ref) {
	let newId = window.location.hash.slice(1);
	if (newId == ENTRY_NODE_ID) {
		Render.homePage(ref);
		return ;
	}
	if (!ref.nodeWalker.hash.has(newId)) {
		ref.nodeWalker.shoutInvalidIdError(newId);
		return ;
	}
	if (ref.lessonList.isItemInList(newId)) {
		ref.lessonList.highlightToggle([newId, ref.nodeWalker.currentId]);
		Render.contentByNodeId(ref, newId);
		return ;
	}
	Render.contentByNodeId(ref, newId);
	let nodeList = ref.nodeWalker.wanderFromTo(ENTRY_NODE_ID, newId);
	let nodeList2 = ref.nodeWalker.wanderTillNodeChoice().slice(1);
	ref.lessonList.clear();
	ref.lessonList.appendMultiple(nodeList);
	ref.lessonList.appendMultiple(nodeList2);
	ref.lessonList.highlightToggle([newId]);
}

window.addEventListener('DOMContentLoaded', main);