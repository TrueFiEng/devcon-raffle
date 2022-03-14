import { createGlobalStyle } from 'styled-components'

import { Colors } from './colors'
import { fonts } from './fonts'

export const GlobalStyles = createGlobalStyle`
  ${fonts}

  *, *:before, *:after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
  }

  html {
    font-size: 16px;
    height: 100%;
  }

  body {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${Colors.Black};
    height: 100%;
    margin: 0;
    text-size-adjust: 100%;
  }

  #root {
    height: 100%;
  }

  .ReactModal__Body--open {
    overflow-y: hidden;
  }

  h1, h2, h3, h4 {
    font-family: 'Space Mono', 'Roboto Mono', monospace;
    font-style: normal;
    margin: 0;
  }

  h1 {
    font-style: normal;
    font-weight: 700;
    font-size: 55px;
    line-height: 1.2;
    color: ${Colors.White};
  }

  h2 {
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 1.2;
    color: ${Colors.White};
  }

  h3 {
    font-style: normal;
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: ${Colors.Black};
  }

  h4 {
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;
    color: ${Colors.Black};
  }

  p {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
  }
  button, a {
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }
`
