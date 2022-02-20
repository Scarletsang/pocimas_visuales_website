import { NODE_FIELD_NAMES } from "./constants.js";

class NodeHistory {
	constructor(root) {
		this.root = root;
		this.record = [];
		this.choices = [];
	}

	get() {
		return this.record;
	}

	getChoice() {
		return this.choices;
	}

	add(nodeId) {
		if (nodeId == this.root) {
			this.record = [];
			this.choices = [];
			return this;
		}
		let nodeIndexInRecord = this.record.indexOf(nodeId);
		if (nodeIndexInRecord >= 0) {
			this.record = this.record.slice(0, nodeIndexInRecord + 1);
			this.choices = this.choices.filter((choice) => {
				return this.record.includes(choice);
			});
		}
		else {
			this.record.push(nodeId);
		}
	}

	addChoice(nodeId) {
		this.choices.push(nodeId);
	}

	clone() {
		let clone = new NodeHistory(this.root);
		clone.record = Array.from(this.record);
		clone.choices = Array.from(this.choices);
		return clone;
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
	constructor(id, history, hash, fieldName = NODE_FIELD_NAMES.nextNode) {
		this._currentId = id;
		this.history = history;
		this.hash = hash;
		this.fieldNameForNextNode = fieldName;
	}

	/**
	 * Create a NodeWaler pseudo iterator from nodes
	 * stored in the first encountered template tag.
	 * @param {String} id 
	 * @returns {NodeWalker}
	 */
	static fromTemplateTag(id) {
		let nodes = document.getElementsByTagName("template")[0].content.childNodes;
		let history = new NodeHistory(id);
		let hash = new Map();
		for (let node of nodes) {
			if (node.nodeName == "SECTION")hash.set(node.id, node.cloneNode(true));
		}
		return new NodeWalker(id, history, hash);
	}

	clone() {
		let id = this._currentId;
		let history = this.history.clone();
		let hash = this.hash;
		let fieldName = this.fieldNameForNextNode;
		return new NodeWalker(id, history, hash, fieldName);
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
	get isEndNode() {
		return !this.currentNode.hasAttribute(this.fieldNameForNextNode);
	}

	get isChoiceNode() {
		return !this.isEndNode && (this.nextIds().length > 1);
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
		let clone = this.clone();
		let arr = [];
		while (clone.next()) {
			arr.push(clone.currentNode);
		}
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
		let clone = this.clone();
		let nodeResult = clone.teleport(fromId);
		if (!nodeResult) return false;
		let arr = [];
		do {
			arr.push(clone.currentNode);
			if (clone.currentId == toId) {
				return arr;
			}
		} while (clone.next());
		if (clone.isEndNode) return false;
		let choice = clone.history.choices.shift();
		let node = clone.next(choice);
		if (node) {
			return arr.concat(clone.wanderFromTo(clone.currentId, toId));
		}
		// If there is a choice, make a depth first search recursively.
		for (let id of clone.nextIds()) {
			let nodesAfterChoice = clone.wanderFromTo(id, toId);
			if (nodesAfterChoice) return arr.concat(nodesAfterChoice);
		}
		return false;
	}

	/**
	 * Iterator function.
	 * @param {String} nextId 
	 * @returns {{value: Node, done: Boolean} | Boolean}
	 */
	next(nextId = null) {
		if (this.isEndNode) return false;
		if (this.isChoiceNode) return this.teleport(nextId);
		return this.teleport(this.nextIds()[0]);
	}
	
	teleport(nodeId) {
		if (!this.hash.has(nodeId)) return false;
		this.history.add(nodeId);
		if (this.isChoiceNode) this.history.addChoice(nodeId);
		this._currentId = nodeId;
		return {value: this.currentNode, done: this.isEndNode};
	}

	/** private method */
	unmatchedNextIdErrorMsg(nextId){
		return `Unexsisting Next Id.\n - Current Node id: ${this._currentId}.\n - Expecting next id(s): ${this.nextIds()}.\n - Received next id: ${nextId}.`
	}

	shoutInvalidIdError(id) {
		console.error(`Invalid Node Id Input. Received Node Id: ${id}`);
	}
}