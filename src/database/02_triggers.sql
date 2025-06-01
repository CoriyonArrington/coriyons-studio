-- Triggers for automatically updating 'updated_at' timestamps
-- (Assuming public.handle_updated_at() function is defined in 00_types_and_functions.sql)

-- For public.icons
DROP TRIGGER IF EXISTS on_icons_updated_at ON public.icons;
CREATE TRIGGER on_icons_updated_at
BEFORE UPDATE ON public.icons
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.tags
DROP TRIGGER IF EXISTS on_tags_updated_at ON public.tags;
CREATE TRIGGER on_tags_updated_at
BEFORE UPDATE ON public.tags
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.services
DROP TRIGGER IF EXISTS on_services_updated_at ON public.services;
CREATE TRIGGER on_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.projects
DROP TRIGGER IF EXISTS on_projects_updated_at ON public.projects;
CREATE TRIGGER on_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.testimonials
DROP TRIGGER IF EXISTS on_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER on_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.posts
DROP TRIGGER IF EXISTS on_posts_updated_at ON public.posts;
CREATE TRIGGER on_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.pages
DROP TRIGGER IF EXISTS on_pages_updated_at ON public.pages;
CREATE TRIGGER on_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.faq_categories
DROP TRIGGER IF EXISTS on_faq_categories_updated_at ON public.faq_categories;
CREATE TRIGGER on_faq_categories_updated_at
BEFORE UPDATE ON public.faq_categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.faqs
DROP TRIGGER IF EXISTS on_faqs_updated_at ON public.faqs;
CREATE TRIGGER on_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.design_process_steps
DROP TRIGGER IF EXISTS on_design_process_steps_updated_at ON public.design_process_steps;
CREATE TRIGGER on_design_process_steps_updated_at
BEFORE UPDATE ON public.design_process_steps
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.ux_problems
DROP TRIGGER IF EXISTS on_ux_problems_updated_at ON public.ux_problems;
CREATE TRIGGER on_ux_problems_updated_at
BEFORE UPDATE ON public.ux_problems
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- For public.ux_solutions
DROP TRIGGER IF EXISTS on_ux_solutions_updated_at ON public.ux_solutions;
CREATE TRIGGER on_ux_solutions_updated_at
BEFORE UPDATE ON public.ux_solutions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Note: contact_submissions and feedback_submissions do not have an 'updated_at' field by default.