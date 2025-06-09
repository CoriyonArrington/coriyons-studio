// ATTEMPT 1: Fixing a misused promise in an event handler.
// - Wrapped the async `handleSubmit` function in a synchronous arrow function
//   in the `onSubmit` prop to resolve the `no-misused-promises` error.

'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
  useToast,
  Heading,
  Text,
} from '@chakra-ui/react';
import { z } from 'zod';

import { submitContactForm } from '@/src/lib/actions/contact-actions';

const ContactFormSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email'),
  message: z
    .string()
    .nonempty('Message is required')
    .min(10, 'Message must be at least 10 characters long.'),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

interface ServerFieldErrors {
  name?: string[];
  email?: string[];
  message?: string[];
}

export default function ContactForm() {
  const toast = useToast();

  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    message: '',
  });
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof ContactFormValues, string>>
  >({});
  const [serverErrors, setServerErrors] = useState<ServerFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalMessage, setGeneralMessage] = useState<
    { type: 'success' | 'error'; text: string } | null
  >(null);

  useEffect(() => {
    setServerErrors({});
  }, [values.name, values.email, values.message]);

  const handleChange =
    (field: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setClientErrors((prev) => ({ ...prev, [field]: undefined }));
      setGeneralMessage(null);
    };

  const handleBlur = (field: keyof ContactFormValues) => () => {
    try {
      switch (field) {
        case 'name':
          ContactFormSchema.pick({ name: true }).parse({ name: values.name });
          setClientErrors((prev) => ({ ...prev, name: undefined }));
          break;
        case 'email':
          ContactFormSchema.pick({ email: true }).parse({
            email: values.email,
          });
          setClientErrors((prev) => ({ ...prev, email: undefined }));
          break;
        case 'message':
          ContactFormSchema.pick({ message: true }).parse({
            message: values.message,
          });
          setClientErrors((prev) => ({ ...prev, message: undefined }));
          break;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issue = err.errors[0];
        const key = issue.path[0] as keyof ContactFormValues;
        setClientErrors((prev) => ({ ...prev, [key]: issue.message }));
      }
    }
  };

  const validateAll = (): boolean => {
    try {
      ContactFormSchema.parse(values);
      setClientErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errs: Partial<Record<keyof ContactFormValues, string>> = {};
        err.errors.forEach((e) => {
          const key = e.path[0] as keyof ContactFormValues;
          if (!errs[key]) {
            errs[key] = e.message;
          }
        });
        setClientErrors(errs);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralMessage(null);
    setServerErrors({});

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('message', values.message);

      const result: {
        success: boolean;
        message?: string;
        errors?: ServerFieldErrors;
      } = await submitContactForm(null, formData);

      if (!result.success) {
        if (result.errors) {
          setServerErrors(result.errors);
          setGeneralMessage({
            type: 'error',
            text: result.message || 'Please correct the errors below.',
          });
        } else {
          setGeneralMessage({
            type: 'error',
            text: result.message || 'Submission failed, please try again.',
          });
        }
      } else {
        const successText = result.message || 'Your message has been sent!';
        setGeneralMessage({ type: 'success', text: successText });
        setValues({ name: '', email: '', message: '' });
        toast({
          title: 'Success!',
          description: successText,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch {
      setGeneralMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="section" maxW="lg" mx="auto">
      {/* FIX: Wrapped handleSubmit in a synchronous arrow function. */}
      <form onSubmit={(e) => { void handleSubmit(e); }} data-testid="contact-form" noValidate>
        <VStack spacing={4} align="stretch">
          <FormControl
            isInvalid={!!(clientErrors.name || serverErrors.name?.[0])}
            isRequired
          >
            <FormLabel htmlFor="name">Full Name *</FormLabel>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Jane Doe"
              value={values.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              aria-describedby={
                clientErrors.name || serverErrors.name?.[0]
                  ? 'error-name'
                  : undefined
              }
            />
            <FormErrorMessage data-testid="error-name" id="error-name" role="alert">
              {clientErrors.name || serverErrors.name?.[0]}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!(clientErrors.email || serverErrors.email?.[0])}
            isRequired
          >
            <FormLabel htmlFor="email">Email Address *</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., jane.doe@example.com"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              aria-describedby={
                clientErrors.email || serverErrors.email?.[0]
                  ? 'error-email'
                  : undefined
              }
            />
            <FormErrorMessage data-testid="error-email" id="error-email" role="alert">
              {clientErrors.email || serverErrors.email?.[0]}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!(clientErrors.message || serverErrors.message?.[0])}
            isRequired
          >
            <FormLabel htmlFor="message">Message *</FormLabel>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message here..."
              rows={5}
              value={values.message}
              onChange={handleChange('message')}
              onBlur={handleBlur('message')}
              aria-describedby={
                clientErrors.message || serverErrors.message?.[0]
                  ? 'error-message'
                  : undefined
              }
            />
            <FormErrorMessage data-testid="error-message" id="error-message" role="alert">
              {clientErrors.message || serverErrors.message?.[0]}
            </FormErrorMessage>
          </FormControl>

          {generalMessage && (
            <Box
              data-testid="form-message"
              role="status"
              aria-live="polite"
              textAlign="center"
              py={2}
            >
              <Heading
                as="h4"
                size="md"
                color={
                  generalMessage.type === 'error' ? 'red.500' : 'green.500'
                }
              >
                {generalMessage.type === 'error'
                  ? Object.keys(serverErrors).length > 0
                    ? 'Validation Error'
                    : 'Submission Error'
                  : 'Success!'}
              </Heading>
              <Text mt={1}>{generalMessage.text}</Text>
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Sending..."
            alignSelf="flex-start"
          >
            Send Message
          </Button>
        </VStack>
      </form>
    </Box>
  );
}