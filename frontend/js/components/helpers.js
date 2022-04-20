import { html } from "lit";
import Player from '@vimeo/player';

export function repeat(list, func) {
  if (!list) return html``;
  return html`${list.map(func)}`;
}

export function pauseVimeoPlayer(iframe) {
  let player = new Player(iframe);
  player.pause();
}

export function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "class") {
      element.classList.add(value);
      return ;
    }

    if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
      return ;
    }

    if (key === "text") {
      element.textContent = value;
      return ;
    }

    element.setAttribute(key, value);
  });
}