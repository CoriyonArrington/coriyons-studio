-- Row Level Security policies for all tables

-- icons
ALTER TABLE public.icons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read icons" ON public.icons FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read tags" ON public.tags FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read services" ON public.services FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read projects" ON public.projects FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- project_services
ALTER TABLE public.project_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read project_services links" ON public.project_services FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- project_tags
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read project_tags links" ON public.project_tags FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read testimonials" ON public.testimonials FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- testimonial_services
ALTER TABLE public.testimonial_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read testimonial_services links" ON public.testimonial_services FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read published posts" ON public.posts FOR SELECT USING (status = 'published' AND published_at <= now());
-- Add admin/author policies for CUD and drafts as needed

-- post_tags
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read post_tags links" ON public.post_tags FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read published pages" ON public.pages FOR SELECT USING (status = 'PUBLISHED' AND (published_at IS NULL OR published_at <= now()));
-- Add admin/editor policies for CUD and drafts as needed

-- faq_categories
ALTER TABLE public.faq_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read faq_categories" ON public.faq_categories FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read faqs" ON public.faqs FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- faq_pages
ALTER TABLE public.faq_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read faq_pages links" ON public.faq_pages FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- design_process_steps
ALTER TABLE public.design_process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read design_process_steps" ON public.design_process_steps FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- ux_problems
ALTER TABLE public.ux_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read ux_problems" ON public.ux_problems FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- ux_problem_pages
ALTER TABLE public.ux_problem_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read ux_problem_pages links" ON public.ux_problem_pages FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- ux_solutions
ALTER TABLE public.ux_solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read ux_solutions" ON public.ux_solutions FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- ux_solution_pages
ALTER TABLE public.ux_solution_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read ux_solution_pages links" ON public.ux_solution_pages FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- ux_problem_solutions
ALTER TABLE public.ux_problem_solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: read ux_problem_solutions links" ON public.ux_problem_solutions FOR SELECT USING (true);
-- Add admin policies for CUD operations as needed

-- contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert access for contact submissions" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow admin full access to contact submissions" ON public.contact_submissions FOR ALL USING (true); -- Consider scoping to admin role

-- feedback_submissions
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert for feedback submissions" ON public.feedback_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow admin full access to feedback submissions" ON public.feedback_submissions FOR ALL USING (true); -- Consider scoping to admin role