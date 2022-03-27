import { LitElement, css, html  } from "lit";
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import store from "../store";
import { defaultButton, defaultFonts, defaultMedia } from "./styles";

export default class Lobby extends LitElement {

  constructor() {
    super();
    let nextLessonBtnText = store.get("nodeWalker").currentNextLessonBtnText;
    this.nextLessonBtnText = nextLessonBtnText ? nextLessonBtnText : "";
    this.choiceContent = store.get("nodeWalker").currentChoices;
    this.addEventListener("click", (event) => {
      this.focusId = undefined;
    }, true);
  }

  static properties = {
    nextLessonBtnText: {state: true},
    choiceContent: {type: Array, state: true},
    focusId: {state: true}
  }

  static styles = [
    defaultButton,
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
        background-color: white;
        color: var(--theme-color);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        box-sizing: border-box;
      }

      .front {
        cursor: pointer;
        text-align: center;
      }

      .back {
        transform: rotateY(180deg);
      }

      .next-lesson-btn {
        position: absolute;
        left: 0;
        bottom: var(--border-width);
        width: 100%;
      }
    `
  ]

  render() {
    return html`
      ${repeat(
        this.choiceContent,
        (choice) => choice,
        (choice, index) => {
          return html`
            <div class="card">
              <div class=${classMap({flip: choice.id == this.focusId, wrapper: true})} @click=${this.focusCard(choice.id)}>
                <div class="front">${unsafeHTML(choice.front)}</div>
                <div class="back">
                  ${unsafeHTML(choice.back)}
                  <button class="next-lesson-btn" type="button" @click=${this.nextLessonBtn(choice.id)}>
                    <h1>${this.nextLessonBtnText}</h1>
                  </button>
                </div>
              </div>
            </div>
          `
        }
      )}
    `
  }

  focusCard(id) {
    return function(event) {
      if (event.eventPhase == 3) {
        this.focusId = id;
        event.stopPropagation();
      }
    }
  }

  nextLessonBtn(nextId) {
    return function() {window.location.hash = `#${nextId}`;}
  }
}
