import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import {classMap} from 'lit/directives/class-map.js';
import store from "../store";
import ComponentController from './componentController';

export default class LessonList extends LitElement {
  
  controller = new LessonListController(this);

  static properties = {
    structure: {reflect: true},
    usePrefix: {type: Boolean, state: true},
    isInScope:   {type: Boolean, state: true},
    lessons:   {type: Array, state: true},
    currentNodeId: {state: true}
  }

  static styles = css`
    a {
      display: block;
      margin: 0.5rem 0;
      color: var(--light-theme-color);
      text-decoration: none;
    }

    a.highlight {color: var(--theme-color);}

    :host {
      padding: 0;
    }

    :host([structure=home]) a {
      color: var(--theme-color);
      margin-bottom: 1.5rem;
    }

    :host([structure=home]) a:hover {
      color: var(--highlight-color);
    }
  `

  renderItem(lesson, index) {
    if (this.usePrefix) {
      return html`${index + 1}. ${lesson.title}`;
    }
    return html`${lesson.title}`;
  }

  scopedPage() {
    let [head, ...rest] = this.lessons;
    return html`
      <a href="#${head.id}" class="highlight">${head.title}</a>
      ${repeat(
        rest,
        (lesson) => lesson,
        (lesson, index) => {
          let highlight = {highlight: lesson.id == this.currentNodeId};
          return html`<a href="#${lesson.id}" class=${classMap(highlight)}>&nbsp;&nbsp;${lesson.title}</a>`
        }
      )}
    `;
  }

  contentPage() {
    return html`
      ${repeat(
        this.lessons,
        (lesson) => lesson,
        (lesson, index) => {
          let highlight = {highlight: lesson.id == this.currentNodeId};
          return html`<a href="#${lesson.id}" class=${classMap(highlight)}>${this.renderItem(lesson, index)}</a>`
        }
      )}
    `;
  }

  render() {
    if (this.isInScope) return this.scopedPage();
    return this.contentPage();
  }
}

class LessonListController extends ComponentController {

  onHashChange() {
    this.host.currentNodeId = this.nodeWalker.currentId;
    this.host.isInScope = true;
    let scopeId = this.nodeWalker.currentScope;
    if (!scopeId) {this.normalRendering(); return;}
    let nodeArray = this.nodeWalker.wanderFromScopeHeadTo(scopeId, this.nodeWalker.currentId);
    if (!nodeArray) {this.normalRendering(); return;}
    this.host.lessons = nodeArray;
    this.host.usePrefix = false;
  }

  normalRendering() {
    this.host.isInScope = false;
    switch (this.host.structure) {
      case "info":
      case "home":
        this.homePage();
        break;
      default:
        this.contentPage();
    }
  }
  
  homePage() {
    let nodeArray = this.nodeWalker.nodeMap.nextNodesOf(store.get("entryNodeId"));
    nodeArray.splice(-1);
		this.host.lessons = nodeArray;
		this.host.usePrefix = false;
  }

  contentPage() {
    let nodeArray = this.nodeWalker.wanderFromTo(store.get("entryNodeId"), this.nodeWalker.currentId);
    this.host.lessons = nodeArray?.slice(1);
    this.host.usePrefix = true;
  }
}