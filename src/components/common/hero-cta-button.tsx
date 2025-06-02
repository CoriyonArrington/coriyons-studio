// src/components/common/hero-cta-button.tsx
// - Updated to ensure NextLink renders the sole <a> tag.
// - Removed `as="a"` from the custom Button component.
// - Removed `passHref` as it's often not needed when NextLink directly wraps content/styling components.
"use client";

import React from 'react';
import Button from '@/src/components/ui/button'; // Your custom Button
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
  ...buttonProps // Props for your custom Button
}) => {
  return (
    // NextLink itself will render the <a> tag.
    // The custom Button component is the styled content within the link.
    <NextLink href={href}>
      <Button
        size="lg"
        colorScheme="blue" // This prop will be passed to your custom Button
        {...buttonProps}
        // `as="a"` is REMOVED from your custom Button here
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