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