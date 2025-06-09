import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Metadata } from 'next';

import {
  getFAQsGroupedByCategory,
  type FAQAnswerContent,
  type FAQAnswerBlock,
  type FAQCategoryWithItems,
  type FAQItem,
} from '@/src/lib/data/faqs';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about our services, process, and tools.',
};

/**
 * A type-safe component to render block-based content from a JSON field.
 */
function AnswerRenderer({ answer }: { answer: FAQAnswerContent | null }) {
  if (!answer?.blocks || answer.blocks.length === 0) {
    return <Text fontStyle="italic">An answer has not been provided yet.</Text>;
  }

  return (
    <VStack align="start" spacing={3}>
      {answer.blocks.map((block: FAQAnswerBlock) => {
        if (block.type === 'paragraph' && typeof block.data.text === 'string') {
          return <Text key={block.id || block.data.text.substring(0, 20)}>{block.data.text}</Text>;
        }
        return null;
      })}
    </VStack>
  );
}

export default async function FaqPage() {
  const categories: FAQCategoryWithItems[] = await getFAQsGroupedByCategory();

  return (
    <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
      <VStack spacing={{ base: 10, md: 14 }} align="stretch">
        <Box>
          <Heading as="h1" size="xl">
            Frequently Asked Questions
          </Heading>
          <Text mt={3} fontSize="lg" color="gray.600">
            Have a question? We&apos;re here to help. Find answers to common queries below.
          </Text>
        </Box>

        {categories.length > 0 ? (
          categories.map((category) => (
            <Box key={category.id} as="section" w="100%">
              <Heading as="h2" size="lg" mb={5}>
                {category.name}
              </Heading>
              <Accordion allowMultiple>
                {category.faqs.map((faq: FAQItem) => (
                  <AccordionItem key={faq.id}>
                    <h2>
                      <AccordionButton _hover={{ bg: 'gray.50' }}>
                        <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                          {faq.question}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <AnswerRenderer answer={faq.answer} />
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          ))
        ) : (
          <Text fontSize="lg" color="gray.500">
            No FAQs have been added yet. Please check back later.
          </Text>
        )}
      </VStack>
    </Container>
  );
}