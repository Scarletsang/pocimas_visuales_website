import { LitElement, css, html  } from "lit";
import { styleMap } from 'lit/directives/style-map.js';
import ComponentController from "./componentController.js";

export default class PageContent extends LitElement {
  controller = new PageContentController(this);

  static properties = {
    structure: {reflect: true},
    nextIds:   {type: Array, state: true},
    contents:  {type: DocumentFragment, state: true}
  }

  static styles = css`
    
  `

  render() {
    if (this.nextIds.length == 1) {
      return html`
        <section id="lesson-content">${this.contents}</section>
        <button id="next-lesson-btn" type="button">
          <slot name="next-lesson-btn-text"></slot>
        </button>
      `
    }
    return html`<slot></slot>`
  }
}

class PageContentController extends ComponentController {
  onStructureChange() {
    
  }
}