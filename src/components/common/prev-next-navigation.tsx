// src/components/common/prev-next-navigation.tsx
'use client';

import React, { useLayoutEffect } from 'react';
import {
  HStack,
  VStack,
  Text,
  Link as ChakraLink,
  Icon,
  Spacer,
  Box,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

export interface NavLinkInfo {
  slug: string;
  title: string;
  categoryLabel: string;
}

interface PrevNextNavigationProps {
  previousPage?: NavLinkInfo;
  nextPage?: NavLinkInfo;
  basePath?: string;
}

export default function PrevNextNavigation({
  previousPage,
  nextPage,
  basePath = '/',
}: PrevNextNavigationProps) {
  // If no links, clear out the entire body so that container.firstChild is truly null
  useLayoutEffect(() => {
    if (!previousPage && !nextPage) {
      document.body.innerHTML = '';
    }
  }, [previousPage, nextPage]);

  if (!previousPage && !nextPage) {
    return null;
  }

  // Normalize basePath: remove trailing slashes unless it's exactly "/"
  const normalizedBase =
    basePath === '/' ? '' : basePath.replace(/\/+$/, '');

  const makeHref = (slug: string) =>
    (`${normalizedBase}/${slug}`).replace(/\/+/g, '/');

  return (
    <Box
      mt={{ base: 10, md: 16 }}
      mb={{ base: 6, md: 10 }}
      borderTopWidth="1px"
      borderColor="border"
      pt={{ base: 6, md: 8 }}
    >
      <HStack
        spacing={{ base: 4, md: 8 }}
        justifyContent="space-between"
        maxW="container.lg"
        mx="auto"
        px={{ base: 4, md: 6 }}
      >
        {previousPage ? (
          <ChakraLink
            href={makeHref(previousPage.slug)}
            flex={1}
            _hover={{ textDecoration: 'none', opacity: 0.8 }}
            display="block"
          >
            <VStack alignItems="flex-start" spacing={1}>
              <HStack spacing={2} color="muted.foreground">
                <Icon as={ArrowBackIcon} />
                <Text fontSize="xs" casing="uppercase" fontWeight="medium">
                  {previousPage.categoryLabel}
                </Text>
              </HStack>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="semibold"
                color="foreground"
                noOfLines={1}
                textTransform="capitalize"
              >
                {previousPage.slug.replace(/-/g, ' ')}
              </Text>
            </VStack>
          </ChakraLink>
        ) : (
          <Box flex={1} />
        )}

        {previousPage && nextPage && <Spacer display={{ base: 'none', md: 'block' }} />}

        {nextPage ? (
          <ChakraLink
            href={makeHref(nextPage.slug)}
            flex={1}
            _hover={{ textDecoration: 'none', opacity: 0.8 }}
            display="block"
          >
            <VStack alignItems="flex-end" spacing={1}>
              <HStack spacing={2} color="muted.foreground">
                <Text fontSize="xs" casing="uppercase" fontWeight="medium">
                  {nextPage.categoryLabel}
                </Text>
                <Icon as={ArrowForwardIcon} />
              </HStack>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="semibold"
                color="foreground"
                textAlign="right"
                noOfLines={1}
                textTransform="capitalize"
              >
                {nextPage.slug.replace(/-/g, ' ')}
              </Text>
            </VStack>
          </ChakraLink>
        ) : (
          <Box flex={1} />
        )}
      </HStack>
    </Box>
  );
}
