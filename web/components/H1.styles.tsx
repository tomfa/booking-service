import styled from 'styled-components';
import * as MQ from '../styles/mediaQueries';

export const H1 = styled.h1`
  color: ${p => p.theme.colors.primary};
  text-align: center;
  margin: 0;
  line-height: 1.15;
  font-size: 3rem;

  ${MQ.large} {
    font-size: 4rem;
  }
`;
