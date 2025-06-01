-- Create ENUM types first as tables will depend on them

-- For public.pages table
CREATE TYPE public.page_type_enum AS ENUM (
  'MAIN',
  'RESOURCES',
  'LEGAL',
  'PRODUCT',
  'MARKETING',
  'CONTENT_HUB',
  'STANDARD',
  'OTHER'
);

CREATE TYPE public.page_status_enum AS ENUM (
  'DRAFT',
  'PENDING_REVIEW',
  'PUBLISHED',
  'ARCHIVED'
);

-- For public.posts table
CREATE TYPE public.post_status AS ENUM (
  'draft',
  'pending_review',
  'published',
  'archived'
);

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set search_path for the function to address linter warning
ALTER FUNCTION public.handle_updated_at() SET search_path = public;