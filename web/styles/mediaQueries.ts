import theme from './theme';

export const tinyOnly = `@media (max-width: ${theme.layout.sizes.small - 1}px)`;
export const medium = `@media (min-width: ${theme.layout.sizes.medium}px)`;
export const large = `@media (min-width: ${theme.layout.sizes.large}px)`;
export const huge = `@media (min-width: ${theme.layout.sizes.huge}px)`;

export const from = (size: number) => `@media (min-width: ${size}px)`;
export const to = (size: number) => `@media (max-width: ${size - 1}px)`;
