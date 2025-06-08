/*
 FINAL VERSION - Key Changes:
 - The "Toaster (Toast Utility)" showcase has been restored and expanded to include buttons
   that trigger all the primary toast variants, as originally intended.
 - A <Wrap> component is used to ensure the buttons display nicely on all screen sizes.
*/
'use client';

import React, { useState } from 'react';
import {
  Heading,
  Box,
  Text,
  useDisclosure,
  VStack,
  Input,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Wrap, // Added Wrap for button layout
} from '@chakra-ui/react';

// Import local custom components
import SiteHeader from '@/src/components/common/site-header';
import SiteFooter from '@/src/components/common/site-footer';
import { ThemeSwitcher } from '@/src/components/navigation/theme-switcher';
import { Form, FormField, FormMessage, SubmitButton } from '@/src/components/forms';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import PostCard from '@/src/components/common/post-card';
import FeatureCard from '../common/featured-card';
import { toaster } from '@/src/components/ui/toaster';
import type { CategorizedFooterPages } from '@/src/lib/data/pages';
import HeaderAuth from '@/src/components/navigation/header-auth';

// Mock data for components that require props
const mockFooterPages: CategorizedFooterPages = {
  MAIN: [{ title: 'Home', href: '#' }, { title: 'About', href: '#' }],
  RESOURCES: [{ title: 'Blog', href: '#' }],
  SUPPORT: [{ title: 'Contact', href: '#' }],
  LEGAL: [{ title: 'Privacy', href: '#' }],
};

export default function CustomProjectComponentsShowcase() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="section" id="custom-components" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Custom Project Components
      </Heading>

      <VStack alignItems="stretch" spacing={10}>
        
        <Box id="custom-site-header">
          <Heading as="h3" size="lg" mb={2}>SiteHeader</Heading>
          <Box borderWidth="1px" borderRadius="lg" p={2}>
            <SiteHeader user={{ id: '123', email: 'hey.coriyonarrington@gmail.com' } as any} />
          </Box>
        </Box>

        <Box id="custom-form-components">
          <Heading as="h3" size="lg" mb={4}>Form Components</Heading>
          <VStack spacing={8} p={6} borderWidth="1px" borderRadius="lg" alignItems="start" w="full">
            
            <Box w="full" maxW="md">
              <Heading as="h4" size="md" mb={4}>Example Form</Heading>
              <Form onSubmit={(e) => e.preventDefault()}>
                <VStack spacing={4}>
                  <FormField id="showcase-name" label="Your Name">
                    <Input placeholder="Jane Doe" />
                  </FormField>
                  <FormField 
                    id="showcase-email" 
                    label="Email Address" 
                    error="This is an example error message."
                    helperText="This helper text is hidden when an error is present."
                  >
                    <Input placeholder="you@example.com" />
                  </FormField>
                  <HStack>
                    <SubmitButton colorScheme="primary">Submit</SubmitButton>
                    <SubmitButton colorScheme="primary" isLoading={true} pendingText="Submitting...">Loading State</SubmitButton>
                  </HStack>
                </VStack>
              </Form>
            </Box>

            <Box w="full" maxW="md">
              <Heading as="h4" size="md" mb={2}>FormMessage States</Heading>
              <VStack spacing={3} mt={4}>
                <FormMessage message={{ success: "Your profile was updated successfully.", title: "Success!" }} />
                <FormMessage message={{ error: "The email address is already in use.", title: "Error!" }} />
              </VStack>
            </Box>

          </VStack>
        </Box>
        
        <Box id="custom-cta-button">
            <Heading as="h3" size="lg" mb={4}>HeroCtaButton</Heading>
            <VStack p={6} borderWidth="1px" borderRadius="lg" alignItems="start">
              <HeroCtaButton href="#">Get Free Consultation</HeroCtaButton>
            </VStack>
        </Box>

        <Box id="custom-card-components">
            <Heading as="h3" size="lg" mb={4}>Card Components</Heading>
            <VStack spacing={6} p={6} borderWidth="1px" borderRadius="lg" alignItems="start">
                <Box>
                    <Heading as="h4" size="md" mb={2}>Unified PostCard</Heading>
                    <Text fontSize="sm" color="muted.foreground" mb={2}>Used for services, projects, and blog posts.</Text>
                    <Box maxW="sm">
                        <PostCard
                            href="#"
                            title="Example Card Title"
                            description="This is an example description for the unified card component, used for detailed previews."
                            tags={[{id: '1', name: 'UX Design'}, {id: '2', name: 'Strategy'}]}
                            ctaText="Learn More"
                            imageUrl="https://images.unsplash.com/photo-1555066931-4365d1469c9b?auto=format&fit=crop&w=1770&q=80"
                        />
                    </Box>
                </Box>
                <Box mt={6}>
                    <Heading as="h4" size="md" mb={2}>FeatureCard</Heading>
                    <Text fontSize="sm" color="muted.foreground" mb={2}>A simpler card for highlighting features, problems, or solutions.</Text>
                     <Box maxW="sm">
                        <FeatureCard
                            href="#"
                            title="Example Feature Title"
                            description="A short and punchy description of the feature or concept being highlighted."
                            iconName="CheckSquare"
                        />
                    </Box>
                </Box>
            </VStack>
        </Box>

        <Box id="custom-navigation-components">
           <Heading as="h3" size="lg" mb={4}>Navigation & Auth</Heading>
           <VStack spacing={6} p={6} borderWidth="1px" borderRadius="lg" alignItems="start">
                <Box>
                    <Heading as="h4" size="md" mb={2}>HeaderAuth</Heading>
                    <Text mb={1} fontSize="sm">Logged Out State:</Text>
                    <HeaderAuth user={null} />
                    <Text mt={4} mb={1} fontSize="sm">Logged In State:</Text>
                    <HeaderAuth user={{ id: '123', email: 'hey.coriyonarrington@gmail.com' } as any} />
                </Box>
                 <Box>
                    <Heading as="h4" size="md" mb={2}>ThemeSwitcher</Heading>
                    <ThemeSwitcher />
                </Box>
           </VStack>
        </Box>

        <Box id="custom-utility-components">
            <Heading as="h3" size="lg" mb={4}>Utility Components</Heading>
            <VStack spacing={6} p={6} borderWidth="1px" borderRadius="lg" alignItems="start">
                <Box id="custom-toaster">
                    <Heading as="h4" size="md" mb={2}>Toaster (Toast Utility)</Heading>
                    <Wrap spacing={4}>
                        <Button onClick={() => toaster({ title: 'Info', description: 'This is an informational message.', status: 'info' })}>
                            Show Info Toast
                        </Button>
                        <Button colorScheme='green' onClick={() => toaster({ title: 'Success!', description: 'Your action was completed successfully.', status: 'success' })}>
                            Show Success Toast
                        </Button>
                        <Button colorScheme='red' onClick={() => toaster({ title: 'Error', description: 'Something went wrong, please try again.', status: 'error' })}>
                            Show Error Toast
                        </Button>
                        <Button colorScheme='orange' onClick={() => toaster({ title: 'Warning', description: 'Please be aware of this warning.', status: 'warning' })}>
                            Show Warning Toast
                        </Button>
                        <Button colorScheme='gray' onClick={() => toaster({ title: 'Loading...', description: 'Processing your request.', status: 'loading' })}>
                            Show Loading Toast
                        </Button>
                    </Wrap>
                </Box>
            </VStack>
        </Box>

        <Box id="custom-site-footer">
          <Heading as="h3" size="lg" mb={2}>SiteFooter</Heading>
          <Box borderWidth="1px" borderRadius="lg" bg="muted.DEFAULT" p={8}>
            <SiteFooter footerPages={mockFooterPages} />
          </Box>
        </Box>

      </VStack>
    </Box>
  );
}