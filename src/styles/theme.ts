import { designTokens } from './design-tokens';

export const theme = {
  ...designTokens,
} as const;

export type Theme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
