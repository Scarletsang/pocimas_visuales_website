/**
 * See [Passive Event Listener](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
 * @returns {Boolean}
 */
export function browserSupportsPassiveEvent() {
	let supportsPassive = false;
	try {
		let opts = Object.defineProperty({}, 'passive', {
			get: function() {
				supportsPassive = true;
			}
		});
		window.addEventListener("testPassive", null, opts);
		window.removeEventListener("testPassive", null, opts);
	} catch (e) {}
	return supportsPassive;
}

export class MediaPreloader {
	constructor() {
		this.images = new Set();
	}

	addImage(src) {
		let image = new Image();
		image.addEventListener("load", (event) => {
			this.images.delete(event.target);
		});
		image.src = src;
		this.images.add(image);
	}

	addImages(srcs) {
		srcs.forEach(this.addImage);
	}
}

export class Cache {
	constructor() {
		this.container = document.getElementById("cache");
		this.cachedNodes = new Set();
	}

	add(node) {
		this.container.appendChild(node);
		this.cachedNodes.add(node);
	}

	contains(node) {
		this.cachedNodes.has(node);
	}
}