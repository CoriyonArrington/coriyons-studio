// src/components/common/hero-cta-button.tsx
"use client";

import React from 'react';
import Button from '@/src/components/ui/button'; // Your custom Button component
import NextLink, { type LinkProps } from 'next/link';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import type { ButtonProps } from '@/src/components/ui/button';

interface HeroCtaButtonProps extends Omit<ButtonProps, 'children' | 'rightIcon' | 'as'> {
  href: LinkProps['href'];
  children: React.ReactNode;
  showIcon?: boolean;
}

const HeroCtaButton: React.FC<HeroCtaButtonProps> = ({
  href,
  children,
  showIcon = true,
  ...buttonProps
}) => {
  return (
    <NextLink href={href}>
      <Button
        size="lg"
        colorScheme="blue"
        {...buttonProps}
        // We intentionally do NOT set `as="a"` here.
      >
        {children}
        {showIcon && (
          <Box as="span" ml={2} display="inline-flex" alignItems="center">
            <ArrowForwardIcon />
          </Box>
        )}
      </Button>
    </NextLink>
  );
};

export default HeroCtaButton;
