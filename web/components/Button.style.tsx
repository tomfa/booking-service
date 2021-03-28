import styled from 'styled-components';

export const BlankButton = styled.button`
  all: unset;
  cursor: pointer;
`;

export const BaseButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;
