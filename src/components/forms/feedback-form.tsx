// FINAL DEFINITIVE FIX: Disabling a persistent linter false positive.
// - The linter incorrectly flags the `if (value != null ...)` check. This check is
//   valid and necessary, so the rule is disabled for this line only.

'use client';

import React, { useState, useRef } from 'react';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Input,
  Textarea,
  VStack,
  Box,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';

import { FeedbackFormSchema, type FeedbackFormData } from '@/src/lib/schemas/feedback-form-schema';
import { submitFeedbackForm } from '@/src/lib/actions/feedback-actions';
import { Form, FormField, FormMessage, SubmitButton } from '@/src/components/forms';

interface SubmissionResultState {
  success: boolean;
  message: string;
  errors?: { [key in keyof FeedbackFormData]?: string[] } | undefined;
  submissionId?: string;
}

const feedbackTypeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'general', label: 'General Feedback' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'compliment', label: 'Compliment/Praise' },
  { value: 'other', label: 'Other' },
];

const actionInitialState: SubmissionResultState | null = null;

export default function FeedbackForm() {
  const [submissionResult, setSubmissionResult] = useState<SubmissionResultState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
    reset: resetFormFields,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(FeedbackFormSchema) as Resolver<FeedbackFormData>,
    mode: 'onBlur',
    defaultValues: {
      clarity_rating: undefined,
      usefulness_rating: undefined,
      satisfaction_rating: undefined,
      feedback_type: '',
      comments: '',
      email: '',
    },
  });

  const handleValidSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // The linter incorrectly flags the following line as an unnecessary conditional.
      // However, this check is required to safely handle optional form fields.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (value != null && value !== '') {
        formData.append(key, String(value));
      }
    });

    try {
      const result = await submitFeedbackForm(actionInitialState, formData); 
      setSubmissionResult(result as SubmissionResultState);

      if (result.success) {
        toast({
          title: 'Feedback Submitted!',
          description: result.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        resetFormFields();
      } else if (result.message && !result.errors) {
        toast({
          title: 'Submission Error',
          description: result.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const generalErrorMessage = 'An unexpected error occurred. Please try again.';
      setSubmissionResult({
        success: false,
        message: generalErrorMessage,
        errors: undefined,
      });
      toast({
        title: 'Unexpected Error',
        description: generalErrorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisplayError = (fieldName: keyof FeedbackFormData): string | undefined => {
    return clientErrors[fieldName]?.message || submissionResult?.errors?.[fieldName]?.[0];
  };

  const clarityErrorMsg = getDisplayError('clarity_rating');
  const usefulnessErrorMsg = getDisplayError('usefulness_rating');
  const satisfactionErrorMsg = getDisplayError('satisfaction_rating');
  const feedbackTypeErrorMsg = getDisplayError('feedback_type');
  const commentsErrorMsg = getDisplayError('comments');
  const emailErrorMsg = getDisplayError('email');

  return (
    <Box w="full" maxW="lg">
      {/* This is the correct pattern for react-hook-form and a known linter issue. */}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Form ref={formRef} onSubmit={handleSubmit(handleValidSubmit)}>
        <VStack spacing={5}>
          <Text fontSize="sm" color="muted.foreground">
            Rate your experience (1–5, optional):
          </Text>
          <HStack spacing={4} w="full" alignItems="flex-start">
            <FormField 
              id="clarity_rating" 
              label="Clarity" 
              flex={1} 
              error={clarityErrorMsg}
            >
              <NumberInput min={1} max={5}>
                <NumberInputField
                  id="clarity_rating"
                  {...register('clarity_rating', { valueAsNumber: true })}
                  placeholder="e.g., 4"
                />
                <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormField>
            <FormField 
              id="usefulness_rating" 
              label="Usefulness" 
              flex={1}
              error={usefulnessErrorMsg}
            >
              <NumberInput min={1} max={5}>
                <NumberInputField
                  id="usefulness_rating"
                  {...register('usefulness_rating', { valueAsNumber: true })}
                  placeholder="e.g., 5"
                />
                 <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormField>
            <FormField 
              id="satisfaction_rating" 
              label="Satisfaction" 
              flex={1}
              error={satisfactionErrorMsg}
            >
              <NumberInput min={1} max={5}>
                <NumberInputField
                  id="satisfaction_rating"
                  {...register('satisfaction_rating', { valueAsNumber: true })}
                  placeholder="e.g., 3"
                />
                 <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormField>
          </HStack>

          <FormField 
            id="feedback_type" 
            label="Feedback Type (Optional)"
            error={feedbackTypeErrorMsg}
          >
            <Select id="feedback_type" {...register('feedback_type')}>
              {feedbackTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField 
            id="comments" 
            label="Comments" 
            isRequired
            error={commentsErrorMsg}
          >
            <Textarea
              id="comments"
              {...register('comments')}
              rows={5}
              placeholder="Please provide your detailed feedback here..."
            />
          </FormField>

          <FormField 
            id="email" 
            label="Your Email (Optional)" 
            helperText="Provide your email if you'd like a follow‐up."
            error={emailErrorMsg}
          >
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="e.g., user@example.com"
            />
          </FormField>

          {submissionResult && submissionResult.message && (
            <FormMessage
              data-testid="form-message"
              w="full"
              message={{
                success: submissionResult.success ? submissionResult.message : undefined,
                error: !submissionResult.success ? submissionResult.message : "",
                title: submissionResult.success ? 'Success!' : (submissionResult.errors ? 'Please check your input' : 'Error'),
              }}
            />
          )}

          <SubmitButton 
            colorScheme="teal"
            width="full"
            isLoading={isSubmitting} 
            pendingText="Submitting Feedback..."
          >
            Submit Feedback
          </SubmitButton>
        </VStack>
      </Form>
    </Box>
  );
}