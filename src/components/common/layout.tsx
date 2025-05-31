// src/components/common/layout.tsx
"use client";

import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
// User type is not needed here as the user prop was removed in a previous step.

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // console.log("CLIENT DEBUG: src/components/common/layout.tsx - Rendering"); // Removed this line
  return (
    <Flex direction="column" flex="1">
      <Box as="main" flex="1" width="full" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;