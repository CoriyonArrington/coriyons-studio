-- Indexes for foreign key columns and other performance optimizations

-- For design_process_steps
CREATE INDEX IF NOT EXISTS idx_design_process_steps_icon_id ON public.design_process_steps(icon_id);

-- For faq_pages
CREATE INDEX IF NOT EXISTS idx_faq_pages_page_id ON public.faq_pages(page_id);
CREATE INDEX IF NOT EXISTS idx_faq_pages_faq_id ON public.faq_pages(faq_id); -- Also index the other FK

-- For faqs
CREATE INDEX IF NOT EXISTS idx_faqs_faq_category_id ON public.faqs(faq_category_id);

-- For post_tags
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags(post_id); -- Also index the other FK

-- For project_services
CREATE INDEX IF NOT EXISTS idx_project_services_service_id ON public.project_services(service_id);
CREATE INDEX IF NOT EXISTS idx_project_services_project_id ON public.project_services(project_id); -- Also index the other FK

-- For project_tags
CREATE INDEX IF NOT EXISTS idx_project_tags_tag_id ON public.project_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON public.project_tags(project_id); -- Also index the other FK

-- For testimonial_services
CREATE INDEX IF NOT EXISTS idx_testimonial_services_service_id ON public.testimonial_services(service_id);
CREATE INDEX IF NOT EXISTS idx_testimonial_services_testimonial_id ON public.testimonial_services(testimonial_id); -- Also index the other FK

-- For testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_project_id ON public.testimonials(project_id);

-- For ux_problem_pages
CREATE INDEX IF NOT EXISTS idx_ux_problem_pages_page_id ON public.ux_problem_pages(page_id);
CREATE INDEX IF NOT EXISTS idx_ux_problem_pages_ux_problem_id ON public.ux_problem_pages(ux_problem_id); -- Also index the other FK

-- For ux_problem_solutions
CREATE INDEX IF NOT EXISTS idx_ux_problem_solutions_ux_solution_id ON public.ux_problem_solutions(ux_solution_id);
CREATE INDEX IF NOT EXISTS idx_ux_problem_solutions_ux_problem_id ON public.ux_problem_solutions(ux_problem_id); -- Also index the other FK

-- For ux_problems
CREATE INDEX IF NOT EXISTS idx_ux_problems_icon_id ON public.ux_problems(icon_id);

-- For ux_solution_pages
CREATE INDEX IF NOT EXISTS idx_ux_solution_pages_page_id ON public.ux_solution_pages(page_id);
CREATE INDEX IF NOT EXISTS idx_ux_solution_pages_ux_solution_id ON public.ux_solution_pages(ux_solution_id); -- Also index the other FK

-- For ux_solutions
CREATE INDEX IF NOT EXISTS idx_ux_solutions_icon_id ON public.ux_solutions(icon_id);

-- For posts (author_id) - if it becomes a heavily queried FK
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);

-- For pages (user_id) - if it becomes a heavily queried FK
CREATE INDEX IF NOT EXISTS idx_pages_user_id ON public.pages(user_id);

-- For contact_submissions (user_id) - if it becomes a heavily queried FK
CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id ON public.contact_submissions(user_id);

-- For feedback_submissions (user_id) - if it becomes a heavily queried FK
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_user_id ON public.feedback_submissions(user_id);