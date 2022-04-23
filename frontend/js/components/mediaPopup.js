import { LitElement, css, html } from "lit";
import { pauseVimeoPlayer } from "../utils/components";
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

      [image], [pdf], [vimeo] {
        width: 100%;
        padding: 3rem calc(3rem + var(--border-width)) 0 calc(3rem + var(--border-width));
        height: calc(100% - 6rem);
        box-sizing: border-box;
      }

      [pdf] {
        border: 1px solid rgba(144, 94, 94, 0.06);
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
  
  renderVimeo() {
    return html`
      <iframe vimeo src="https://player.vimeo.com/video/${this.src}?h=f6ac9fdd61&color=5BA7AE&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      <p description>${this.description}</p>
      `;
  }

  render() {
    let element;
    if (this.type == "pdf") element = this.renderPDF();
    if (this.type == "image") element = this.renderImage();
    if (this.type == "vimeo") element = this.renderVimeo();
    return html`
      ${element}
      <button id="close-popup-btn" type="button" @click=${this.closePopupBtn}>
        <img src="img/close-popup-btn.svg">
      </button>
    `;
  }

  closePopupBtn() {
    let vimeoIframe = this.renderRoot.querySelector("iframe[vimeo]");
    if (vimeoIframe) pauseVimeoPlayer(vimeoIframe);
    this.classList.add("hide");
  }
}