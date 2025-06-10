'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/src/utils/supabase/server';
import { FeedbackFormSchema, type FeedbackFormData } from '@/src/lib/schemas/feedback-form-schema';
import { headers } from 'next/headers';
import type { Database } from '@/src/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type SubmitFeedbackFormState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof FeedbackFormData, string[]>>;
  submissionId?: string;
};

type FeedbackSubmissionInsert = Database['public']['Tables']['feedback_submissions']['Insert'];

export async function submitFeedbackForm(
  _prevState: SubmitFeedbackFormState | null,
  formData: FormData
): Promise<SubmitFeedbackFormState> {

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL or Service Role Key is missing from environment variables.');
    return {
      success: false,
      message: 'Server configuration error. Please contact support.',
    };
  }

  const supabaseAdmin = createSupabaseAdminClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const rawFormData = {
    clarity_rating: formData.get('clarity_rating'),
    usefulness_rating: formData.get('usefulness_rating'),
    satisfaction_rating: formData.get('satisfaction_rating'),
    feedback_type: formData.get('feedback_type'),
    comments: formData.get('comments'),
    email: formData.get('email'),
  };

  const validationResult = FeedbackFormSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the fields below.',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;
  
  try {
    const headersList = await headers(); // Await the headers function
    const dataToInsert: FeedbackSubmissionInsert = {
      clarity_rating: validatedData.clarity_rating,
      usefulness_rating: validatedData.usefulness_rating,
      satisfaction_rating: validatedData.satisfaction_rating,
      comments: validatedData.comments,
      source_url: headersList.get('referer') || 'Unknown source',
      ip_address: headersList.get('x-forwarded-for') || headersList.get('remote-addr'),
      user_agent: headersList.get('user-agent') || 'Unknown agent',
      user_id: user?.id || null,
      feedback_type: validatedData.feedback_type || undefined,
      email: validatedData.email || undefined,
    };

    const { data: submissionData, error } = await supabaseAdmin
      .from('feedback_submissions')
      .insert([dataToInsert])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error inserting feedback submission:', error);
      return {
        success: false,
        message: `An error occurred: ${error.message}. Please try again.`,
      };
    }

    if (submissionData.id) {
      return {
        success: true,
        message: 'Thank you for your feedback!',
        submissionId: submissionData.id,
      };
    }

    return {
      success: false,
      message: 'An unexpected issue occurred after attempting submission.',
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error('Unexpected error in submitFeedbackForm:', e);
      return {
        success: false,
        message: `A server error occurred: ${e.message}`,
      };
    }
    return {
      success: false,
      message: 'An unknown server error occurred.',
    };
  }
}