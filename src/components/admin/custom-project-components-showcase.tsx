// src/components/admin/custom-project-components-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Divider,
  useDisclosure, 
  Code,
  useColorModeValue, 
  Button as ChakraButton, 
  Input as ChakraInput,   
} from '@chakra-ui/react';
import type { User } from "@supabase/supabase-js";

// Typography
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

// Common Components to showcase
import SiteFooter from '@/src/components/common/site-footer';
import SiteHeader from '@/src/components/common/site-header';
import HeroCtaButton from '@/src/components/common/hero-cta-button';

// Forms Components to showcase
import { FormMessage, type Message as FormMessageType } from '@/src/components/forms/form-message';
import { SubmitButton } from '@/src/components/forms/submit-button';
import { default as CustomForm } from '@/src/components/forms/form';
import { default as CustomFormField } from '@/src/components/forms/form-field';

// Navigation Components to showcase
import AuthButton from '@/src/components/navigation/header-auth';
import { ThemeSwitcher } from '@/src/components/navigation/theme-switcher';

// UI Primitives & Utilities to showcase
import Button from '@/src/components/ui/button';
import { UICard, UICardHeader, UICardBody, UICardFooter, UICardHeading, UICardText } from '@/src/components/ui/card';
import Input from '@/src/components/ui/input';
import {
  UIModal,
  UIModalOverlay,
  UIModalContent,
  UIModalHeader,
  UIModalBody,
  UIModalFooter,
  UIModalCloseButton
} from '@/src/components/ui/modal';
import Spinner from '@/src/components/ui/spinner';
import { ChakraNextThemeSyncer } from '@/src/components/ui/chakra-next-theme-syncer';
import { toaster } from '@/src/components/ui/toaster';

export default function CustomProjectComponentsShowcase() {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const mockUser: User = {
    id: 'mock-user-id-123',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Jane Doe', email: 'jane@example.com' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'jane@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    identities: [],
  };
  const noUser: User | null = null;

  const errorFormMessage: FormMessageType = { error: "This is a detailed error message.", title: "Validation Error" };
  const successFormMessage: FormMessageType = { success: "Your profile has been updated successfully!", title: "Update Complete" };
  const infoFormMessage: FormMessageType = { message: "Please note: System maintenance scheduled for midnight.", title: "System Notification" };
  const errorWithoutTitle: FormMessageType = { error: "An unexpected error occurred." };
  
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box as="section" id="custom-components" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>Custom Project Components</CustomHeading>
      <VStack alignItems="stretch" spacing={10} divider={<Divider />}>
        
        <Box id="custom-layout">
          <CustomHeading as="h3" size="lg" mb={4}>Layout</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/common/layout.tsx</Code></CustomText>
          <Box borderWidth="1px" borderRadius="lg" p={4} borderColor="border">
            <CustomText>The <Code>Layout</Code> component can wrap page content. If used in <Code>app/layout.tsx</Code>, it would apply globally. This design system page might be an example if Layout is used higher up.</CustomText>
          </Box>
        </Box>

        <Box id="custom-site-header">
          <CustomHeading as="h3" size="lg" mb={4}>SiteHeader</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/common/site-header.tsx</Code></CustomText>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="border">
            <CustomText mb={2} fontWeight="medium" pl={2} pt={2}>SiteHeader (Logged In - Mocked):</CustomText>
            <SiteHeader user={mockUser} navAriaLabel="Logged In Example Navigation" /> {/* Added navAriaLabel */}
            <Divider my={4} />
            <CustomText mb={2} fontWeight="medium" pl={2} pt={2}>SiteHeader (Logged Out - Mocked):</CustomText>
            <SiteHeader user={noUser} navAriaLabel="Logged Out Example Navigation" /> {/* Added navAriaLabel */}
          </Box>
        </Box>

        <Box id="custom-site-footer">
          <CustomHeading as="h3" size="lg" mb={4}>SiteFooter</CustomHeading>
           <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/common/site-footer.tsx</Code></CustomText>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="border">
            <SiteFooter />
          </Box>
        </Box>
        
        <Box id="custom-form">
          <CustomHeading as="h3" size="lg" mb={4}>Form (Custom Wrapper)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/form.tsx</Code></CustomText>
          <CustomForm p={4} borderWidth="1px" borderRadius="lg" borderColor="border" onSubmit={(e) => { e.preventDefault(); toaster({title: 'Custom Form Submitted!', status: 'success'}); }}>
            <CustomText mb={2}>This content is inside our custom Form wrapper.</CustomText>
            <ChakraButton mt={2} type="submit">Submit via Custom Form</ChakraButton>
          </CustomForm>
        </Box>

        <Box id="custom-form-field">
          <CustomHeading as="h3" size="lg" mb={4}>FormField (Custom Wrapper)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/form-field.tsx</Code></CustomText>
          <VStack spacing={4} alignItems="stretch" p={4} borderWidth="1px" borderRadius="lg" borderColor="border">
            <CustomFormField label="Email Address (via FormField)" id="ds-ff-email-showcase" helperText="Helper text for email.">
              <ChakraInput type="email" placeholder="your@email.com" id="ds-ff-email-showcase"/>
            </CustomFormField>
            <CustomFormField label="Name (with error via FormField)" id="ds-ff-name-showcase" error="Name is required." isRequired>
              <ChakraInput type="text" placeholder="Your Name" id="ds-ff-name-showcase" />
            </CustomFormField>
          </VStack>
        </Box>
        
        <Box id="custom-form-message">
          <CustomHeading as="h3" size="lg" mb={4}>FormMessage</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/form-message.tsx</Code></CustomText>
          <VStack spacing={3} alignItems="stretch">
            <FormMessage message={errorFormMessage} />
            <FormMessage message={successFormMessage} mt={2} />
            <FormMessage message={infoFormMessage} mt={2} />
            <FormMessage message={errorWithoutTitle} mt={2}/>
          </VStack>
        </Box>

        <Box id="custom-submit-button">
          <CustomHeading as="h3" size="lg" mb={4}>SubmitButton</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/submit-button.tsx</Code></CustomText>
          <CustomForm onSubmit={(e) => e.preventDefault()}>
            <HStack spacing={4} flexWrap="wrap">
              <SubmitButton>Default Submit</SubmitButton>
              <SubmitButton isLoading>Loading Submit</SubmitButton>
              <SubmitButton isDisabled>Disabled Submit</SubmitButton>
            </HStack>
            <HStack spacing={4} mt={4} flexWrap="wrap">
              <SubmitButton colorScheme="green">Styled Submit</SubmitButton>
              <SubmitButton variant="outline">Outline Submit</SubmitButton>
            </HStack>
          </CustomForm>
        </Box>

        <Box id="custom-header-auth">
          <CustomHeading as="h3" size="lg" mb={4}>HeaderAuth (AuthButton)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/navigation/header-auth.tsx</Code></CustomText>
          <VStack spacing={4} alignItems="flex-start">
            <Box p={4} borderWidth="1px" borderRadius="md" w="full" borderColor="border">
              <CustomText mb={2} fontWeight="medium">Logged In State (Mocked):</CustomText>
              <AuthButton user={mockUser} />
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md" w="full" borderColor="border">
              <CustomText mb={2} fontWeight="medium">Logged Out State (Mocked):</CustomText>
              <AuthButton user={noUser} />
            </Box>
          </VStack>
        </Box>
        
        <Box id="custom-theme-switcher">
          <CustomHeading as="h3" size="lg" mb={4}>ThemeSwitcher</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/navigation/theme-switcher.tsx</Code></CustomText>
          <ThemeSwitcher />
        </Box>

        <Box id="custom-button-primitive">
          <CustomHeading as="h3" size="lg" mb={4}>Button (Custom UI Primitive)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/button.tsx</Code></CustomText>
          <VStack alignItems="flex-start" spacing={3}>
            <HStack spacing={3} flexWrap="wrap">
              <Button colorScheme="blue">Primary Action</Button>
              <Button variant="outline">Secondary Action</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="link">Link Action</Button>
            </HStack>
            <HStack spacing={3} flexWrap="wrap">
              <Button colorScheme="green" size="sm">Small Green</Button>
              <Button colorScheme="red" size="md">Medium Red</Button>
              <Button colorScheme="purple" size="lg">Large Purple</Button>
            </HStack>
            <HStack spacing={3} flexWrap="wrap">
              <Button isLoading loadingText="Saving...">Saving</Button>
              <Button isDisabled>Disabled Button</Button>
            </HStack>
          </VStack>
        </Box>
        
        <Box id="hero-cta-button-component-showcase">
          <CustomHeading as="h3" size="lg" mb={4}>HeroCtaButton</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/common/hero-cta-button.tsx</Code></CustomText>
          <VStack spacing={3} alignItems="flex-start">
            <Box>
              <CustomText mb={1} fontWeight="medium">Default (Icon visible, size lg, blue scheme):</CustomText>
              <HeroCtaButton href="/contact">Get Free Consultation</HeroCtaButton>
            </Box>
            <Box>
              <CustomText mb={1} fontWeight="medium">No Icon:</CustomText>
              <HeroCtaButton href="/features" showIcon={false}>Explore Features</HeroCtaButton>
            </Box>
            <Box>
              <CustomText mb={1} fontWeight="medium">Different ColorScheme & Size (e.g., green, md):</CustomText>
              <HeroCtaButton href="/pricing" colorScheme="green" size="md">View Pricing</HeroCtaButton>
            </Box>
             <Box>
              <CustomText mb={1} fontWeight="medium">Outline Variant (from base Button):</CustomText>
              <HeroCtaButton href="/docs" variant="outline">Read Docs</HeroCtaButton>
            </Box>
          </VStack>
        </Box>

        <Box id="custom-card-primitive">
          <CustomHeading as="h3" size="lg" mb={4}>Card (Custom UI Primitive)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/card.tsx</Code></CustomText>
          <HStack spacing={4} alignItems="flex-start" flexWrap="wrap">
            <UICard maxW="sm" variant="outline">
              <UICardHeader><UICardHeading size="md" as="h4">Card Title (Outline)</UICardHeading></UICardHeader>
              <UICardBody>
                <UICardText>This is the body of the card. It can contain various pieces of information or other components.</UICardText>
              </UICardBody>
              <UICardFooter>
                <Button colorScheme="blue">Action Button</Button>
              </UICardFooter>
            </UICard>
            <UICard maxW="sm" variant="elevated" bg={cardBg}>
              <UICardHeader><UICardHeading size="md" as="h4">Card Title (Elevated)</UICardHeading></UICardHeader>
              <UICardBody>
                <UICardText>Another card example with an elevated style, good for standing out on colored backgrounds.</UICardText>
              </UICardBody>
              <UICardFooter>
                <Button variant="ghost">Learn More</Button>
              </UICardFooter>
            </UICard>
          </HStack>
        </Box>

        <Box id="custom-input-primitive">
          <CustomHeading as="h3" size="lg" mb={4}>Input (Custom UI Primitive)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/input.tsx</Code></CustomText>
          <VStack maxW="md" spacing={4} alignItems="stretch">
            <CustomFormField label="Email (Custom Input)" id="ds-c-email-custom-showcase" helperText="Uses the custom Input primitive.">
              <Input type="email" placeholder="you@example.com" id="ds-c-email-custom-showcase" />
            </CustomFormField>
            <CustomFormField label="Search (Custom Input Filled)" id="ds-c-search-custom-showcase">
              <Input placeholder="Search..." variant="filled" id="ds-c-search-custom-showcase" />
            </CustomFormField>
            <CustomFormField label="Disabled Custom Input" id="ds-c-disabled-custom-showcase">
              <Input isDisabled placeholder="Cannot type here" id="ds-c-disabled-custom-showcase"/>
            </CustomFormField>
             <CustomFormField label="Invalid Custom Input" id="ds-c-invalid-custom-showcase" error="This custom input is invalid.">
              <Input isInvalid defaultValue="Wrong value" id="ds-c-invalid-custom-showcase"/>
            </CustomFormField>
          </VStack>
        </Box>

        <Box id="custom-modal-primitive">
          <CustomHeading as="h3" size="lg" mb={4}>Modal (Custom UI Primitive)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/modal.tsx</Code></CustomText>
          <Button onClick={onModalOpen}>Open Custom Modal</Button>
          <UIModal isOpen={isModalOpen} onClose={onModalClose} isCentered>
            <UIModalOverlay />
            <UIModalContent>
              <UIModalHeader>Custom Modal Title</UIModalHeader>
              <UIModalCloseButton />
              <UIModalBody>
                <CustomText mb={2}>This is the body content of our custom UI Modal component.</CustomText>
                <CustomText>It&apos;s built using Chakra UI&apos;s modal components as a base.</CustomText>
              </UIModalBody>
              <UIModalFooter>
                <Button variant="ghost" onClick={onModalClose}>Cancel</Button>
                <Button colorScheme="teal" ml={3} onClick={onModalClose}>
                  Confirm Action
                </Button>
              </UIModalFooter>
            </UIModalContent>
          </UIModal>
        </Box>

        <Box id="custom-spinner-primitive">
          <CustomHeading as="h3" size="lg" mb={4}>Spinner (Custom UI Primitive)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/spinner.tsx</Code></CustomText>
          <HStack spacing={6} alignItems="center" flexWrap="wrap">
            <Box textAlign="center">
              <CustomText mb={1} fontSize="sm">Default:</CustomText>
              <Spinner />
            </Box>
            <Box textAlign="center">
              <CustomText mb={1} fontSize="sm">Large Red:</CustomText>
              <Spinner size="lg" color="red.500" thickness="4px" label="Loading data..." />
            </Box>
            <Box textAlign="center">
              <CustomText mb={1} fontSize="sm">XL Green (empty label):</CustomText>
              <Spinner size="xl" color="green.500" speed="0.8s" emptyColor="gray.200" label=""/>
            </Box>
          </HStack>
        </Box>
        
        <Box id="custom-theme-syncer">
          <CustomHeading as="h3" size="lg" mb={4}>ChakraNextThemeSyncer</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/chakra-next-theme-syncer.tsx</Code></CustomText>
          <CustomText>This component synchronizes Chakra UI&apos;s theme with Next.js. No direct visual output expected here. It&apos;s usually placed in a global provider.</CustomText>
          <ChakraNextThemeSyncer />
        </Box>

        <Box id="custom-toaster">
          <CustomHeading as="h3" size="lg" mb={4}>Toaster (Toast Utility)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/toaster.tsx</Code></CustomText>
          <HStack spacing={3} flexWrap="wrap">
            <ChakraButton onClick={() => toaster({ title: 'Info Toast', description: 'This is from the design system page!', status: 'info' })}>
              Show Info Toast
            </ChakraButton>
            <ChakraButton colorScheme="green" onClick={() => toaster({ title: 'Success!', description: 'Item saved.', status: 'success', duration: 3000 })}>
              Show Success Toast
            </ChakraButton>
            <ChakraButton colorScheme="red" onClick={() => toaster({ title: 'Error!', description: 'Could not connect.', status: 'error', isClosable: true })}>
              Show Error Toast
            </ChakraButton>
          </HStack>
        </Box>

        <Box id="custom-theme-provider">
          <CustomHeading as="h3" size="lg" mb={4}>ThemeProvider (App Provider)</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/theme-provider.tsx</Code></CustomText>
          <CustomText>This component wraps the application to provide Chakra UI and Next-Themes context. It&apos;s typically used in your main <Code>layout.tsx</Code> or <Code>app.tsx</Code>. No direct visual output here.</CustomText>
        </Box>

      </VStack>
    </Box>
  );
}