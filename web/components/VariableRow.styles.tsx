import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 701px) {
    flex-direction: row;
  }
`;

export const NameInput = styled.input`
  margin-bottom: 0.2rem;
  font-size: 0.8rem;
  padding: 0.5rem;
  border: none;

  @media (min-width: 701px) {
    margin-right: 0.2rem;
  }

  &:focus {
    outline: 3px solid ${p => p.theme.colors.primary};
  }
`;

export const ValueInput = styled(NameInput)`
  flex: auto;
`;
