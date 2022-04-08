import { LitElement, css, html } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { defaultButton, defaultFonts, defaultMedia } from "./styles";
import ComponentController from "./componentController";

export default class PageContent extends LitElement {
  controller = new PageContentController(this);

  static properties = {
    structure:         {reflect: true},
    nextLessonBtnText: {state: true},
    nextId:            {state: true},
    isEndNode:         {type: Boolean, state: true},
    content:           {type: DocumentFragment, state: true}
  }

  static styles = [
    defaultButton,
    defaultFonts,
    defaultMedia,
    css`
    /* default structure: content */
    :host {
      transition: all linear 1s;
      -webkit-transition: all linear 1s;
    }

    .lesson-content {
      min-height: 100%;
      width: 100%;
      border: var(--focus-border);
      box-sizing: border-box;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
    }

    .lesson-content .video {
      overflow: hidden;
      width: 100%;
      height: calc(100vh - 2 * (var(--border-width) + 2rem));
    }

    .lesson-content > * {
      width: 100%;
      max-width: 60rem;
    }

    #next-lesson-btn {
      position: absolute;
      right: var(--border-width);
    }

    #next-lesson-btn > h1 {
      margin: 1rem 0;
    }

    /* structure: cinema */

    :host([structure=cinema]) {
      padding: var(--border-width);
    }
    
    :host([structure=cinema]) .lesson-content {
      padding: 0;
      border: none;
    }
  `]

  renderNextLessonBtn() {
    if (this.isEndNode) return ''
    return html`
      <button @click=${this.nextLessonBtn} id="next-lesson-btn" type="button">
        <h1>${this.nextLessonBtnText}</h1>
      </button>
    `
  }

  render() {
    return html`
      <section class="lesson-content">${unsafeHTML(this.content)}</section>
      ${this.renderNextLessonBtn()}
    `
  }

  nextLessonBtn() {
    let nextId = this.nextId;
    window.location.hash = `#${nextId}`;
  }
}

class PageContentController extends ComponentController {
  onHashChange() {
    this.host.isEndNode = this.nodePointer.attr.isEndNode;
    let nextLessonBtnText = this.nodePointer.attr.nextLessonBtnText;
    this.host.nextLessonBtnText = nextLessonBtnText ? nextLessonBtnText : "";
    let content = this.nodePointer.attr.content;
    this.host.nextId  = this.nodePointer.attr.nextIds?.[0];
    this.host.content = content ? content : "";
  }
}