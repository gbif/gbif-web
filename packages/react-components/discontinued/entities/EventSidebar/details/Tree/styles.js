import { css } from '@emotion/react';

export const tree = ({ theme, ...props }) => css`

  ul {
      position: relative;
      padding: 1em 0; 
      white-space: nowrap;
      margin: 0 auto;
      text-align: center;
        ::after {
            content: '';
            display: table;
            clear: both;
         } 
  }       

  li {
      display: inline-block; 
      vertical-align: top;
      text-align: center;
      list-style-type: none;
      position: relative;
      padding: 1em .5em 0 .5em;
      ::before,
      ::after {
        content: '';
        position: absolute; 
        top: 0; 
        right: 50%;
        border-top: 1px solid #ccc;
        width: 50%; 
        height: 1em;
      }
      ::after {
        right: auto; 
        left: 50%;
        border-left: 1px solid #ccc;
      }
      :only-child::after,
      :only-child::before {
        display: none;
      }
      :only-child {
        padding-top: 0;
      }
      :first-of-type::before,
      :last-child::after {
        border: 0 none;
      }
      :last-child::before {
        border-right: 1px solid #ccc;
        border-radius: 0 5px 0 0;
      }
      :first-of-type::after{
        border-radius: 5px 0 0 0;
      }
  }

  ul ul::before {
    content: '';
    position: absolute; 
    top: 0; 
    left: 50%;
    border-left: 1px solid #ccc;
    width: 0; 
    height: 1em;
  }

  li span {
      border: 1px solid #ccc;
      padding: .5em .75em;
      text-decoration: none;
      display: inline-block;
      border-radius: 5px;
      color: #333;
      position: relative;
      top: 1px;
  }

  li .selected {
      background: ${theme.primary};
      color: #fff;
      border: 1px solid #ccc;
      
  }
    
  li .clickable:hover {
      background: ${theme.primary};
      color: #fff;
      border: 1px solid #ccc;
      cursor: pointer;
  }
    
  li span:hover  ul li::after, 
  li span:hover  ul li::before, 
  li span:hover  ul::before, 
  li span:hover  ul ul::before {
      border-color:  #ccc;
  }
`;

export default {
    tree
}