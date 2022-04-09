import { LitElement, css, html  } from "lit";
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { repeat } from "./helpers";
import { defaultFonts, defaultMedia } from "./styles";
import ComponentController from "./componentController";

export default class Lobby extends LitElement {

  controller = new LobbyController(this);

  static properties = {
    nextLessonBtnText: {state: true},
    choiceContent: {type: Array, state: true},
    focusId: {state: true}
  }

  static styles = [
    defaultFonts,
    defaultMedia,
    css`
      :host {
        height: 100%;
        padding: calc(var(--border-width) + 2rem);
        box-sizing: border-box;
        border: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;;
        overflow-x: hidden;
      }

      .card {
        background-color: transparent;
        perspective: 3000px;
        margin-right: var(--border-width);
        width: 30vw;
        max-width: 30rem;
        height: 100%;
      }

      .wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      }

      .flip {
        transform: rotateY(180deg);
      }

      /* .card:hover .wrapper {
        transform: rotateY(180deg); 
      } */

      .front, .back {
        position: absolute;
        border: var(--focus-border);
        width: 100%;
        height: 100%;
        padding: 2rem;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        box-sizing: border-box;
      }

      .front {
        cursor: pointer;
        text-align: center;
        background-color: white;
        color: var(--theme-color);
      }

      .front li {
        text-align: left;
      }

      .no-flip {cursor: default}

      .back {
        transform: rotateY(180deg);
        background-color: var(--theme-color);
        color: white;
      }

      .next-lesson-btn {
        position: absolute;
        border: none;
        background-color: transparent;
        color: var(--theme-color);
        left: 0;
        bottom: var(--border-width);
        width: 100%;
        cursor: pointer;
      }

      .back .next-lesson-btn {
        color: white;
      }

      .next-lesson-btn:hover {
        color: var(--highlight-color);
      }

      img {max-height: 50%;}
    `
  ]

  frontAndBack(choice) {
    return html`
      <div class="front">${unsafeHTML(choice.front)}</div>
      <div class="back">
        ${unsafeHTML(choice.back)}
        ${this.renderNextLessonBtn(choice.id)}
      </div>
      `;
  }
  
  onlyFront(choice) {
    return html`
      <div class="front no-flip">
        ${unsafeHTML(choice.front)}
        ${this.renderNextLessonBtn(choice.id)}
      </div>
    `;
  }

  renderNextLessonBtn(id) {
    return html`
      <button class="next-lesson-btn" type="button" @click=${this.nextLessonBtn(id)}>
        <h1>${this.nextLessonBtnText}</h1>
      </button>
    `;
  }

  render() {
    return repeat(this.choiceContent, (choice) => {
      return html`
        <div class="card">
          <div class=${classMap({flip: choice.id == this.focusId, wrapper: true})} @click=${this.focusCard(choice)}>
            ${when(choice.back, () => this.frontAndBack(choice), () => this.onlyFront(choice))}
          </div>
        </div>
      `
    });
  }

  focusCard(choice) {
    if (!choice.back) return ;
    return function(event) {
      if (event.eventPhase == 3) {
        this.focusId = choice.id;
        event.stopPropagation();
      }
    }
  }

  nextLessonBtn(nextId) {
    return function() {window.location.hash = `#${nextId}`;}
  }
}

class LobbyController extends ComponentController {
  onHashChange() {
    let nextLessonBtnText = this.nodePointer.attr.nextLessonBtnText;
    this.host.nextLessonBtnText = nextLessonBtnText ? nextLessonBtnText : "";
    this.host.choiceContent = this.nodePointer.attr.data;
  }

  hostConnected() {
    super.hostConnected();
    this.host.addEventListener("click", (event) => {
      this.host.focusId = undefined;
    }, true);
  }
}