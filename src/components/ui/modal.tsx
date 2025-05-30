// src/components/ui/modal.tsx
"use client";

import React from 'react';
import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalOverlay,
  ModalOverlayProps,
  ModalContent,
  ModalContentProps,
  ModalHeader,
  ModalHeaderProps,
  ModalFooter,
  ModalFooterProps,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalCloseButtonProps,
} from '@chakra-ui/react';

export type UIModalProps = ChakraModalProps;
const UIModal: React.FC<UIModalProps> = ({ children, ...props }) => <ChakraModal {...props}>{children}</ChakraModal>;

export type UIModalOverlayProps = ModalOverlayProps;
const UIModalOverlay: React.FC<UIModalOverlayProps> = (props) => <ModalOverlay {...props} />;

export type UIModalContentProps = ModalContentProps;
const UIModalContent: React.FC<UIModalContentProps> = ({ children, ...props }) => <ModalContent {...props}>{children}</ModalContent>;

export type UIModalHeaderProps = ModalHeaderProps;
const UIModalHeader: React.FC<UIModalHeaderProps> = ({ children, ...props }) => <ModalHeader {...props}>{children}</ModalHeader>;

export type UIModalFooterProps = ModalFooterProps;
const UIModalFooter: React.FC<UIModalFooterProps> = ({ children, ...props }) => <ModalFooter {...props}>{children}</ModalFooter>;

export type UIModalBodyProps = ModalBodyProps;
const UIModalBody: React.FC<UIModalBodyProps> = ({ children, ...props }) => <ModalBody {...props}>{children}</ModalBody>;

export type UIModalCloseButtonProps = ModalCloseButtonProps;
const UIModalCloseButton: React.FC<UIModalCloseButtonProps> = (props) => <ModalCloseButton {...props} />;

export {
  UIModal,
  UIModalOverlay,
  UIModalContent,
  UIModalHeader,
  UIModalBody,
  UIModalFooter,
  UIModalCloseButton,
};