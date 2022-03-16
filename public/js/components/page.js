import { LitElement, css, html  } from "lit";
import { styleMap } from 'lit/directives/style-map.js';
import ComponentController from "./componentController.js";

export default class Page extends LitElement {
  controller = new ComponentController(this);

  static properties = {
    structure: {reflect: true}
  }

  static styles = css`
    ::slotted( img[name="cover-image"] ) {
      position: absolute;
      top: 50%;
      left: 0;
      height: 100vh;
      width: calc(100vw - var(--border-width) - 27rem);
      padding-left: calc(var(--border-width) + 27rem);
      object-fit: contain;
      transform: translateY(-50%);
      box-sizing: content-box;
    }

    ::slotted( navigation-bar ){
      top: 50%;
      left: var(--border-width);
      width: var(--nav-width);
      height: 35rem;
      transform: translate(0%, -50%);
      position: absolute;
      overflow: hidden;
      box-sizing: border-box;
      transition: left ease-in-out 1s, transform ease-in-out 1s;
      -webkit-transition: left ease-in-out 1s, transform ease-in-out 1s, top ease-in-out 1s;
      z-index: 2;
    }

    :host[structure=home] ::slotted( navigation-bar ){
      width: 25rem;
      margin: 0;
      z-index: 0;
    }

    :host[structure=cinema] ::slotted( navigation-bar ){
      top: 0;
      left: 0;
      transform: translate(0, 0);
    }

    page-content {
      position: absolute;
      top: 0;
      left: calc(var(--border-width) + var(--nav-width));
      width: calc(100% - var(--border-width) - var(--nav-width));
      height: 100%;
      transition: all linear 1s;
      -webkit-transition: all linear 1s;
      box-sizing: border-box;
      z-index: 1;
    }
    
    #focus-frame {
      position: fixed;
      border: var(--focus-border);
      z-index: -1;
      transition: all linear 1s;
      -webkit-transition: all linear 1s;
    }
  `

  homePage() {
    const targetFrameElement = this.renderRoot.querySelector('navigation-bar');
    const frameDimension = this.focusFrameOn(targetFrameElement);
    return html`
      <slot></slot>
      <slot name="cover-image"></slot>
      <div id="focus-frame" style=${styleMap(frameDimension)}></div>
    `
  }
  
  contentPage() {
    const targetFrameElement = this.renderRoot.querySelector('page-content');
    const frameDimension = this.focusFrameOn(targetFrameElement);
    return html`
      <slot></slot>
      <page-content></page-content>
      <div id="focus-frame" style=${styleMap(frameDimension)}></div>
      `
  }
  
  frameLessPage() {
    return html`
      <slot></slot>
      <page-content></page-content>
    `
  }

  render() {
    switch (this.structure) {
      case "home":
        return this.homePage();
      case "content":
        return this.contentPage();
      default:
        return this.frameLessPage();
    }
  }

  focusFrameOn(element) {
    const dimension = element.getBoundingClientRect();
    return {
      top: dimension.top,
      left: dimension.left,
      width: dimension.width,
      height: dimension.height
    };
  }
}