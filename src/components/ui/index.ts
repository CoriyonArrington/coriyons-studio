// FIX: Re-exporting components directly from Chakra UI instead of non-existent local files.
export { Button, Input, Spinner } from '@chakra-ui/react';
export { 
    Card as UICard, 
    CardHeader as UICardHeader, 
    CardBody as UICardBody, 
    CardFooter as UICardFooter, 
    Heading as UICardHeading, 
    Text as UICardText 
} from '@chakra-ui/react';
export { 
  Modal as UIModal, 
  ModalOverlay as UIModalOverlay, 
  ModalContent as UIModalContent, 
  ModalHeader as UIModalHeader, 
  ModalBody as UIModalBody, 
  ModalFooter as UIModalFooter, 
  ModalCloseButton as UIModalCloseButton 
} from '@chakra-ui/react';

// Existing UI components/utilities that are correctly exported
export { ChakraNextThemeSyncer } from './chakra-next-theme-syncer';
export { toaster } from './toaster';
export { ThemeProvider } from './theme-provider';
export { 
  ColorModeProvider, 
  useColorMode, 
  useColorModeValue 
} from './color-mode';
export type { ColorModeProviderProps, ColorMode, UseColorModeReturn } from './color-mode';