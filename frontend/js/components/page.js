import { LitElement, css, html } from "lit";
import ComponentController from "./componentController";

export default class Page extends LitElement {
  controller = new PageController(this);

  static properties = {
    structure: {reflect: true},
    navStructure: {state: true},
    coverImage: {state: true}
  }

  static styles = css`
    /* default structure: content */
    navigation-bar {
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

    #page-content-wrapper {
      position: absolute;
      top: 0;
      left: calc(var(--border-width) + var(--nav-width));
      width: calc(100% - var(--border-width) - var(--nav-width));
      height: 100%;
      transition: all linear 1s;
      -webkit-transition: all linear 1s;
      box-sizing: border-box;
      overflow-y: scroll;
      overflow-x: hidden;
      z-index: 1;
    }

    .content {
      position: absolute;
      border: none;
      top: var(--border-width);
      left: 0;
      width: calc(100% - var(--border-width));
      height: calc(100% - 2 * var(--border-width));
    }

    /* structure: home */
    
    :host([structure=home]) navigation-bar {
      width: 25rem;
      margin: 0;
      border: var(--focus-border);
    }
    
    #cover-image {
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

    /* structure: choice */

    :host([structure=choice]) #page-content-wrapper {
      padding-bottom: var(--border-width);
      overflow-y: hidden;
      overflow-x: scroll;
    }

    :host([structure=choice]) .content {
      width: unset;
      min-width: calc(100% - var(--border-width));
      top: 0;
      height: 100%;
      padding-left: 0;
      padding-right: 0;
    }

    /* structure: cinema */
    
    /* :host([structure=cinema]) navigation-bar {
      top: 0;
      left: 0;
      transform: translate(0, 0);
    }
    
    :host([structure=cinema]) #page-content-wrapper {
      left: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
    }

    :host([structure=cinema]) .content {
      top: 0;
      width: 100%;
      box-sizing: border-box;
    } */
  `

  homePage() {
    return html`
      ${this.renderNavigationBar()}
      <img id="cover-image" src=${this.coverImage}>
      `
  }
  
  contentPage() {
    return html`
      ${this.renderNavigationBar()}
      <div id="page-content-wrapper">
        <page-content class="content" structure="${this.structure}"></page-content>
      </div>
      `
  }

  choicePage() {
    return html`
      ${this.renderNavigationBar()}
      <div id="page-content-wrapper" @wheel=${this.horizontalScroll}>
        <lobby-element class="content" ></lobby-element>
      </div>
    `
  }

  resourcePage() {
    return html`
      ${this.renderNavigationBar()}
      <div id="page-content-wrapper">
        <resource-content class="content" ></resource-content>
      </div>
    `
  }

  cinemaPage() {
    
  }

  renderNavigationBar() {
    let navStructure = this.navStructure ? this.navStructure : this.structure;
    return html`
      <navigation-bar structure=${navStructure}></navigation-bar>
    `;
  }
  
  render() {
    switch (this.structure) {
      case "home":
        return this.homePage();
      case "choice":
        return this.choicePage();
      case "resource":
        return this.resourcePage();
      default:
        return this.contentPage();
    }
  }

  async getUpdateComplete() {
    await super.getUpdateComplete();
    const children = Array.from(this.shadowRoot.children);
    await Promise.all(children.map(el => el.updateComplete));
    return true;
  }

  horizontalScroll(event) {
    event.currentTarget.scrollLeft += event.deltaY;
  }
}

class PageController extends ComponentController {
  onHashChange() {
    this.host.structure = this.nodePointer.attr.structure;
    this.host.navStructure = this.nodePointer.attr.navStructure;
    if (this.host.structure == "home") {
      console.log(this.nodePointer.attr);
      this.host.coverImage = this.nodePointer.attr.coverImage;
    }
  }
}