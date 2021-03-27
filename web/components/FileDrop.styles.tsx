import styled from 'styled-components';
import { fadeOut } from './keyframes';

export const Wrapper = styled.div<{ highlighted?: boolean; loading?: boolean }>`
  padding: 3rem 2rem;
  cursor: pointer;
  border: 1px dashed #fff;
  opacity: 0.5;
  text-align: center;

  ${p =>
    p.highlighted &&
    `
    opacity: 1;
    border-style: solid;
    background-color: ${p.theme.colors.primary};
  `}

  animation: ${fadeOut} 1.2s linear infinite;
  animation-direction: alternate;
  animation-duration: ${p => (p.loading ? '1.2s' : 'unset')};
  color: ${p => (p.loading ? p.theme.colors.primary : 'unset')};

  &:hover {
    opacity: 1;
    border-style: solid;
  }
`;
