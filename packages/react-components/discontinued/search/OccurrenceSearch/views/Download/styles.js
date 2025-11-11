import { css } from '@emotion/react';

export const card = ({ ...props }) => css`
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 100%;
  width: 300px;
  text-align: center;
`;

export const title = ({ ...props }) => css`
  margin: 12px 0;
`;

export const description = ({ ...props }) => css`
  color: #888;
  font-size: 14px;
  margin: 12px 0 24px 0;
  p {
    margin-bottom: 12px;
  }
`;

export const icon = css`
  width: 50px;
  height: 50px;
  margin: 0 auto 12px auto;
  display: block;
  border: 2px solid #cecfd8;
  color: #cecfd8;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 40px;
    width: 40px;
  }
`;
