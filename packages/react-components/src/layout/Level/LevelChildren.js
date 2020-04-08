import { css } from '@emotion/core';
import styled from '@emotion/styled';

const shared = css`
  flex: 1 1 auto;
  align-items: center;
  @media screen and (min-width: 769px), print {
    display: flex;
    margin: 0 -0.35em;
  }
`;

export const LevelLeft = styled.div`
  ${shared}
  justify-content: flex-start;
`;

export const LevelRight = styled.div`
  ${shared}
  justify-content: flex-end;
`;

export const LevelItem = styled.div`
  align-items: center;
  display: flex;
  flex: 0 1 auto;
  justify-content: center;
  margin: 0 0.35em;
`;