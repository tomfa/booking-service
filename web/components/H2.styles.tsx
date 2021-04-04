import styled from 'styled-components';

export const H2 = styled.h2`
  display: flex;
  font-size: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${p => p.theme.colors.secondary};
  align-items: flex-end;

  & + p {
    margin-top: 0;
  }
`;
