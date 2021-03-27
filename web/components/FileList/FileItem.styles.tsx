import styled from 'styled-components';
import { ActionWrapper } from './FileActions.styles';

export const DateStamp = styled.span`
  margin: 0.5rem 1rem;
  font-size: 0.7em;
  opacity: 0.7;
  margin-left: 1rem;
`;

export const ListItemText = styled.span`
  margin: 0.5rem 1rem;
`;

export const ListItem = styled.li`
  background-color: #2a2a2a;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > ${ActionWrapper} {
    display: none;
  }

  &:hover {
    background-color: ${p => p.theme.colors.primary};
    color: black;

    & > ${DateStamp} {
      display: none;
    }

    & > ${ActionWrapper} {
      display: flex;
    }
  }
`;
