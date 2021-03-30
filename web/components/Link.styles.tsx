import styled from 'styled-components';
import { IconWrapper } from './Icon.styles';

export const Link = styled.a`
  &:focus,
  &:focus-within,
  &:hover {
    outline: none;

    & > ${IconWrapper} {
      box-shadow: inset -1px 1px 3px 0px rgba(0, 0, 0, 0.75);
    }
  }
`;
