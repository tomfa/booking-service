import styled from 'styled-components';
import { ActionWrapper } from './FileActions.styles';

export const DateStamp = styled.span`
  text-align: right;
  margin: 0.5rem 1rem;
  font-size: 0.7em;
  opacity: 0.7;
  margin-left: 1rem;
`;

export const ListItemText = styled.span`
  text-align: left;
  margin: 0.5rem 1rem;
`;

export const ListItem = styled.li<{
  $selected?: boolean;
  $selectable?: boolean;
}>`
  font-size: 1rem;
  width: 100%;
  padding: 0;
  color: ${p => p.theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  border: none;
  background-color: #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${p => p.$selectable && `cursor: pointer`};

  & > ${ActionWrapper} {
    display: none;
  }

  ${p =>
    p.$selected &&
    `
      background-color: ${p.theme.colors.primary};
      color: black;
      
      & > ${DateStamp} {
        display: none;
      }
  
      & > ${ActionWrapper} {
        display: flex;
      }
  `}

  &:focus {
    outline: 2px solid ${p => p.theme.colors.primary};
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
