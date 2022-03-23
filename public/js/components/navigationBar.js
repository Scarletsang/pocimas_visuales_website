import { LitElement, css, html} from 'lit';
import store from "../store";
import ComponentController from './componentController';

export default class NavigationBar extends LitElement {

  controller = new NavigationBarController(this);

  static properties = {
    structure: {reflect: true},
    nextIds:   {type: Array, state: true}
  }

  static styles = css`
    :host {
      border: none;
      padding: 1.5ex 0;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      box-sizing: border-box;
    }

    :host([structure=home]) {
      padding: 1.5ex 3rem;
    }

    :host * {
      font: var(--nav-font);
    }

    h1 {font: unset }

    #website-icon-image {
      display: block;
      width: 10rem;
      height: 10rem;
      margin-bottom: 2rem;
      cursor: pointer;
      background: url("/img/logo_01.svg") no-repeat;
      transition: all 200ms ease-in-out;
    }
    
    :host([structure=cinema]) #website-icon-image {
      width: 6rem;
    }

    #website-icon-image:hover, #website-icon-image:active {
      background: url("/img/logo_02.svg") no-repeat;
    }

    slot {
      display: block;
      margin-bottom: 2rem;
    }

    ::slotted(h1:nth-child(1)) {
      font-size: 3rem;
      margin-bottom: 0;
    }

    ::slotted(h1:nth-child(2)) {
      font-size: 1rem;
    }

    ::slotted(hr:nth-child(3)) {
      margin-bottom: 0;
      margin-top: 24px;
      border: 1px solid var(--theme-color);
    }

    ::slotted(h1:nth-child(4)) {
      margin: 0;
      font-size: 1rem;
      font-style: italic;
    }

    #start-btn {
      display: block;
      justify-self: end;
      margin-top: auto;
      border: none;
      color: var(--theme-color);
      background-color: transparent;
      cursor: pointer;
    }
  `

  homePage() {
    return html`
      <slot name= "website-icon-text"></slot>
      <lesson-list structure="${this.structure}"></lesson-list>
      <button id="start-btn" type="button" @click="${this.startBtn}">
        <h1>comenzar</h1>
      </button>
    `
  }

  cinemaPage() {
    return html`
      <div @click="${this.iconBtn}" id="website-icon-image"></div>
    `
  }

  contentPage() {
    return html`
      <div @click="${this.iconBtn}" id="website-icon-image"></div>
      <lesson-list structure="${this.structure}"></lesson-list>
    `
  }

  render() {
    switch (this.structure) {
      case "home":
        return this.homePage();
      case "cinema":
        return this.cinemaPage();
      default:
        return this.contentPage();
    }
  }

  startBtn() {
    let startNodeId = this.nextIds[this.nextIds.length - 1];
    window.location.hash = `#${startNodeId}`;
  }

  iconBtn() {
    window.location.hash = `#${store.get("entryNodeId")}`
  }
}

class NavigationBarController extends ComponentController {
  onStructureChange() {
    let nextIds = this.nodeWalker.nextIds;
    this.host.nextIds = nextIds ? nextIds : [];
  }
}