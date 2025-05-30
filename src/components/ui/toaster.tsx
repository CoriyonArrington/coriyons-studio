// src/components/ui/toaster.tsx
"use client";

import React from 'react';
import {
  Spinner,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  createStandaloneToast,
} from "@chakra-ui/react";
import type { UseToastOptions } from "@chakra-ui/react";

const { toast } = createStandaloneToast({
  defaultOptions: {
    position: "bottom-right",
    duration: 5000,
    isClosable: true,
    render: (props: UseToastOptions & { id?: string; onClose: () => void }) => {
      const { title, description, status, onClose, isClosable } = props;

      let alertStatus: "success" | "error" | "warning" | "info" = "info";
      if (status === "success" || status === "error" || status === "warning" || status === "info") {
        alertStatus = status;
      }
      
      return (
        <Alert
          status={alertStatus}
          variant="solid"
          borderRadius="md"
          boxShadow="lg"
          p={4}
          width={{ base: "90%", md: "sm" }}
          maxWidth="100%"
          alignItems="flex-start"
          m={2}
        >
          {status === "loading" ? (
            // Explicitly add role and a unique aria-label for testing
            <Spinner role="status" aria-label="Processing..." size="sm" mr={3} speed="0.65s" />
          ) : (
            <AlertIcon mr={3} />
          )}
          <Box flex="1" maxWidth="calc(100% - 40px)">
            {title && <AlertTitle fontSize="md" fontWeight="bold" mb={description ? 1 : 0}>{title}</AlertTitle>}
            {description && <AlertDescription fontSize="sm" display="block">{description}</AlertDescription>}
          </Box>
          {isClosable && (
            <CloseButton
              size="sm"
              onClick={onClose}
              position="absolute"
              right="8px"
              top="8px"
            />
          )}
        </Alert>
      );
    },
  },
});

export { toast as toaster };