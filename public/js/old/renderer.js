import { ENTRY_NODE_ID } from "./constants.js";

export class PageRenderer {
	constructor(lastId, ref) {
		this.ref = ref;
		this.lastId = lastId;
		this.nodeHasRenderedBefore = ref.cache.contains(ref.nodeWalker.currentNode);
		this.elementRenderer = new ElementRenderer(ref);
	}

	render() {
		this.renderContent();
		this.attachEventListeners();
		this.preloadNextNodesMedia();
		this.renderStyles();
		this.renderNav();
	}

	renderStyles()         { this.defaultStyles(); }
	renderNav()            { this.defaultNav(); }
	attachEventListeners() { this.defaultEventListeners(); }

	renderNavFrom(nodeArray) {
		if (!this.ref.lessonList.isItemInList(this.ref.nodeWalker.currentId)) {
			this.ref.lessonList.clear();
			this.ref.lessonList.appendMultiple(nodeArray);
		}
		this.ref.lessonList.highlight(this.ref.nodeWalker.currentId);
	}
	
	renderContent() {
		this.clearContent();
		this.ref.main.insertBefore(this.ref.nodeWalker.currentNode, this.ref.nextLessonButton);
	}

	clearContent() {
		let lessonContents = this.ref.main.getElementsByTagName("section");
		for (let content of lessonContents) {
			this.ref.cache.add(content);
		}
	}

	verticalScroll() {
		this.ref.main.classList.remove("overflow-x-scroll");
		let addScrollFunction = () => {this.ref.main.classList.add("overflow-y-scroll")};
		if (this.lastId == ENTRY_NODE_ID) {
			setTimeout(addScrollFunction, 1000);
		}
		else {addScrollFunction()};
	}

	horizontalScroll() {
		this.ref.main.classList.remove("overflow-y-scroll");
		let addScrollFunction = () => {this.ref.main.classList.add("overflow-x-scroll")};
		if (this.lastId == ENTRY_NODE_ID) {
			setTimeout(addScrollFunction, 1000);
		}
		else {addScrollFunction()};
	}

	navDFS(startNodeId = ENTRY_NODE_ID) {
		let nodeArray = this.ref.nodeWalker.wanderFromTo(startNodeId, this.ref.nodeWalker.currentId);
		let nodeArray2 = this.ref.nodeWalker.wanderTillNodeChoice();
		//slice to prevent showing entry node in the navigation bar.
		return [...nodeArray.slice(1), ...nodeArray2];
	}

	preloadNextNodesMedia() {
		if (this.ref.nodeWalker.isEndNode) return ;
		this.ref.nodeWalker.nextIds().forEach( id => {
			let nextNode = this.ref.nodeWalker.hash.get(id);
			let images = nextNode.getElementsByTagName("img");
			for (const image of images) {
				this.ref.mediaPreloader.addImage(image.src);
			}
		});
	}

	// Defaults
	defaultStyles() {
		this.ref.body.classList = "";
		this.ref.main.classList.remove("center-menu");
		this.ref.nav.classList.remove("center-menu");
	}

	defaultNextLessonBtnStyles() {
		if (this.ref.nodeWalker.isEndNode || this.ref.nodeWalker.isChoiceNode) {
			this.ref.nextLessonButton.classList.add("hide");
		} else {
			this.ref.nextLessonButton.classList.remove("hide");
		}
	}

	defaultNav() {
		let nodeArray = this.navDFS();
		this.ref.lessonList.usePrefix = true;
		this.renderNavFrom(nodeArray);
	}

	defaultEventListeners() {
		let node = this.ref.nodeWalker.currentNode;
		for (let galleryNode of node.getElementsByClassName("gallery")) {
			this.elementRenderer.gallery(galleryNode);
		}
		for (let pdfNode of node.getElementsByClassName("pdf-link")) {
			this.elementRenderer.pdf(pdfNode);
		}
	}

}

class ElementRenderer {
	constructor(ref) {
		this.ref = ref;
	}

	gallery(node) {
		node.addEventListener("click", (event) => {
			let [pdf, image, imageText] = this.getPopupElements();
			image.setAttribute("src", event.target.getAttribute("src"));
			imageText.innerHTML = event.target.getAttribute("alt");
			this.ref.popup.classList.remove("hide");
			pdf.classList.add("hide");
			image.classList.remove("hide");
			imageText.classList.remove("hide");
		});
	}

	pdf(node) {
		node.addEventListener("click", (event) => {
			let [oldPDF, image, imageText] = this.getPopupElements();
			let newPDF = document.createElement("object");
			newPDF.setAttribute("type", "application/pdf");
			newPDF.setAttribute("data", node.getAttribute("data-href"));
			newPDF.id = "popup-pdf";
			this.ref.popup.replaceChild(newPDF, oldPDF);
			this.ref.popup.classList.remove("hide");
			image.classList.add("hide");
			imageText.classList.add("hide");
		});
	}

	getPopupElements() {
		return [
			document.getElementById("popup-pdf"),
			document.getElementById("popup-image"),
			document.getElementById("popup-image-text")
		];
	}
}