import styled from 'styled-components';
import { large } from '../styles/mediaQueries';

export const Code = styled.code`
  display: flex;
  padding: 1rem;
  font-size: 1rem;
  background: black;
  word-break: break-word;

  flex-direction: column;

  ${large} {
    flex-direction: row;
  }
`;
