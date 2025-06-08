/*
 FINAL VERSION - Key Changes:
 - Corrected the prop passed to <DynamicLucideIcon /> from `size` to `boxSize`.
 - `boxSize` is the correct Chakra UI prop for controlling the width and height of an icon,
   which resolves the TypeScript error.
*/
'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  HStack,
  Icon,
  LinkBox,
  LinkOverlay,
  IconProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import * as LucideIcons from 'lucide-react';

// A helper to safely render Lucide icons by name
const DynamicLucideIcon: React.FC<{ name: string | null | undefined } & IconProps> = ({ name, ...props }) => {
  if (!name) return null;
  const IconComponent = (LucideIcons as any)[name];
  if (IconComponent) {
    return <Icon as={IconComponent} {...props} />;
  }
  return null;
};

export interface FeatureCardProps {
  href: string;
  iconName: string | null | undefined;
  iconColor?: string;
  title: string;
  description: string | null;
}

export default function FeatureCard({
  href,
  iconName,
  iconColor = 'primary.500',
  title,
  description,
}: FeatureCardProps) {
  return (
    <LinkBox as={Card} variant="interactive" h="full">
      <CardHeader>
        <HStack spacing={3}>
          <DynamicLucideIcon name={iconName || undefined} boxSize={6} color={iconColor} />
          <Heading size="md" as="h3">
            <LinkOverlay as={NextLink} href={href}>
              {title}
            </LinkOverlay>
          </Heading>
        </HStack>
      </CardHeader>
      <CardBody>
        <Text color="muted.foreground" noOfLines={3}>
          {description}
        </Text>
      </CardBody>
    </LinkBox>
  );
}