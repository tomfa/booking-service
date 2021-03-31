import styled from 'styled-components';

export const Code = styled.code`
  display: flex;
  padding: 1rem;
  font-size: 1rem;
  background: black;
  word-break: break-word;

  flex-direction: column;

  @media (min-width: 701px) {
    flex-direction: row;
  }
`;
