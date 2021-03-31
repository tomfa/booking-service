import styled from 'styled-components';

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: 3px solid ${p => p.theme.colors.primary};
  }
`;
