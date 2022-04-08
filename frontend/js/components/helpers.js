import { html } from "lit";

export function repeat(list, func) {
  return html`${list?.map(func)}`;
}