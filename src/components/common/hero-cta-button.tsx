// src/components/common/hero-cta-button.tsx
"use client";

import React from 'react';
import Button from '@/src/components/ui/button';
import NextLink from 'next/link';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import type { ButtonProps } from '@/src/components/ui/button';

interface HeroCtaButtonProps extends Omit<ButtonProps, 'children' | 'rightIcon' | 'as'> {
  href: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

const HeroCtaButton: React.FC<HeroCtaButtonProps> = ({
  href,
  children,
  showIcon = true,
  ...buttonProps
}) => {
  // console.log("CLIENT DEBUG: HeroCtaButton rendering (Icon separate, not as prop)"); // <--- REMOVED
  return (
    <NextLink href={href} passHref>
      <Button
        as="a"
        size="lg"
        colorScheme="blue"
        {...buttonProps}
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