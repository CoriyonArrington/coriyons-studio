// src/components/ui/__tests__/modal.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'; // Added waitForElementToBeRemoved
import { ChakraProvider, extendTheme, useDisclosure, Button as ChakraButton } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import {
  UIModal,
  UIModalOverlay,
  UIModalContent,
  UIModalHeader,
  UIModalBody,
  UIModalFooter,
  UIModalCloseButton
} from '../modal';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

const ModalTestController: React.FC<{ initialIsOpen?: boolean }> = ({ initialIsOpen = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: initialIsOpen });
  return (
    <>
      <ChakraButton onClick={onOpen}>Open Modal</ChakraButton>
      <UIModal isOpen={isOpen} onClose={onClose} motionPreset="none"> {/* Added motionPreset="none" for tests */}
        <UIModalOverlay />
        <UIModalContent data-testid="modal-content">
          <UIModalHeader>Modal Title</UIModalHeader>
          <UIModalCloseButton data-testid="modal-close-button" />
          <UIModalBody>
            <p>This is the modal body.</p>
          </UIModalBody>
          <UIModalFooter>
            <ChakraButton variant="ghost" onClick={onClose}>Cancel</ChakraButton>
            <ChakraButton colorScheme="blue" ml={3} onClick={onClose}> {/* Ensure important actions also call onClose */}
              Save
            </ChakraButton>
          </UIModalFooter>
        </UIModalContent>
      </UIModal>
    </>
  );
};

describe('Modal Components', () => {
  it('should not be visible initially if isOpen is false', () => {
    renderWithChakra(<ModalTestController />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should be visible when isOpen is true', () => {
    renderWithChakra(<ModalTestController initialIsOpen={true} />);
    expect(screen.getByRole('dialog', { name: 'Modal Title' })).toBeInTheDocument();
  });

  it('should open when trigger button is clicked', async () => {
    renderWithChakra(<ModalTestController />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

    expect(await screen.findByRole('dialog', { name: 'Modal Title' })).toBeInTheDocument(); // Use findByRole for async appearance
  });

  it('should close when ModalCloseButton is clicked', async () => {
    renderWithChakra(<ModalTestController initialIsOpen={true} />);
    const dialog = await screen.findByRole('dialog'); // Ensure it's there first
    expect(dialog).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-close-button'));

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close when onClose is called (e.g., by clicking an explicit cancel button)', async () => {
    renderWithChakra(<ModalTestController initialIsOpen={true} />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close when Escape key is pressed', async () => {
    renderWithChakra(<ModalTestController initialIsOpen={true} />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Ensure the dialog or an element within it has focus for Esc to work.
    // fireEvent.keyDown on document.body or the dialog itself often works.
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should have no a11y violations when open', async () => {
    const mockOnClose = vi.fn();
    const { container } = renderWithChakra(
      // Added motionPreset="none" to prevent issues with animation state during test
      <UIModal isOpen={true} onClose={mockOnClose} motionPreset="none"> 
        <UIModalOverlay />
        <UIModalContent>
          <UIModalHeader>Accessible Modal Title</UIModalHeader>
          <UIModalCloseButton />
          <UIModalBody>
            Accessible modal content.
          </UIModalBody>
          <UIModalFooter>
            <ChakraButton onClick={mockOnClose}>Close</ChakraButton>
          </UIModalFooter>
        </UIModalContent>
      </UIModal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});