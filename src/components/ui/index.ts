// src/components/ui/index.ts
export { default as Button } from './button';
export { UICard, UICardHeader, UICardBody, UICardFooter, UICardHeading, UICardText } from './card'; // Named exports from card.tsx
export { default as Input } from './input';
export { 
  UIModal, 
  UIModalOverlay, 
  UIModalContent, 
  UIModalHeader, 
  UIModalBody, 
  UIModalFooter, 
  UIModalCloseButton 
} from './modal'; // Named exports from modal.tsx
export { default as Spinner } from './spinner';

// Existing UI components/utilities
export { ChakraNextThemeSyncer } from './chakra-next-theme-syncer'; // Named export
export { toaster } from './toaster'; // Named export
export { ThemeProvider } from './theme-provider'; // Named export (assuming from your rename)

// Exports from color-mode.tsx (excluding the removed Button and Icon)
export { 
  ColorModeProvider, 
  useColorMode, 
  useColorModeValue 
} from './color-mode';
export type { ColorModeProviderProps, ColorMode, UseColorModeReturn } from './color-mode';