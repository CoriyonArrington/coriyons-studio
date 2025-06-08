/*
 FINAL VERSION - Key Changes:
 - Added a "Visual Key" to explain the color-coding for the box model visualization.
 - Refactored the "Gap Example" to visually represent the `gap` property by coloring the grid's background,
   which highlights the space between the items.
*/
'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Code,
  Heading,
  Text,
  useToken,
} from '@chakra-ui/react';

// A helper component to visualize the box model
const BoxModelVisualizer: React.FC<{
  label: string;
  p?: string | number;
  m?: string | number;
  mt?: string | number;
  mx?: string | number;
}> = ({ label, ...props }) => {
  const [marginColor, paddingColor, contentColor] = useToken('colors', [
    'orange.100',
    'green.100',
    'blue.100',
  ]);

  return (
    <Box
      bg={marginColor}
      w="fit-content"
      {...props}
    >
      <Box bg={paddingColor} p={props.p}>
        <Box bg={contentColor} p={3}>
          <Code fontSize="sm">{label}</Code>
        </Box>
      </Box>
    </Box>
  );
};

export default function SpacingLayoutShowcase() {
  const [marginColor, paddingColor, contentColor, gapColor] = useToken('colors', [
    'orange.100',
    'green.100',
    'blue.100',
    'orange.50'
  ]);

  return (
    <Box as="section" id="spacing" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Spacing & Layout
      </Heading>
      <Text mb={6}>
        Chakra UI&apos;s spacing scale is themeable. Examples use props like <Code>p</Code>,{' '}
        <Code>m</Code>, and <Code>gap</Code> which correspond to values in the theme.
      </Text>

      {/* Visual Key */}
      <HStack spacing={4} mb={8} bg="blackAlpha.50" _dark={{bg: "whiteAlpha.50"}} p={3} borderRadius="md">
        <Text fontWeight="bold" fontSize="sm">Key:</Text>
        <HStack spacing={2}><Box w={4} h={4} bg={marginColor} borderRadius="sm" borderWidth="1px" borderColor="orange.200" /><Text fontSize="xs">Margin</Text></HStack>
        <HStack spacing={2}><Box w={4} h={4} bg={paddingColor} borderRadius="sm" borderWidth="1px" borderColor="green.200" /><Text fontSize="xs">Padding</Text></HStack>
        <HStack spacing={2}><Box w={4} h={4} bg={contentColor} borderRadius="sm" borderWidth="1px" borderColor="blue.200" /><Text fontSize="xs">Content</Text></HStack>
        <HStack spacing={2}><Box w={4} h={4} bg={gapColor} borderRadius="sm" borderWidth="1px" borderColor="orange.200" /><Text fontSize="xs">Gap</Text></HStack>
      </HStack>

      <VStack alignItems="stretch" spacing={10}>
        {/* Padding Example */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Padding Example
          </Heading>
          <HStack spacing={4} flexWrap="wrap" alignItems="center">
            <BoxModelVisualizer label='p="1"' p="1" />
            <BoxModelVisualizer label='p="2"' p="2" />
            <BoxModelVisualizer label='p="4"' p="4" />
            <BoxModelVisualizer label='p="6"' p="6" />
            <BoxModelVisualizer label='p="8"' p="8" />
          </HStack>
        </Box>

        {/* Margin Example */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Margin Example
          </Heading>
          <VStack
            bg={gapColor}
            _dark={{ bg: 'orange.900' }}
            p="4"
            borderRadius="md"
            alignItems="flex-start"
            spacing={8}
          >
            <BoxModelVisualizer label="No margin" m="0" />
            <BoxModelVisualizer label='mt="4"' mt="4" />
            <BoxModelVisualizer label='mx="auto"' mx="auto" />
          </VStack>
        </Box>

        {/* Gap Example */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Gap Example (SimpleGrid)
          </Heading>
          <SimpleGrid
            columns={{ base: 1, sm: 3 }}
            bg={gapColor}
            _dark={{ bg: "orange.900" }}
            p="4"
            borderRadius="md"
            gap={6}
          >
            <Box bg="card.DEFAULT" color="card.foreground" p="4" borderRadius="sm" textAlign="center" boxShadow="sm">
              Item A
            </Box>
            <Box bg="card.DEFAULT" color="card.foreground" p="4" borderRadius="sm" textAlign="center" boxShadow="sm">
              Item B
            </Box>
            <Box bg="card.DEFAULT" color="card.foreground" p="4" borderRadius="sm" textAlign="center" boxShadow="sm">
              Item C
            </Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
}