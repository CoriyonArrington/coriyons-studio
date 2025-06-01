-- Core table definitions
-- Foreign Key constraints are defined inline with table creation.

-- icons table
CREATE TABLE IF NOT EXISTS public.icons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_library TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- tags table (centralized)
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  featured_image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  project_date DATE,
  description TEXT, -- Short summary for listing cards
  featured_image_url TEXT,
  og_image_url TEXT,
  content JSONB,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- project_services join table (projects <-> services)
CREATE TABLE IF NOT EXISTS public.project_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_project_service UNIQUE (project_id, service_id)
);

-- project_tags join table (projects <-> tags, refactored)
CREATE TABLE IF NOT EXISTS public.project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_project_tag_link UNIQUE (project_id, tag_id)
);

-- testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company_name TEXT,
  avatar_url TEXT,
  quote TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- testimonial_services join table (testimonials <-> services)
CREATE TABLE IF NOT EXISTS public.testimonial_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id UUID NOT NULL REFERENCES public.testimonials(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_testimonial_service UNIQUE (testimonial_id, service_id)
);

-- posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content JSONB, -- Changed to JSONB
  featured_image_url TEXT,
  og_image_url TEXT,
  status public.post_status NOT NULL DEFAULT 'draft', -- Using the ENUM type
  published_at TIMESTAMPTZ,
  author_id UUID, -- Can link to auth.users(id) or a future profiles/authors table
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- post_tags join table (posts <-> tags)
CREATE TABLE IF NOT EXISTS public.post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_post_tag UNIQUE (post_id, tag_id)
);

-- pages table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  page_type public.page_type_enum NOT NULL DEFAULT 'STANDARD',
  content JSONB,
  meta_description TEXT,
  og_image_url TEXT,
  status public.page_status_enum NOT NULL DEFAULT 'DRAFT',
  published_at TIMESTAMPTZ,
  user_id UUID,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- faq_categories table
CREATE TABLE IF NOT EXISTS public.faq_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- faqs table
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer JSONB NOT NULL, -- Changed to JSONB
  faq_category_id UUID REFERENCES public.faq_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- faq_pages join table (faqs <-> pages)
CREATE TABLE IF NOT EXISTS public.faq_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faq_id UUID NOT NULL REFERENCES public.faqs(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_faq_page_link UNIQUE (faq_id, page_id)
);

-- design_process_steps table
CREATE TABLE IF NOT EXISTS public.design_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content JSONB,
  icon_id UUID REFERENCES public.icons(id) ON DELETE SET NULL, -- Changed from icon_svg_name
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ux_problems table
CREATE TABLE IF NOT EXISTS public.ux_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content JSONB,
  icon_id UUID REFERENCES public.icons(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ux_problem_pages join table (ux_problems <-> pages)
CREATE TABLE IF NOT EXISTS public.ux_problem_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ux_problem_id UUID NOT NULL REFERENCES public.ux_problems(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_ux_problem_page UNIQUE (ux_problem_id, page_id)
);

-- ux_solutions table
CREATE TABLE IF NOT EXISTS public.ux_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content JSONB,
  icon_id UUID REFERENCES public.icons(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ux_solution_pages join table (ux_solutions <-> pages)
CREATE TABLE IF NOT EXISTS public.ux_solution_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ux_solution_id UUID NOT NULL REFERENCES public.ux_solutions(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_ux_solution_page UNIQUE (ux_solution_id, page_id)
);

-- ux_problem_solutions join table (ux_problems <-> ux_solutions)
CREATE TABLE IF NOT EXISTS public.ux_problem_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ux_problem_id UUID NOT NULL REFERENCES public.ux_problems(id) ON DELETE CASCADE,
  ux_solution_id UUID NOT NULL REFERENCES public.ux_solutions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_ux_problem_solution UNIQUE (ux_problem_id, ux_solution_id)
);

-- contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  source_page TEXT,
  ip_address INET,
  user_agent TEXT,
  user_id UUID, -- Added user_id
  is_read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- feedback_submissions table
CREATE TABLE IF NOT EXISTS public.feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clarity_rating INTEGER CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
  usefulness_rating INTEGER CHECK (usefulness_rating >= 1 AND usefulness_rating <= 5),
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  feedback_type TEXT,
  comments TEXT,
  source_url TEXT,
  user_id UUID, -- No FK constraint for now
  email TEXT,
  user_agent TEXT,
  ip_address INET,
  is_actioned BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);