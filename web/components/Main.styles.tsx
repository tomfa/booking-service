import styled from 'styled-components';

export const Main = styled.main`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;

  padding: 1rem;
  max-width: 100%;
  margin-top: 3rem;

  @media (min-width: 701px) {
    width: 700px;
  }
`;
