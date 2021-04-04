import styled from 'styled-components';

export const Input = styled.input`
  border-radius: 0;
  border: 0;
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: 3px solid ${p => p.theme.colors.primary};
  }

  &:disabled {
    background-color: transparent;
    box-shadow: inset -1px 1px 3px 0px rgba(0, 0, 0, 0.75);
    color: ${p => p.theme.colors.muted};
  }
`;
