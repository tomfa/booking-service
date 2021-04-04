import styled from 'styled-components';
import { large } from '../../styles/mediaQueries';
import { ActionWrapper } from './FileActions.styles';

export const DateStamp = styled.span`
  text-align: right;
  margin: 0.5rem 1rem;
  font-size: 0.7em;
`;

export const ListItemText = styled.span`
  text-align: left;
  margin: 0.5rem 1rem;
`;

export const ListItem = styled.li<{
  $selected?: boolean;
  $selectable?: boolean;
  $archived?: boolean;
}>`
  font-size: 1rem;
  width: 100%;
  padding: 0;
  color: ${p => p.theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  border: none;
  background-color: transparent;
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

  ${large} {
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
  }

  ${p =>
    p.$archived &&
    `
    &> ${DateStamp}, &> ${ListItemText} {
      text-decoration: line-through;
      color: ${
        (p.$selected && p.theme.colors.textSecondary) ||
        p.theme.colors.secondary
      };
    }
    
    
    &:hover {
      &> ${ListItemText} {
        color: ${p.theme.colors.textSecondary};
      }
    }  
  `}
`;
