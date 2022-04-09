import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { removeItemFromArray } from '../helpers';
import { global, mappings } from "../store";
import { defaultFonts } from './styles';
import ComponentController from './componentController';

export default class LessonList extends LitElement {
  
  controller = new LessonListController(this);

  static properties = {
    structure:     {reflect: true},
    usePrefix:     {type: Boolean, state: true},
    isInScope:     {type: Boolean, state: true},
    scopeName:     {state: true},
    lessons:       {type: Object, state: true},
    currentNodeId: {state: true}
  }

  static styles = [
    defaultFonts,
    css`
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

      .indented {
        padding-left: 3rem;
      }`
  ]

  renderItem(lesson, index) {
    if (this.usePrefix) {
      return html`${index + 1}. ${lesson.title}`;
    }
    return html`${lesson.title}`;
  }

  scopedPage() {
    let list = this.lessons?.map((lesson) => {
      let highlight = {highlight: lesson.id == this.currentNodeId, indented: true};
      return html`<a href="#${lesson.id}" class=${classMap(highlight)}>${lesson.title}</a>`
    })
    return html`
      <h1 class="highlight">${this.scopeName}</h1>
      ${list}
    `;
  }

  contentPage() {
    let list = this.lessons.map((lesson, index) => {
      let highlight = {highlight: lesson.id == this.currentNodeId};
      return html`<a href="#${lesson.id}" class=${classMap(highlight)}>${this.renderItem(lesson, index)}</a>`
    })
    return html`${list}`;
  }

  render() {
    if (this.isInScope) return this.scopedPage();
    return this.contentPage();
  }
}

class LessonListController extends ComponentController {

  onHashChange() {
    this.host.currentNodeId = this.nodePointer.id;
    this.host.isInScope = this.nodePointer.attr.isInScope;
    if (!this.host.isInScope) {this.normalRendering(); return;}
    let nodeArray = this.nodePointer.walkedInScope;
    if (!nodeArray) {this.normalRendering(); return;}
    this.host.scopeName = this.nodePointer.scopeName;
    this.host.lessons = nodeArray;
    this.host.usePrefix = false;
  }

  normalRendering() {
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
    let homeNode = global.get("nodeInquiry").get(mappings.get("entryNodeId"));
    let lessonIds = removeItemFromArray(homeNode.nextIds, homeNode.startId);
		this.host.lessons = this.nodePointer.nodeIdsToNodes(lessonIds);
		this.host.usePrefix = false;
  }

  contentPage() {
    this.host.lessons =  this.nodePointer.walked.slice(2);
    this.host.usePrefix = false;
  }
}