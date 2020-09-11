import { css } from '@emotion/core';



export const doi = () => css `
font-size: 12px;
  text-decoration: none;
  display: inline-block;
  >span {
      border: 1px solid #dbe3e7
  };

  >span:first-of-type {
      transition: all 300ms ease;
      background: #09c;
      padding: 0 4px;
      border-radius: 5px 0 0 5px;
      color: white;
      border-right-width: 0;
      border-color: #09c
  }
  >span:last-of-type {
      color: #333;
      background: white;
      text-decoration: none;
      padding: 0 7px;
      border-radius: 0 5px 5px 0;
      border-left-width: 0;
  }`