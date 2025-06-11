// src/lib/actions/feedback-actions.ts
'use server';

import {
  createClient as createSupabaseAdminClient,
} from '@supabase/supabase-js';
import { createClient } from '@/src/utils/supabase/server';
import {
  FeedbackFormSchema,
  type FeedbackFormData,
} from '@/src/lib/schemas/feedback-form-schema';
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

type FeedbackSubmissionInsert =
  Database['public']['Tables']['feedback_submissions']['Insert'];

export async function submitFeedbackForm(
  _prevState: SubmitFeedbackFormState | null,
  formData: FormData
): Promise<SubmitFeedbackFormState> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error(
      'Supabase URL or Service Role Key is missing from environment variables.'
    );
    return {
      success: false,
      message: 'Server configuration error. Please contact support.',
    };
  }

  const supabaseAdmin = createSupabaseAdminClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const supabaseUserClient = createClient();
  const {
    data: { user },
  } = await supabaseUserClient.auth.getUser();

  // 1. Extract and validate form data
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
    // 2. Await headers() so we get ReadonlyHeaders
    const headersList = await headers();

    const dataToInsert: FeedbackSubmissionInsert = {
      ...validatedData,
      source_url: headersList.get('referer') ?? 'Unknown source',
      ip_address:
        headersList.get('x-forwarded-for') ??
        headersList.get('remote-addr') ??
        undefined,
      user_agent: headersList.get('user-agent') ?? 'Unknown agent',
      user_id: user?.id ?? null,
    };

    // 3. Insert and select only `id`, typing the returned row via .single<>
    const response = await supabaseAdmin
      .from('feedback_submissions')
      .insert([dataToInsert])
      .select('id')
      .single<{ id: string }>();

    if (response.error) {
      console.error('Supabase error inserting feedback:', response.error);
      return {
        success: false,
        message: `Database error: ${response.error.message}`,
      };
    }

    // 4. Return success (response.data is non-null here)
    return {
      success: true,
      message: 'Thank you for your feedback!',
      submissionId: response.data.id,
    };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'An unknown server error occurred.';
    console.error('Unexpected error in submitFeedbackForm:', message);
    return {
      success: false,
      message: `A server error occurred: ${message}`,
    };
  }
}
