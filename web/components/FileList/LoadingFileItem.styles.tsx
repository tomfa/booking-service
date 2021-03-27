import styled from 'styled-components';
import { dimDown } from '../keyframes';
import { ListItem } from './FileItem.styles';

export const LoadingListItem = styled(ListItem)`
  animation: ${dimDown} 1.2s linear infinite;
  animation-direction: alternate;
  filter: blur(3px);
  pointer-events: none;
`;
