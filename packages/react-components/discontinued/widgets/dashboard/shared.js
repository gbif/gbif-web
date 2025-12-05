import { jsx, css } from '@emotion/react';
import React from 'react';
import { EllipsisLoader, Skeleton } from '../../components';
import { FormattedNumber as Number } from 'react-intl';

export function Card({ padded = true, loading, error, className, children, ...props }) {
  if (error) {
    console.error(error);
    return <div css={css`
      background: white;//rgb(224,87,51);
      /* background: linear-gradient(175deg, rgba(224,87,51,1) 0%, rgba(239,106,70,1) 59%, rgba(255,126,90,1) 100%); */
      /* color: white; */
      border: 1px solid var(--paperBorderColor);
      border-radius: var(--borderRadiusPx);
      display: flex;
      `}>
      <div css={css`
        flex: 0 0 150px;
        padding: 24px;
        background: url('https://graphql.gbif.org/images/error.svg');
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: 150px;
      `}>
      </div>
      <div css={css`
        flex: 1 1 auto;
        padding: 24px;
      `}>
        <h3>Error</h3>
        <p>
          The card could not be loaded. Please try again later or report the issue.
        </p>
      </div>
    </div>
  }
  return <div
    className={`gbif-card ${className ?? ''}`}
    css={css`
      background: var(--paperBackground);
      ${padded ? paddedContent : null}
      border: 1px solid var(--paperBorderColor);
      border-radius: var(--borderRadiusPx);
      padding: 18px;
      display: block !important;
      position: relative;
    `}
    {...props}>
    {loading && <div css={css`
        z-index: 1000;
        background: white;
        position: absolute;
        text-align: center; 
        opacity: 0.8; 
        top: 0; 
        bottom: 0;
        left: 0;
        right: 0;
      `}>
      <EllipsisLoader active={true} css={css`
          top: 50%;
          transform: translateY(-50%);
        `} />
    </div>}
    {children}
  </div>
}

export function CardTitle({ padded = true, options, children, ...props }) {
  return <div
    css={css`
      margin-bottom: 1.2rem;
      font-weight: 500;
      line-height: 1.2;
      font-size: 1em;
      display: flex;
    `}
    {...props}>
    <div css={css`flex: 1 1 auto;`}>{children}</div>
    <div css={css`flex: 0 0 auto;`}>{options}</div>
  </div>
}

export function Table({ padded = true, removeBorder, ...props }) {
  return <table
    css={css`
      width: 100%;
      margin-bottom: 1rem;
      border-collapse: separate;
      border-spacing: 0;
      /* tbody > tr {
        border-top: 1px solid #dee2e6;
      } */
      td {
        padding: 6px 12px;
        border-top: ${removeBorder ? 'none' : '1px solid #dee2e6'};
        
      }
      td:first-of-type {
        padding-inline-start: 0;
      }
      td:last-of-type {
        padding-inline-end: 0;
      }
    `}
    {...props}>
  </table>
}

const paddedContent = css`
  padding: 24px 48px;
`;

export function BarItem({ children, percent = 0, ...props }) {
  return <div css={css`position: relative;`}>
    <div css={css`
  position: absolute; 
  left: 0; 
  width: ${percent}%;
  height: 1.6em;
  border-radius: var(--borderRadiusPx);
  background: var(--primary);
  opacity: .2;
  `} {...props}></div>
    <div css={css`z-index: 1; margin-left: 6px;`}>{children}</div>
  </div>;
}

export function FormattedNumber(props) {
  if (typeof props?.value === 'undefined') return <Skeleton width="70px" />
  return <Number {...props} />
}