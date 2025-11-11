
import { css, jsx, keyframes } from '@emotion/react';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useContext } from 'react';

const GlobalNavLaptop = () => {
    const theme = useContext(ThemeContext);
    return (
        <div css={globalNavBar}>
            <div className="globalNavPrimary">
                {/* Skip link */}
                {/* Logo home link */}
                <ul css={globalNavPrimary__menu}>
                    <li css={globalNavPrimary__item}>
                        <a href="">plain link</a>
                    </li>
                    <li css={globalNavPrimary__item}>
                        <label htmlFor="option1">has menu</label>
                        <input id="option1" type="checkbox" />
                        <ul css={globalNavDropdown}>
                            <li css={globalNavDropdown__menu({menuItemCount: 2})}>
                                <a href="">Overview</a>
                                <p>Some prose</p>
                            </li>
                            <li css={globalNavDropdown__menu({menuItemCount: 2})}>
                                <a href="">Audience</a>
                                <ul css={globalNavDropdown__links}>
                                    <li css={globalNavPrimary__item}><a href="">Marketing</a></li>
                                    <li css={globalNavPrimary__item}><a href="">Marketing2</a></li>
                                    <li css={globalNavPrimary__item}><a href="">Marketing3</a></li>
                                    <li css={globalNavPrimary__item}><a href="">Marketing4</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li css={globalNavPrimary__item}>is text only</li>
                </ul>
            </div>
            <ul className="globalNavActions">

            </ul>
        </div>
    );
}

const globalNavBar = css`
    
`;

const globalNavPrimary__menu = css`
    list-style: none;
    display: flex;
    align-items: center;
    padding: 0;
`;

const globalNavPrimary__item = css`
    display: block;
    margin-right: .625rem;
    & >ul {
        visibility: hidden;
    }
    /* &:hover > ul {
        visibility: visible;
    } */
    &>input:checked+ul {
        visibility: visible;
    }
`;

const globalNavDropdown = css`
    backface-visibility: hidden;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    left: 0;
    margin-top: -.3125rem;
    padding: 3.75rem 6.25rem 5rem;
    position: absolute;
    transition: visibility 0s linear 0s;
    width: 100%;
    z-index: 0;
    list-style: none;
`;

const globalNavDropdown__menu = props => css`
    padding: 0 1.25rem;
    position: relative;
    width: ${Math.floor(100/props.menuItemCount)}%;
`;
const globalNavDropdown__links = css`
    list-style: none;
    padding: 0;
`;
const test = css``;

export const Example = props => {
    return <GlobalNavLaptop />
}