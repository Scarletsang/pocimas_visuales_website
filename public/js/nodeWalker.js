import { NODE_FIELD_NAMES } from "./constants.js";

/**
* Append the current node in the nodeWalker instance
* inside an exsisting html element.
* @param {NodeWalker} nodeWalker
* @param {HTMLElement} element 
*/
export function renderNodeWalker(nodeWalker, element) {
	for (let child of nodeWalker.currentNode.childNodes) {
		element.appendChild(child.cloneNode(true));
	}
}

/**
 * A Pseudo iterator (not strictly following the @iterator protoco)
 * that tranverse from a HTML sections to another one. A Node here 
 * referes to each HTML section that one is walking through.
 */
export class NodeWalker {
	/**
	 * @param {NodeList} nodes 
	 * @param {String} fieldName
	 * @param {String} id 
	 */
	constructor(nodes, id, fieldName = NODE_FIELD_NAMES.nextNode) {
		this._currentId = id;
		this.fieldNameForNextNode = fieldName;
		this.hash = new Map();
		for (let node of nodes) {
			if (node.nodeName == "SECTION")this.hash.set(node.id, node.cloneNode(true));
		}
	}

	sandbox(func) {
		let originalId = this._currentId;
		let originalFieldNameForNextNode = this.fieldNameForNextNode;
		let originalHash = this.hash;
		let result = func(this);
		this._currentId = originalId;
		this.fieldNameForNextNode = originalFieldNameForNextNode;
		this.hash = originalHash;
		return result;
	}

	/**
	 * Create a NodeWaler pseudo iterator from nodes
	 * stored in the first encountered template tag.
	 * @param {String} id 
	 * @returns {NodeWalker}
	 */
	static fromTemplateTag(id) {
		let template = document.getElementsByTagName("template")[0].content.childNodes;
		return new NodeWalker(template, id);
	}

	/**
	 * @param {String} newId
	 */
	set currentId(newId) {
		if (this.hash.has(newId)) {
			this._currentId = newId;
		} else {
			this.shoutInvalidIdError(newId);
		}
	}

	/**
	 * @returns {Node} The current node of the iterator
	 */
	get currentNode() {
		return this.hash.get(this._currentId);
	}

	get currentId() { return this._currentId; }

	/**
	 * Returns whether the current node is an end node or not.
	 * @returns {Boolean}
	 */
	isEndNode() {
		return !this.currentNode.hasAttribute(this.fieldNameForNextNode);
	}
			
	/**
	 * Returns an array of id(s) of next Node(s).
	 * @returns {Array<String>}
	 */
		nextIds() {
		return this.currentNode.getAttribute(this.fieldNameForNextNode).split(',');
	}

	/**
	 * Runs the iterator repeatedly until no node is found or multiple
	 * nodes are found to be connected to the current node.
	 * @returns {Array<Node>}
	 */
	wanderTillNodeChoice() {
		let originalId = this._currentId;
		let arr = [];
		while (this.next()) {
			arr.push(this.currentNode);
		}
		this._currentId = originalId;
		return arr;
	}

	/**
	 * Perform a depth first search from a node to another node,
	 * When the target node is found, returns an array of nodes that
	 * have been traversed in the search. Otherwise, return the current node.
	 * @param {String} fromId 
	 * @param {String} toId 
	 * @returns {Array<Node> }
	 */
	 wanderFromTo(fromId, toId) {
		let arr = [];
		let originalId = this._currentId;
		this._currentId = fromId;
		while (this.next()) {
			arr.push(this.currentNode);
			if (this._currentId == toId) {
				this._currentId = originalId;
				return arr;
			}
		}
		if (!this.isEndNode()) {
			// If there is a choice, make a depth first search recursively.
			this.nextIds().forEach(id => {
				let nodesAfterChoice = this.wanderFromTo(id, toId);
				if (nodesAfterChoice) {
					this._currentId = originalId;
					return arr.concat(nodesAfterChoice);
				}
			});
		}
		this._currentId = originalId;
		return [this.currentNode];
	}

	/**
	 * Iterator function.
	 * @param {String} nextId 
	 * @returns {{value: Node, done: Boolean} | Boolean}
	 */
	next(nextId = null) {
		if (this.isEndNode()) return false;
		let nextIdsArray = this.nextIds();
		if (nextIdsArray.length == 1) {
			this._currentId = nextIdsArray[0];
			return {value: this.currentNode, done: this.isEndNode()};
		}
		if (!nextIdsArray.includes(nextId)) {
			return false;
		}
		this._currentId = nextId;
		return {value: this.currentNode, done: this.isEndNode()};
	}

	/** private method */
	unmatchedNextIdErrorMsg(nextId){
		return `Unexsisting Next Id.\n - Current Node id: ${this._currentId}.\n - Expecting next id(s): ${this.nextIds()}.\n - Received next id: ${nextId}.`
	}

	shoutInvalidIdError(id) {
		console.error(`Invalid Node Id Input. Received Node Id: ${id}`);
	}
}