import styled from 'styled-components';

export const AlertWrapper = styled.div<{ $type: 'error' | 'success' | 'info' }>`
  ${p =>
    p.$type === 'error' &&
    `
    background-color: ${p.theme.colors.bgDanger};
    color: white;
  `}
  ${p =>
    p.$type === 'success' &&
    `
    background-color: ${p.theme.colors.bgSuccess};
    color: white;
  `}
  ${p =>
    p.$type === 'info' &&
    `
    background-color: ${p.theme.colors.secondary};
    color: white;
  `}
  
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.3);
  width: 300px;
  box-sizing: border-box;
  font-size: 11px;
  position: relative;
`;

export const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const MessageText = styled.div`
  font-size: 0.8rem;
  padding: 0.5rem 0;
  width: 100%;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  min-width: 50px;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  &:hover {
    opacity: 0.5;
  }
`;

export const MessageIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 50px;
  height: 100%;
`;
