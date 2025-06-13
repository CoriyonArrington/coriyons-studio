/*
 FINAL VERSION - Key Changes:
 - The <NextLink> no longer uses the `passHref` and `legacyBehavior` props.
 - The <Card> component's `as="a"` prop has been removed.
 - The `href` is now passed directly to the <NextLink>, which will render the
   underlying anchor tag itself, resolving the console error.
*/
'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  HStack,
  VStack,
  Tag as ChakraTag,
  Image,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export interface PostCardProps {
  href: string;
  title: string;
  description: string | null;
  imageUrl?: string | null;
  tags?: Array<{ id: string; name: string }>;
  tagColorScheme?: string;
  ctaText?: string;
}

export default function PostCard({
  href,
  title,
  description,
  imageUrl,
  tags,
  tagColorScheme = 'purple',
  ctaText = 'Learn More',
}: PostCardProps) {
  return (
    <Card as={NextLink} href={href} variant="interactive" h="full" display="flex" flexDirection="column">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            borderTopRadius="md"
            objectFit="cover"
            h="200px"
            w="full"
          />
        )}
        <CardHeader>
          <Heading size="md" as="h3" noOfLines={2}>
            {title}
          </Heading>
        </CardHeader>
        <CardBody flexGrow={1}>
          <VStack align="start" spacing={4}>
            <Text color="muted.foreground" noOfLines={3}>
              {description || 'Read more about this topic.'}
            </Text>
            {tags && tags.length > 0 && (
              <HStack spacing={2} wrap="wrap">
                {tags.map((tag) => (
                  <ChakraTag key={tag.id} size="sm" variant="solid" colorScheme={tagColorScheme}>
                    {tag.name}
                  </ChakraTag>
                ))}
              </HStack>
            )}
          </VStack>
        </CardBody>
        <CardFooter>
          <Button variant="outline" colorScheme="primary" size="sm">
            {ctaText} &rarr;
          </Button>
        </CardFooter>
    </Card>
  );
}