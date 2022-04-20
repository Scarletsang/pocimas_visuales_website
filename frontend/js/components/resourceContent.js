import { LitElement, css, html } from "lit";
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js'
import { repeat, setAttributes } from "./helpers";
import { defaultButton, defaultFonts, defaultMedia } from "./styles";
import ComponentController from "./componentController";

export default class ResourceContent extends LitElement {

  controller = new ResourceContentController(this);

  static properties = {
    resourceContent: {type: Array, state: true},
    popupElement: {type: Object, state: true}
  }

  static styles = [
    defaultFonts,
    defaultMedia,
    defaultButton,
    css`
      :host {
        display: flex;
        flex-direction: row;
        justify-content: center;
        min-width: 100%;
        margin: -1rem;
        flex-wrap: wrap;
        width: 100%;
        padding: 0;
      }

      .resource {
        position: relative;
        width: 18rem;
        height: 18rem;
        margin: 1rem;
        padding: 2rem;
        border: var(--focus-border);
        align-self: center;
        cursor: pointer;
      }

      .resource:hover {
        background-color: var(--theme-color);
        color: white;
        transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
      }

      .resource-thumbnail {
        width: 100%;
        height: 70%;
        object-fit: contain;
      }

      .resource-title {
        position: absolute;
        width: 100%;
        text-align: center;
        left: 0;
        bottom: 0;
      }

      .single-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        font: var(--title-font);
      }
    `
  ]

  render() {
    return repeat(this.resourceContent, (resource) => {
      let titleClasses = { "resource-title": resource.thumbnail, "single-title": !resource.thumbnail}
      return html`
        <div class="resource" @click=${this.popupResource(resource)}>
          ${when(resource.thumbnail, () => html`<img class="resource-thumbnail" src=${resource.thumbnail}>`)}
          <p class=${classMap(titleClasses)}>${resource.title}</p>
        </div>
      `
    });
  }

  popupResource(resource) {
    return function() {
      let src = resource.url;
      if (resource.type == "vimeo") src = resource.id;
      setAttributes(this.popupElement, {
        type: resource.type,
        src: src,
        description: resource.title
      });
      this.popupElement.classList.remove("hide");
    };
  }
}

class ResourceContentController extends ComponentController {
  onHashChange() {
    this.host.resourceContent = this.nodePointer.attr.data;
  }

  hostConnected() {
    super.hostConnected();
    this.host.popupElement = document.getElementsByTagName('media-popup')[0];
  }
}