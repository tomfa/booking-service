import styled, { keyframes } from 'styled-components';
import { ListItem } from './FileItem.styles';

const lightloop = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0.2
  }
`;

export const LoadingListItem = styled(ListItem)`
  animation: ${lightloop} 1.2s linear infinite;
  animation-direction: alternate;
  filter: blur(3px);
  pointer-events: none;
`;
