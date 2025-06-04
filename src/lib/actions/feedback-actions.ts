// src/lib/actions/feedback-actions.ts
'use server';

import { createClient as createSupabaseAdminClient, SupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerComponentClient } from '@/src/utils/supabase/server';
import { FeedbackFormSchema, type FeedbackFormData } from '@/src/lib/schemas/feedback-form-schema';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface FeedbackSubmission {
  clarity_rating: number;
  usefulness_rating: number;
  satisfaction_rating: number;
  feedback_type?: string;
  comments: string;
  email?: string;
  source_url: string;
  ip_address: string | null;
  user_agent: string;
  user_id: string | null;
}

interface SubmitFeedbackFormState {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof FeedbackFormData, string[]>>;
  submissionId?: string;
}

export async function submitFeedbackForm(
  _prevState: SubmitFeedbackFormState | null,
  formData: FormData
): Promise<SubmitFeedbackFormState> {
  const headersList = headers();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL or Service Role Key is missing from environment variables.');
    return {
      success: false,
      message: 'Server configuration error. Please contact support.',
    };
  }

  const supabaseAdmin: SupabaseClient = createSupabaseAdminClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const supabaseUserClient = await createServerComponentClient();
  const {
    data: { user },
  } = await supabaseUserClient.auth.getUser();

  const rawFormData = {
    clarity_rating: Number(formData.get('clarity_rating')),
    usefulness_rating: Number(formData.get('usefulness_rating')),
    satisfaction_rating: Number(formData.get('satisfaction_rating')),
    feedback_type: (formData.get('feedback_type') as string) || undefined,
    comments: (formData.get('comments') as string) || '',
    email: (formData.get('email') as string) || undefined,
  };

  const validationResult = FeedbackFormSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    console.log('Validation errors:', fieldErrors);
    return {
      success: false,
      message: 'Invalid form data. Please check the fields below.',
      errors: fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  const dataToInsert: Partial<FeedbackSubmission> = {
    clarity_rating: validatedData.clarity_rating,
    usefulness_rating: validatedData.usefulness_rating,
    satisfaction_rating: validatedData.satisfaction_rating,
    comments: validatedData.comments,
    source_url: headersList.get('referer') || 'Unknown source',
    ip_address: headersList.get('x-forwarded-for') || headersList.get('remote-addr'),
    user_agent: headersList.get('user-agent') || 'Unknown agent',
    user_id: user?.id || null,
    ...(validatedData.feedback_type ? { feedback_type: validatedData.feedback_type } : {}),
    ...(validatedData.email ? { email: validatedData.email } : {}),
  };

  try {
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

    if (submissionData?.id) {
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
  } catch (e: unknown) {
    console.error('Unexpected error in submitFeedbackForm:', e);
    return {
      success: false,
      message: 'A server error occurred. Please try again later.',
    };
  }
}
