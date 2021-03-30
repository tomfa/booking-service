import styled from 'styled-components';

export const H1 = styled.h1`
  color: ${p => p.theme.colors.secondary};
  text-align: center;
  margin: 0;
  line-height: 1.15;
  font-size: 3rem;

  @media (min-width: 701px) {
    font-size: 4rem;
  }
`;
