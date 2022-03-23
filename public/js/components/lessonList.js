import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import store from "../store";
import ComponentController from './componentController';

export default class LessonList extends LitElement {
  
  controller = new LessonListController(this);

  static properties = {
    structure: {reflect: true},
    usePrefix: {type: Boolean, state: true},
    lessons: {type: Array, state: true},
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

  render() {
    return html`
      ${repeat(
        this.lessons,
        (lesson) => lesson,
        (lesson, index) => {
          if (lesson.id == this.currentNodeId) {
            return html`<a href="#${lesson.id}" class="highlight">${this.renderItem(lesson, index)}</a>`
          }
          return html`<a href="#${lesson.id}">${this.renderItem(lesson, index)}</a>`
        }
      )}
    `;
  }
}

class LessonListController extends ComponentController {

  onStructureChange() {
    this.host.currentNodeId = this.nodeWalker.currentId;
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
    let nodeArray2 = this.nodeWalker.wanderTillNodeChoice();
    //slice to prevent showing entry node in the navigation bar.
    this.host.lessons = nodeArray ? [...nodeArray.slice(1), ...nodeArray2] : nodeArray2 ;
    this.host.usePrefix = true;
  }
}