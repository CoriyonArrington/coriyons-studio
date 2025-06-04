// src/lib/schemas/feedback-form-schema.ts
import { z } from 'zod';

// Helper to preprocess empty strings, null, or undefined into a clean `undefined`
// so that Zod's `.optional()` can work as expected.
// Values that are not empty/null/undefined are passed through for further validation/coercion.
const preprocessOptionalField = (val: unknown) => {
  if (val === "" || val === null || val === undefined) {
    return undefined;
  }
  return val;
};

// Schema for optional ratings (1-5)
const optionalRatingSchema = z.preprocess(
  preprocessOptionalField, // Step 1: Handle empty/null/undefined
  z.coerce // Step 2: If a value remains, coerce it to a number
    .number({ invalid_type_error: "Rating must be a number." })
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5.")
    .optional() // Step 3: Now .optional() correctly applies to the (potentially undefined) coerced number
);

// Schema for optional email
const optionalEmailSchema = z.preprocess(
  preprocessOptionalField, // Step 1: Handle empty/null/undefined
  z.string() // Step 2: If a value remains, validate it as a string
    .email({ message: "Please provide a valid email or leave it empty." })
    .optional() // Step 3: .optional() applies
);

// Schema for optional feedback type
const optionalFeedbackTypeSchema = z.preprocess(
  preprocessOptionalField, // Step 1: Handle empty/null/undefined
  z.string() // Step 2: If a value remains, validate it as a string
    .max(50, "Feedback type too long.")
    .optional() // Step 3: .optional() applies
);

export const FeedbackFormSchema = z.object({
  clarity_rating: optionalRatingSchema,
  usefulness_rating: optionalRatingSchema,
  satisfaction_rating: optionalRatingSchema,
  
  feedback_type: optionalFeedbackTypeSchema,
  
  comments: z.string()
    .min(10, { message: "Comments must be at least 10 characters long." })
    .max(2000, { message: "Comments must be 2000 characters or less." }), // This one is required
  
  email: optionalEmailSchema,

  source_url: z.string().url({ message: "Invalid source URL." }).optional(), // Usually auto-filled by server action
});

// This schema will now consistently infer types like:
// clarity_rating?: number; (which is number | undefined)
// feedback_type?: string; (which is string | undefined)
// email?: string; (which is string | undefined)
export type FeedbackFormData = z.infer<typeof FeedbackFormSchema>;