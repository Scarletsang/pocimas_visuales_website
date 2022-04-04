import { LitElement, css, html } from "lit";
import { defaultButton } from "./styles";

export default class MediaPopup extends LitElement {
  static properties = {
    type: {reflect: true},
    src: {reflect: true},
    description: {reflect: true}
  }

  static styles = [
    defaultButton,
    css`
      :host {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.5);
        z-index: 3;
      }

      [image], [pdf] {
        width: 100%;
        padding: 3rem calc(3rem + var(--border-width)) 0 calc(3rem + var(--border-width));
        height: calc(100% - 6rem);
        object-fit: contain;
        box-sizing: border-box;
      }

      [pdf] {
        height: 100vh;
        padding-bottom: 3rem;
      }

      [description] {
        text-align: center;
        margin-top: 0;
        margin-right: var(--border-width);
        color: white;
        font: normal normal 1rem "Mali", sans-serif;
      }

      #close-popup-btn {
        position: absolute;
        top: var(--border-width);
        right: var(--border-width);
        width: 3rem;
      }
    `
  ]

  renderPDF() {
    return html`
      <object pdf type="application/pdf" data=${this.src}>
      </object>
      <p description>${this.description}</p>
      `;
  }
  
  renderImage() {
    return html`
      <img image src=${this.src}>
      <p description>${this.description}</p>
    `;
  }

  render() {
    let element;
    if (this.type == "pdf") element = renderPDF();
    if (this.type == "image") element = renderImage();
    return html`
      ${element}
      <button id="close-popup-btn" type="button" @click=${this.closePopupBtn}>
        <img src="img/close-popup-btn.svg">
      </button>
    `;
  }

  closePopupBtn() {
    this.classList.add("hide");
  }
}