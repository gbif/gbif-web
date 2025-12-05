import { css, jsx } from '@emotion/react';
import { srOnly } from '../../../style/shared';

export const test = css``;

export const drawerHeader = css`
    height: 86px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    padding: 0 20px;
    flex: 0 0 auto;
`;

export const globalNavBar = css`
    padding: 20px;
    background: white;
    z-index: 1;
    border-bottom: 1px solid #eee;
    a {
      color: currentColor;
      text-decoration: none;
    }
    @media (min-width: 1200px) {
        padding: 20px 100px;
    }
`;

export const logo = css`
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    z-index: 1;
    svg {
      font-size: 45px;
    }
`;

export const mobileLayout = ({breakpoint}) => css`
    @media (min-width: ${breakpoint + 1}px) {
        display: none;
    }
`;

export const laptopLayout = ({breakpoint}) => css`
    @media (max-width: ${breakpoint}px) {
        display: none;
    }
`;

export const globalNavMobileToggle_expand = css`
    ${srOnly};
    &+div .gbif-toggleExpandLess {
        display: none;
    }
    &:checked+div {
        .gbif-toggleExpandMore {
            display: none;
        }
        .gbif-toggleExpandLess {
            display: inline-block;
        }
    }
    &+div+div {
        display: none;
    }
    &:checked+div+div {
        display: block;
    }
`;

export const slideIn = props => css`
    width: 50vw;
    bottom: 0;
    position: fixed;
    ${props.rtl ? 'left: 0;' : 'right: 0'};
    z-index: 5;
    opacity: 0;
    transform: translateX(${props.rtl ? -100 : 100}%);
    transition: opacity .2s linear, transform .2s ease-in-out;
    background: white;
`;

export const globalNavMobile__subToggle = props => css`
    ${srOnly}
    &+div {
        opacity: 0;
        ${slideIn(props)}
        top: 0;
        display: flex;
        flex-direction: column;
    }
    &:checked+div {
        opacity: 1;
        transform: translateX(0);
    }
`;

export const globalNavDropdown__mobileMenu = css`
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: auto;
    flex: 1 1 auto;
`;

export const globalNavPrimary__mobileItem = css`
    background-color: #fff;
    padding-left: 1.875rem;
    padding-right: 1.875rem;
`;

export const mobileItem_action = props => css`
    align-items: center;
    border-bottom: .0625rem solid #dbd9d2;
    display: flex;
    justify-content: flex-start;
    padding: 1.5625rem 0;
    width: 100%;
`;

export const globalNavMobileToggle = props => css`
    z-index: 10;
    padding: 10px;
    &+div {
        position: absolute;
        ${mobileLayout(props)};
        &:after {
            content: '';
            display: block;
            opacity: 0;
            bottom: 0;
            top: 0;
            transition: opacity 3s linear;
            z-index: 1;
            transition: opacity .15s linear,visibility 0s linear .15s;
            visibility: hidden;
            background-color: rgba(0,0,0,.6);
            position: fixed;
            width: 100vw;
            left: 0;
            right: 0;
        }
        &>div {
            ${slideIn(props)};
            top: 0;
        }
    }
    &:checked + div {
        background: blue;
        &:after {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
        }
        &>div {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;


export const globalNavPrimary = css`
    align-items: center;
    box-sizing: border-box;
    display: flex;
`;

export const globalNavPrimary__menu = css`
    list-style: none;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0 1em;
`;

const hoverItem = props => css`
    &:hover .gbif-menu-title {
        color: ${props.theme.primary700};
    }
`;

export const globalNavPrimary__item = props => css`
    display: block;
    padding: 10px 20px;
    ${hoverItem(props)};
    & >ul {
        visibility: ${props.expanded ? 'visible' : 'hidden'};
    }
    &:hover > ul {
        visibility: visible;
    }
`;

export const globalNavDropdown__item = css`
`;

export const globalNavDropdown = css`
    background: white;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    left: 0;
    padding: 50px 100px;
    position: absolute;
    width: 100%;
    z-index: 0;
    list-style: none;
`;

export const globalNavDropdown__menu = props => css`
    padding: 0 1.25rem;
    position: relative;
    width: ${Math.floor(100 / props.menuItemCount)}%;
`;
export const globalNavDropdown__links = css`
    list-style: none;
    padding: 0;
`;
