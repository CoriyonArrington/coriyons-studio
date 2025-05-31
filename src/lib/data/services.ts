// src/lib/data/services.ts
import { createClient } from '@/src/utils/supabase/server'; // Your existing server client
import { unstable_noStore as noStore } from 'next/cache'; // To opt out of static rendering if data is very dynamic

// Define a more specific type for the service data we fetch
// Ideally, this would come from your generated Supabase types after you update them.
// For now, based on your tables.sql and needs:
export interface FeaturedService {
  id: string; // Assuming id is uuid, but string is fine here
  slug: string;
  title: string;
  description: string | null; // description can be nullable
}

export async function getFeaturedServices(limit: number = 3): Promise<FeaturedService[]> {
  noStore(); // Opt out of static rendering for this function if data changes often,
             // or remove if you prefer static generation for services on the homepage.

  const supabase = await createClient(); // This is your server-side client
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description') // Select only needed fields
    .limit(limit);

  if (error) {
    console.error('Error fetching services:', error.message);
    // Depending on your error handling strategy, you might throw the error
    // or return an empty array. For the homepage, returning an empty array
    // might be preferable to crashing the page.
    return [];
  }

  return data || []; // Ensure we always return an array
}