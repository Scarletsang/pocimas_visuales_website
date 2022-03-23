import { LitElement, css, html  } from "lit";
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
      border: var(--focus-border);
      box-sizing: border-box;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
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
      margin: 0;
      margin-top: 1rem;
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

  renderContent(content) {
    if (!content) return ''
    return document.createRange().createContextualFragment(content);
  }

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
      <section class="lesson-content">${this.renderContent(this.content)}</section>
      ${this.renderNextLessonBtn()}
    `
  }

  nextLessonBtn() {
    let nextId = this.nextId;
    window.location.hash = `#${nextId}`;
  }
}

class PageContentController extends ComponentController {
  onStructureChange() {
    this.host.isEndNode = this.nodeWalker.isEndNode;
    let nextLessonBtnText = this.nodeWalker.currentNextLessonBtnText;
    this.host.nextLessonBtnText = nextLessonBtnText ? nextLessonBtnText : "";
    let content = this.nodeWalker.currentContent;
    this.host.nextId  = this.nodeWalker.nextIds[0];
    this.host.content = content ? content : "";
  }
}