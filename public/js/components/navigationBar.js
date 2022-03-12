import { LitElement, css, html} from 'https://unpkg.com/lit-element@3.2.0/lit-element.js?module';
import { nodeWalker, ENTRY_NODE_ID } from "../store.js";
import { hashChangeEvent } from "../eventDispatcher.js";
import controlledByEvent from './componentController.js';

export default class NavigationBar extends LitElement {

  controller = new NavigationBarController(this);

  static properties = {
    outerStructure: {reflect: true}
  }

  static styles = css`
    :host {
      width: var(--nav-width);
      height: 35rem;
      padding: 1.5ex 0;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      box-sizing: border-box;
    }

    :host * {
      font: normal 600 1.25rem "Mali", sans-serif;
    }

    #website-icon-image {
      display: block;
      width: 10rem;
      height: 10rem;
      margin-bottom: 2rem;
      cursor: pointer;
      background: url("../img/logo_01.svg") no-repeat;
    }

    #website-icon-image:hover, #website-icon-image:active {
      background: url("../img/logo_02.svg") no-repeat;
    }

    #website-icon-text {
      display: block;
      margin-bottom: 2rem;
    }

    #website-icon-text h1:nth-child(1) {
      font-size: 3rem;
      margin-bottom: 0;
    }

    #website-icon-text h1:nth-child(2) {
      font-size: 1rem;
    }

    #website-icon-text hr:nth-child(3) {
      margin-bottom: 0;
      margin-top: 24px;
      border: 1px solid var(--theme-color);
    }

    #website-icon-text h1:nth-child(4) {
      margin: 0;
      font-size: 1rem;
      font-style: italic;
    }

    #start-btn {
      display: block;
      justify-self: end;
      margin-top: auto;
    }
  `

  homePage() {
    return html`
      <div id="website-icon-text">
        <h1>Pócima Visual 02_</h1>
        <h1>estando aquí no estoy estoy</h1>
        <hr>
        <h1>Escuela de espiritismo tecnológico</h1>
      </div>
      <lesson-list></lesson-list>
      <button id="start-btn" type="button" @click="${this.controller.startBtn}">
        <h1>comenzar</h1>
      </button>
    `
  }

  cinemaPage() {
    return html`
      <div @click="${this.controller.iconBtn}" id="website-icon-image"></div>
    `
  }

  contentPage() {
    return html`
      <div @click="${this.controller.iconBtn}" id="website-icon-image"></div>
      <lesson-list></lesson-list>
    `
  }

  render() {
    switch (this.outerStructure) {
      case "home":
        return this.homePage();
      case "cinema":
        return this.cinemaPage();
      default:
        return this.contentPage();
    }
  }
}


class NavigationBarController extends controlledByEvent(hashChangeEvent, "navigationBarComponent") {
  constructor(host) {
    super(host);
  }

  callback() {
    this.host.outerStructure = nodeWalker.currentStructure;
  }

  startBtn() {
    let nextIds = nodeWalker.nextIds();
    let startNodeId = nextIds[nextIds.length - 1];
    window.location.hash = `#${startNodeId}`;
  }

  iconBtn() {
    window.location.hash = `#${ENTRY_NODE_ID}`
  }
}