import { renderNodeWalker } from "./nodewalker.js";

export function iconButton(elementId, ref) {
	document.getElementById(elementId).addEventListener("click", (event) => {
		window.history.pushState('home page', "", "/#home");
		clearLessonContent(ref);
		welcomePageNavContent(ref.lessonList);
		toggleWelcomePageStylesPhrase2(ref);
		toggleWelcomePageStylesPhrase1(ref);
	});
}

export function startButton(elementId, ref) {
	document.getElementById(elementId).addEventListener("click", (event) => {
		toggleWelcomePageStylesPhrase1(ref);
		setTimeout(() => {
			toggleWelcomePageStylesPhrase2(ref);
			let next = ref.nodeWalker.currentNode.getAttribute("start");
			ref.lessonList.usePrefix = true;
			window.location.hash = next;
		}, 1000);
	});
}

export function homepage(ref) {
	
}

export function welcomePageNavContent(lessonList) {
	lessonList.clear();
	lessonList.usePrefix = false;
	lessonList.append("artists", "Artists");
	lessonList.append("project", "About this project");
}

export function toggleWelcomePageStylesPhrase1(ref) {
	ref.body.classList.toggle("main-view");
	ref.body.classList.toggle("default-view");
	ref.nav.classList.toggle("center-menu");
	clearLessonContent(ref);
	ref.main.classList.toggle("center-menu");
}

export function toggleWelcomePageStylesPhrase2(ref) {
	ref.main.classList.toggle("overflow-y-scroll");
}

export function nextNodeContent(ref, nodeId = null) {
	clearLessonContent(ref);
	let node = ref.nodeWalker.next(nodeId);
	if (node) renderNodeWalker(ref.nodeWalker, ref.lessonContent);
}

export function contentByNodeId(ref, newId) {
	ref.nodeWalker.currentId = newId;
	clearLessonContent(ref);
	renderNodeWalker(ref.nodeWalker, ref.lessonContent);
}

export function clearLessonContent(ref) {
	ref.lessonContent.innerHTML = "";
}