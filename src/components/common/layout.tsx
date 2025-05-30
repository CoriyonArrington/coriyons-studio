// src/components/common/layout.tsx
"use client";

import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import SiteHeader from './site-header';
import SiteFooter from './site-footer';
import type { User } from "@supabase/supabase-js"; // Assuming User type might be needed by SiteHeader

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null; // Optional: Pass user to SiteHeader if needed by Layout context
}

const Layout: React.FC<LayoutProps> = ({ children, user = null }) => {
  return (
    <Flex direction="column" minH="100vh">
      <SiteHeader user={user} /> {/* Pass user prop to SiteHeader */}
      <Box as="main" flex="1" py={8}> {/* Added some default padding, adjust as needed */}
        {/* Assuming content width will be handled by children or a wrapper within children */}
        {children}
      </Box>
      <SiteFooter />
    </Flex>
  );
};

export default Layout;