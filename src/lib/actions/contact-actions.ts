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
    console.error("Supabase URL or Service Role Key is missing from environment variables.");
    return {
        success: false,
        message: 'Server configuration error. Please contact support.',
    };
  }
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false, 
      autoRefreshToken: false,
    }
  });

  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return {
      success: false,
      message: 'Invalid form data format. Please try again.',
    };
  }

  const validationResult = ContactFormSchema.safeParse({ name, email, message });

  if (!validationResult.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the fields below.',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const headersList = await headers(); // Await the headers function
    const { data, error } = await supabaseAdmin 
      .from('contact_submissions')
      .insert([
        {
          name: validationResult.data.name,
          email: validationResult.data.email,
          message: validationResult.data.message,
          source_page: headersList.get('referer') || '/contact',
          ip_address: headersList.get('x-forwarded-for') || headersList.get('remote-addr'),
          user_agent: headersList.get('user-agent'),
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase admin error inserting contact submission:', error);
      if (error.message.includes('violates row-level security policy')) {
           return {
             success: false,
             message: 'There was an issue submitting your message due to security policies. Please contact support directly.',
           };
      }
      return {
        success: false,
        message: `An error occurred while submitting your message. ${error.message}`,
      };
    }
    
    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      submissionId: data.id,
    };

  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Unexpected error in submitContactForm:', e.message);
      return {
        success: false,
        message: `A server error occurred: ${e.message}`,
      };
    }
    console.error('Unexpected non-Error exception in submitContactForm:', String(e));
    return {
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    };
  }
}