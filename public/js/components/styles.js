import { css } from "lit-element";

export const defaultButton = css`
  button {
    border: none;
    color: var(--theme-color);
    background-color: transparent;
    cursor: pointer;
  }

  button:hover, a:hover {
    color: var(--highlight-color);
  }
`;

export const defaultFonts = css`
 p, li { font: var(--paragraph-font); }
 h1 { font: var(--title-font); }
`