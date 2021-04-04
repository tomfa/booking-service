import styled from 'styled-components';
import { dimDown } from './keyframes';

export const Wrapper = styled.button<{
  $highlighted?: boolean;
  $loading?: boolean;
}>`
  background: none;
  padding: 3rem 2rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-size: 1rem;
  cursor: pointer;
  border: 1px dashed #fff;
  opacity: 0.5;

  ${p =>
    p.$highlighted &&
    `
    opacity: 1;
    border-style: solid;
    background-color: ${p.theme.colors.primary};
  `}

  animation: ${dimDown} 1.2s linear infinite;
  animation-direction: alternate;
  animation-duration: ${p => (p.$loading ? '1.2s' : 'unset')};
  color: ${p => (p.$loading ? p.theme.colors.primary : 'unset')};

  &:hover,
  &:focus {
    opacity: 1;
    border-style: solid;
    border-color: ${p => p.theme.colors.primary};
    outline: 1px solid ${p => p.theme.colors.primary};
  }
`;
