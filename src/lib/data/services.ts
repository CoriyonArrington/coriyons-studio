// FINAL, SELF-CONTAINED VERSION
// This version manually defines all necessary types to remove any dependency on
// external type generation, definitively resolving the chain of errors.

import { createServerClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface IconData {
  name: string;
  icon_library: string | null;
}

export interface ServiceContentJson {
  [key: string]: unknown;
}

export interface ServiceFeature {
  id: string;
  name: string;
  description: string | null;
  icon: IconData | null;
}

export interface ServiceCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
}

export interface ServiceDetail extends ServiceCardItem {
  content: ServiceContentJson | null;
  features: ServiceFeature[] | null;
}

// FIX: Manually define the shape of a row from the 'services' table.
// This removes the dependency on the Supabase `Database` generic.
type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: unknown;
};

// FIX: Manually define the shape of a row from the 'service_features' table.
type ServiceFeatureRow = {
  id: string;
  name: string;
  description: string | null;
};

// FIX: Rebuild the joined type using our manual, self-contained types.
// This is now stable and resolves the "'any' overrides all other types" error.
type ServiceWithFeatures = ServiceRow & {
  service_features: (ServiceFeatureRow & {
    icons: IconData[] | null;
  })[];
  icons: IconData[] | null;
};

function getIcon(item: { icons: IconData[] | null }): IconData | null {
  if (Array.isArray(item.icons) && item.icons.length > 0) {
    return item.icons[0];
  }
  return null;
}

export async function getAllServices(): Promise<ServiceCardItem[]> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('services')
    .select('id, slug, title, description, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (response.error) {
    console.error('Error fetching all services:', response.error.message);
    return [];
  }

  const data = response.data as (ServiceCardItem & { icons: IconData[] | null })[];

  return data.map(service => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    icon: getIcon(service),
  }));
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('services')
    .select('*, icons (name, icon_library), service_features (*, icons (name, icon_library))')
    .eq('slug', slug)
    .single();

  if (response.error) {
    if (response.error.code === 'PGRST116') {
      console.warn(`Service with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching service by slug "${slug}":`, response.error.message);
    return null;
  }
  
  const typedData = response.data as ServiceWithFeatures;

  // With `ServiceWithFeatures` now stable, all unsafe errors are resolved.
  const features = typedData.service_features.map(feature => ({
    id: feature.id,
    name: feature.name,
    description: feature.description,
    icon: getIcon(feature),
  }));

  return {
    id: typedData.id,
    slug: typedData.slug,
    title: typedData.title,
    description: typedData.description,
    icon: getIcon(typedData),
    content: typedData.content as ServiceContentJson | null,
    features: features.length > 0 ? features : null,
  };
}