import styled from 'styled-components';
import { SimpleLogoIcon } from './SimpleLogoIcon';

export const AWrapper = styled.a`
  text-decoration: none;
`;

export const LogoIcon = styled(SimpleLogoIcon)`
  width: 30px;
  height: 30px;
  margin-right: 0.7rem;
`;

export const LogoText = styled.span`
  color: white;
  font-size: 2rem;
`;
