// src/components/admin/custom-project-components-showcase.tsx

import React, { useState } from 'react';
import SiteHeader from '@/src/components/common/site-header';
import SiteFooter from '@/src/components/common/site-footer';
import { ThemeSwitcher } from '@/src/components/navigation/theme-switcher';
import NextLink from 'next/link';
import {
  Heading,
  Button,
  Input,
  Box,
  Text,
  Link,
} from '@chakra-ui/react';
import { useFormStatus } from 'react-dom';

const CustomProjectComponentsShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pending } = useFormStatus();

  return (
    <Box p={4}>
      {/* Main Heading */}
      <Heading as="h2" size="lg" mb={6}>
        Custom Project Components
      </Heading>

      {/* SiteHeader Showcase */}
      <Heading as="h3" size="md" mb={2}>
        SiteHeader (Logged In - Mocked):
      </Heading>
      <Text mb={4}>The SiteHeader is rendered below:</Text>
      <SiteHeader user={null as any} />

      {/* SiteFooter Showcase */}
      <Heading as="h3" size="md" mb={2}>
        SiteFooter
      </Heading>
      <Text mb={4}>The SiteFooter is rendered below:</Text>
      <SiteFooter />

      {/* Form (Custom Wrapper) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        Form (Custom Wrapper)
      </Heading>
      <Button mb={6}>Submit via Custom Form</Button>

      {/* FormField (Custom Wrapper) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        FormField (Custom Wrapper)
      </Heading>
      <Box mb={6}>
        <label>
          Email Address (via FormField)
          <Input aria-label="Email Address (via FormField)" mt={1} />
        </label>
      </Box>

      {/* FormMessage Showcase */}
      <Heading as="h3" size="md" mb={2}>
        FormMessage
      </Heading>
      <Text mb={6}>This is a detailed error message.</Text>

      {/* SubmitButton Showcase */}
      <Heading as="h3" size="md" mb={2}>
        SubmitButton
      </Heading>
      <Button mb={6}>Default Submit</Button>

      {/* HeaderAuth (AuthButton) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        HeaderAuth (AuthButton)
      </Heading>
      <Text mb={6}>Logged In State (Mocked): {pending ? 'Pending' : 'Not Pending'}</Text>

      {/* ThemeSwitcher Showcase */}
      <Heading as="h3" size="md" mb={2}>
        ThemeSwitcher
      </Heading>
      <Box mb={6}>
        <ThemeSwitcher />
      </Box>

      {/* Button (Custom UI Primitive) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        Button (Custom UI Primitive)
      </Heading>
      <Button mb={6}>Primary Action</Button>

      {/* HeroCtaButton Showcase */}
      <Heading as="h3" size="md" mb={2}>
        HeroCtaButton
      </Heading>
      <Link as={NextLink} href="/contact" mb={6}>
        Get Free Consultation
      </Link>

      {/* Card (Custom UI Primitive) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        Card (Custom UI Primitive)
      </Heading>
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        mb={6}
        maxW="sm"
      >
        <Heading as="h4" size="sm" mb={2}>
          Card Title (Outline)
        </Heading>
        <Text>Card content goes here.</Text>
      </Box>

      {/* Input (Custom UI Primitive) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        Input (Custom UI Primitive)
      </Heading>
      <Input
        aria-label="Email (Custom Input)"
        placeholder="Enter your email"
        mb={6}
      />

      {/* Modal (Custom UI Primitive) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        Modal (Custom UI Primitive)
      </Heading>
      <Button
        onClick={() => setIsModalOpen(true)}
        mb={6}
      >
        Open Custom Modal
      </Button>
      {isModalOpen && (
        <Box
          role="dialog"
          aria-label="Custom Modal Title"
          borderWidth="1px"
          borderRadius="md"
          p={6}
          bg="gray.50" // Changed from "white"
          _dark={{ bg: "gray.700" }} // Added for dark mode
          maxW="md"
          mx="auto"
        >
          <Heading as="h4" size="md" mb={4}>
            Custom Modal Title
          </Heading>
          <Text mb={4}>This is the content of the custom modal.</Text>
          <Button onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Box>
      )}

      {/* Spinner (Custom UI Primitive) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        Spinner (Custom UI Primitive)
      </Heading>
      <Box role="status" aria-label="Loading..." mb={6}>
        {/* Here you could place an actual Spinner component; for showcase purposes, we use a box with role=status */}
        <Text>Loading...</Text>
      </Box>

      {/* Toaster (Toast Utility) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        Toaster (Toast Utility)
      </Heading>
      <Button mb={6}>Show Info Toast</Button>

      {/* ChakraNextThemeSyncer Showcase */}
      <Heading as="h3" size="md" mb={2}>
        ChakraNextThemeSyncer
      </Heading>
      <Text mb={6}>
        This component synchronizes Chakra UI’s theme with Next.js
      </Text>

      {/* ThemeProvider (App Provider) Showcase */}
      <Heading as="h3" size="md" mb={2}>
        ThemeProvider (App Provider)
      </Heading>
      <Text>
        This component wraps the application to provide Chakra UI and Next-Themes context
      </Text>
    </Box>
  );
};

export default CustomProjectComponentsShowcase;