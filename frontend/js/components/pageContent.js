import { LitElement, css, html } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { defaultButton, defaultFonts, defaultMedia } from "./styles";
import { pauseVimeoPlayer } from "./helpers";
import ComponentController from "./componentController";

export default class PageContent extends LitElement {
  controller = new PageContentController(this);

  static properties = {
    structure:         {reflect: true},
    nextLessonBtnText: {state: true},
    nextId:            {state: true},
    isEndNode:         {type: Boolean, state: true},
    content:           {state: true},
    data:              {type: Object, state: true}
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

    .lesson-content [vimeo] {
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

    .single-content {
      height: 100%;
      width: 100%;
      border: none;
      box-sizing: border-box;
      padding: 2rem;
      overflow-x: hidden;
    }

    [iframe-embed] {
      box-sizing: content-box;
      padding: 0;
      border: var(--focus-border);
      margin: 0 2rem;
      width: calc(100% - 4rem);
      height: calc(100% - 2rem);
    }

    .single-content + #next-lesson-btn {
      bottom: calc( -0.5 * var(--border-width));
    }

    /* :host([structure=cinema]) {
      padding: var(--border-width);
    }
    
    :host([structure=cinema]) .lesson-content {
      padding: 0;
      border: none;
    } */
  `]

  renderNextLessonBtn() {
    if (this.isEndNode) return ''
    return html`
      <button @click=${this.nextLessonBtn} id="next-lesson-btn" type="button">
        <h1>${this.nextLessonBtnText}</h1>
      </button>
    `
  }

  contentPage() {
    return html`
      <section class="lesson-content">${unsafeHTML(this.content)}</section>
      ${this.renderNextLessonBtn()}
      `;
  }

  cinemaPage() {
    switch (this.data?.type) {
      case "iframe":
        return this.iframe();
      case "vimeo":
        return this.vimeo();
      case "image":
        return this.image();
      default:
        return this.contentPage();
    }
  }
  
  iframe() {
    return html`
      <iframe iframe-embed
        class="single-content"
        title=${this.data.title}
        src=${this.data.url}
        allow=${this.data.iframeAllow}
        frameBorder="0">
      </iframe>
      ${this.renderNextLessonBtn()}
      `;
  }

  vimeo() {
    return html`
      <iframe vimeo
        class="single-content"
        src="https://player.vimeo.com/video/${this.data.id}?h=f6ac9fdd61&color=5BA7AE&byline=0&portrait=0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        frameBorder="0">
      </iframe>
      ${this.renderNextLessonBtn()}
      `;
  }
  
  image() {
    return html`
      <img 
        class="single-content"
        alt=${this.data.title} 
        src=${this.data.url}>
      ${this.renderNextLessonBtn()}
    `
  }

  render() {
    switch (this.structure) {
      case "cinema":
        return this.cinemaPage();
      default:
        return this.contentPage();
    }
  }

  nextLessonBtn() {
    let vimeoIframe = this.renderRoot.querySelector("iframe[vimeo]");
    if (vimeoIframe) pauseVimeoPlayer(vimeoIframe);
    let nextId = this.nextId;
    window.location.hash = `#${nextId}`;
  }
}

class PageContentController extends ComponentController {
  onHashChange() {
    this.host.isEndNode = this.nodePointer.attr.isEndNode;
    let nextLessonBtnText = this.nodePointer.attr.nextLessonBtnText;
    this.host.nextLessonBtnText = nextLessonBtnText ? nextLessonBtnText : "";
    this.host.nextId  = this.nodePointer.attr.nextIds?.[0];
    let content = this.nodePointer.attr.content;
    this.host.content = content ? content : "";
    this.host.data = this.nodePointer.attr.data;
  }
}