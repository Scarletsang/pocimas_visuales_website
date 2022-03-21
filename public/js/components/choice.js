import { LitElement, css, html } from "lit";
import { defaultButton, defaultFonts } from "./styles";
import ComponentController from "./componentController";

export default class Choice extends LitElement {
  static properties = {
    nextLessonBtnText: {state: true},
    nextid: {reflect: true}
  }

  static styles = [
    defaultButton,
    defaultFonts,
    css`
      :host {
        background-color: transparent;
        width: 300px;
        height: 300px;
        perspective: 1000px;
      }

      .wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      }

      :host:hover .wrapper {
        transform: rotateY(180deg);
      }

      .front, .back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }

      .front {
        background-color: white;
        color: var(--theme-color);
      }

      .back {
        background-color: var(--theme-color);
        color: white;
        transform: rotateY(180deg);
      }
    `
  ]

  render() {
    return html`
      <div class="wrapper">
        <div class="front"><slot name="front"></slot></div>
        <div class="back">
          <slot name="back"></slot>
          <button id="next-lesson-btn" type="button" @click="${this.nextLessonBtn}">
            <h1>${this.nextLessonBtnText}</h1>
          </button>
        </div>
      </div>
    `
  }

  nextLessonBtn() {
    window.location.hash = `#${this.nextId}`;
  }
}