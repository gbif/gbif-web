import { jsx, css } from '@emotion/react';
import { h2 as h2Style } from "../../components/typography/Prose";

export function Card({ padded, ...props }) {
  return <div
    css={css`
      background: white;
      ${paddedContent}
    `}
    {...props}>
  </div>
}

function PaddedContent(props) {
  return <div
    css={paddedContent}
    {...props}>
  </div>
}

export function CardHeader2(props) {
  return <h2 css={h2Style} {...props} />
}

const paddedContent = css`
  padding: 24px 48px;
`;