import styled from 'styled-components';

export const ListItem = styled.li`
  padding: 0.5rem 1rem;
  background-color: #2a2a2a;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${p => p.theme.colors.primary};
    color: black;
  }
`;

export const DateStamp = styled.span`
  font-size: 0.7em;
  opacity: 0.7;
  margin-left: 1rem;
`;
