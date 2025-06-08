/*
 FINAL VERSION - Key Changes:
 - Removed incorrect imports from the old typography folder.
 - Consolidated all component imports from '@chakra-ui/react'.
*/
"use client";

import React, { useState, FormEvent } from 'react';
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { VStack, Box, FormControl, FormLabel, Input, Textarea, Button, Heading, Text } from '@chakra-ui/react';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const previousPageLink: PrevNextNavLinkInfo | undefined = undefined;
  const nextPageLink: PrevNextNavLinkInfo | undefined = undefined;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Network error');
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <Section id="contact" py={{ base: 16, md: 24 }} textAlign="center">
        <VStack spacing={6} maxW="2xl" mx="auto">
          <Heading as="h1" size="3xl">
            Get in Touch
          </Heading>
          <Text>
            Have a question, project inquiry, or just want to say hello? Fill out the form below and I’ll get back to you as soon as I can.
          </Text>

          <Box as="form" onSubmit={handleSubmit} w="100%" maxW="container.sm" mt={8}>
            <FormControl id="name" mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </FormControl>

            <FormControl id="email" mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </FormControl>

            <FormControl id="message" mb={6} isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me what’s on your mind…"
                rows={6}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Sending…"
              width="full"
            >
              Send Message
            </Button>

            {success === true && (
              <Text mt={4} color="green.500">
                Thanks for reaching out! I’ll reply shortly.
              </Text>
            )}
            {success === false && (
              <Text mt={4} color="red.500">
                Oops—something went wrong. Please try again later.
              </Text>
            )}
          </Box>
        </VStack>
      </Section>

      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}