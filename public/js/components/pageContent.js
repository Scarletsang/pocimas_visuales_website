import { LitElement, css, html  } from "lit";
import { defaultButton, defaultFonts } from "./styles";
import ComponentController from "./componentController";

export default class PageContent extends LitElement {
  controller = new PageContentController(this);

  static properties = {
    structure: {reflect: true},
    nextLessonBtnText: {state: true},
    nextIds:   {type: Array, state: true},
    content:  {type: DocumentFragment, state: true}
  }

  static styles = [
    defaultButton,
    defaultFonts,
    css`
    /* default structure: content */
    :host {
      transition: all linear 1s;
      -webkit-transition: all linear 1s;
    }

    img { max-width: 100%;}
    video { width: 100%; }

    .lesson-content {
      min-height: 100%;
      border: var(--focus-border);
      box-sizing: border-box;
      overflow-x: hidden;
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
    
    :host([structure=cinema]) .lesson-content{
      padding: 0;
    }
  `]

  choicePage() {

  }

  contentPage() {
    return html`
      <section class="lesson-content">${this.renderContent()}</section>
      ${this.renderNextLessonBtn()}
    `
  }

  renderContent() {
    if (!this.content) return ''
    return document.createRange().createContextualFragment(`${ this.content }`);
  }

  renderNextLessonBtn() {
    if (this.nextIds.length != 1) return ''
    return html`
      <button @click=${this.nextLessonBtn} id="next-lesson-btn" type="button">
        <h1>${this.nextLessonBtnText}</h1>
      </button>
    `
  }

  render() {
    switch (this.structure) {
      case "choice":
        return this.choicePage();
      default:
        return this.contentPage();
    }
  }

  nextLessonBtn() {
    let nextId = this.nextIds[0];
    window.location.hash = `#${nextId}`;
  }
}

class PageContentController extends ComponentController {
  onStructureChange() {
    let nextIds = this.nodeWalker.nextIds;
    let nextLessonBtnText = this.nodeWalker.currentNodeAttribute("nextLessonBtnText");
    this.host.content = this.nodeWalker.currentNodeAttribute("html");
    this.host.nextLessonBtnText = nextLessonBtnText ? nextLessonBtnText : "";
    this.host.nextIds = nextIds ? nextIds : [];
  }
}