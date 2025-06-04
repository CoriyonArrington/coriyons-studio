// src/lib/actions/contact-actions.ts
'use server';

// Ensure you have the base supabase-js client installed: npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js'; 
import { ContactFormSchema, type ContactFormData } from '@/src/lib/schemas/contact-form-schema';
import { headers } from 'next/headers';

// Ensure these are set in your environment variables (.env.local)
// NEXT_PUBLIC_SUPABASE_URL is public, SUPABASE_SERVICE_ROLE_KEY is private and server-side only
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface SubmitContactFormState {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof ContactFormData, string[]>>;
  submissionId?: string;
}

export async function submitContactForm(
  prevState: SubmitContactFormState | null,
  formData: FormData
): Promise<SubmitContactFormState> {
  const headersList = headers();
  
  // Validate environment variables
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase URL or Service Role Key is missing from environment variables.");
    return {
        success: false,
        message: 'Server configuration error. Please contact support.',
    };
  }
  
  // For operations requiring service_role, create a dedicated client
  // This bypasses RLS. Only use where appropriate and secure.
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false, 
      autoRefreshToken: false,
    }
  });

  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  };

  const validationResult = ContactFormSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    console.log('Validation errors:', validationResult.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data. Please check the fields below.',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    // Use the supabaseAdmin client for this insert
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
      // This specific RLS check becomes less likely to trigger if service_role is used correctly
      // but we can keep it as a fallback or for other potential errors.
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
    
    if (data) {
        console.log('Contact form submission successful. ID:', data.id);
        return {
          success: true,
          message: 'Thank you for your message! We will get back to you soon.',
          submissionId: data.id,
        };
    }

    return {
        success: false,
        message: 'An unexpected issue occurred after attempting submission. Please try again.',
    };

  } catch (e: any) {
    console.error('Unexpected error in submitContactForm:', e);
    return {
      success: false,
      message: 'A server error occurred. Please try again later.',
    };
  }
}