import styled from 'styled-components';

export const Main = styled.main`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;

  padding: 1rem;
  margin-top: 3rem;

  max-width: ${p => p.theme.layout.contentWidth};
`;
