import styled from 'styled-components';

export const ActionWrapper = styled.div`
  display: flex;
  padding: 0 0.5rem;
  align-items: center;
  flex-direction: row;

  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;
