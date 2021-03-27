import styled from 'styled-components';

export const Button = styled.button<{ $blank: boolean }>`
  ${p => p.$blank && `all: unset;`}
  cursor: pointer;
`;
