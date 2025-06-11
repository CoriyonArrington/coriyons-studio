'use server';

import { createClient } from '@supabase/supabase-js';
import { ContactFormSchema, type ContactFormData } from '@/src/lib/schemas/contact-form-schema';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface SubmitContactFormState {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof ContactFormData, string[]>>;
  submissionId?: string;
}

export async function submitContactForm(
  _prevState: SubmitContactFormState | null,
  formData: FormData
): Promise<SubmitContactFormState> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL or Service Role Key is missing from environment variables.');
    return {
      success: false,
      message: 'Server configuration error. Please contact support.',
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Extract raw values
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  // 2. Validate with Zod
  const validationResult = ContactFormSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the fields below.',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. Await headers() so we get ReadonlyHeaders
    const headersList = await headers();

    // 4. Insert and select only the `id`, then .single<T>() to type the returned row
    const response = await supabaseAdmin
      .from('contact_submissions')
      .insert([{
        name: validationResult.data.name,
        email: validationResult.data.email,
        message: validationResult.data.message,
        source_page: headersList.get('referer') ?? '/contact',
        ip_address:
          headersList.get('x-forwarded-for') ??
          headersList.get('remote-addr') ??
          undefined,
        user_agent: headersList.get('user-agent') ?? undefined,
      }])
      .select('id')
      .single<{ id: string }>();

    if (response.error) {
      console.error('Supabase admin error:', response.error);
      return {
        success: false,
        message: `Database error: ${response.error.message}`,
      };
    }

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      submissionId: response.data.id,
    };
  } catch (e: unknown) {
    const errMessage = e instanceof Error ? e.message : 'An unknown server error occurred.';
    console.error('Unexpected error in submitContactForm:', errMessage);
    return {
      success: false,
      message: `A server error occurred: ${errMessage}`,
    };
  }
}
