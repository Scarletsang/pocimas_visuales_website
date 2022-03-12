import { LitElement, css, html} from 'https://unpkg.com/lit-element@3.2.0/lit-element.js?module';
import { ENTRY_NODE_ID, nodeWalker } from "../store.js";
import { hashChangeEvent } from "../eventDispatcher.js";
import controlledByEvent from './componentController.js';

export default class LessonList extends LitElement {
  
  controller = new LessonListController(this);

  static properties = {
    outerStructure: {reflect: true},
    usePrefix: {type: Boolean, reflect: true},
    currentNodeId: {state: true}
  }

  static styles = css`
    a {
      display: block;
      margin: 0.5rem 0;
      color: var(--light-theme-color);
    }

    a.highlight {color: var(--theme-color);}

    :host {
      padding: 0;
    }

    :host([outerStructure="home"]) a {
      color: var(--theme-color);
      margin-bottom: 1.5rem;
    }

    :host([outerStructure="home"]) a:hover {
      color: var(--highlight-color);
    }
  `

  renderItem(lesson, index) {
    if (this.usePrefix) {
      return html`${index}: ${lesson.getAttribute("lesson-title")}`;
    }
    return html`${lesson.getAttribute("lesson-title")}`;
  }

  render() {
    return html`
      ${repeat(
        this.controller.lessons,
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

class LessonListController extends controlledByEvent(hashChangeEvent, "lessonListComponent"){
  lessons;
  constructor(host) {
    super(host)
  }

  callback() {
    this.host.currentNodeId  = nodeWalker.currentId;
    this.host.outerStructure = nodeWalker.currentStructure;
    switch (this.host.outerStructure) {
      case "info":
        this.infoPage();
        break;
      case "home":
        this.homePage();
        break;
      default:
        this.contentPage();
    }
  }

  infoPage() {
    let nodeArray = nodeWalker.nextIdsOf(ENTRY_NODE_ID);
    nodeArray.splice(-1);
    this.lessons = nodeArray;
    this.host.usePrefix = false;
  }

  homePage() {
    let nodeArray = nodeWalker.nextIdsOf(ENTRY_NODE_ID);
    nodeArray.splice(-1);
		this.lessons = nodeArray;
		this.host.usePrefix = false;
  }

  contentPage() {
    let nodeArray = nodeWalker.wanderFromTo(ENTRY_NODE_ID, nodeWalker.currentId);
    let nodeArray2 = nodeWalker.wanderTillNodeChoice();
    //slice to prevent showing entry node in the navigation bar.
    this.lessons = [...nodeArray.slice(1), ...nodeArray2];
    this.host.usePrefix = true;
  }
}