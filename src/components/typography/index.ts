// src/components/typography/index.ts
export { default as Heading } from './heading';
export { default as Text } from './text';
// FIX: Added type export for TextAsValues from ./text
export type { TextAsValues } from './text';
export { TypographyInlineCode } from './inline-code'; // Assuming TypographyInlineCode is a named export

// If TypographyInlineCode is a default export from inline-code.tsx, it would be:
// export { default as TypographyInlineCode } from './inline-code';