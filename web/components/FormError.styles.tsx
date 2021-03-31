import styled from 'styled-components';

export const FormErrorWrapper = styled.div<{ $hidden: boolean }>`
  border: 3px solid ${p => p.theme.colors.danger};
  color: ${p => p.theme.colors.textPrimary};
  padding: 0.5rem;
  margin: 1rem 0;
  display: flex;
  align-content: center;
  visibility: ${p => (p.$hidden && 'hidden') || 'visible'};
`;

export const FormErrorText = styled.span`
  display: flex;
  align-items: center;
`;
