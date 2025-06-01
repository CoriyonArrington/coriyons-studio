-- Comments for all tables and columns to document the schema

-- icons
COMMENT ON TABLE public.icons IS 'Stores metadata about icons used in the system.';
COMMENT ON COLUMN public.icons.name IS 'Unique machine-readable name or key for the icon.';
COMMENT ON COLUMN public.icons.description IS 'Optional description of the icon''s purpose or context.';
COMMENT ON COLUMN public.icons.icon_library IS 'Optional: The library or source of the icon (e.g., Heroicons, Custom).';
COMMENT ON COLUMN public.icons.created_at IS 'Timestamp of when the icon record was created.';
COMMENT ON COLUMN public.icons.updated_at IS 'Timestamp of when the icon record was last updated.';

-- tags
COMMENT ON TABLE public.tags IS 'Stores unique tags that can be applied to various content types (e.g., posts, projects).';
COMMENT ON COLUMN public.tags.name IS 'The display name of the tag (must be unique).';
COMMENT ON COLUMN public.tags.slug IS 'URL-friendly slug for the tag (must be unique).';
COMMENT ON COLUMN public.tags.description IS 'Optional description for the tag, e.g., for a tag archive page.';
COMMENT ON COLUMN public.tags.created_at IS 'Timestamp of when the tag was created.';
COMMENT ON COLUMN public.tags.updated_at IS 'Timestamp of when the tag was last updated.';

-- services
COMMENT ON TABLE public.services IS 'Stores information about the different services offered.';
COMMENT ON COLUMN public.services.slug IS 'URL-friendly unique identifier for the service.';
COMMENT ON COLUMN public.services.title IS 'Display title of the service.';
COMMENT ON COLUMN public.services.description IS 'Short summary of the service.';
COMMENT ON COLUMN public.services.content IS 'Detailed content about the service (JSONB format).';
COMMENT ON COLUMN public.services.featured_image_url IS 'URL for a representative image of the service.';
COMMENT ON COLUMN public.services.featured IS 'Boolean flag to indicate if the service is featured.';
COMMENT ON COLUMN public.services.sort_order IS 'Numerical value for manual sorting of services.';
COMMENT ON COLUMN public.services.created_at IS 'Timestamp of when the service was created.';
COMMENT ON COLUMN public.services.updated_at IS 'Timestamp of when the service was last updated.';

-- projects
COMMENT ON TABLE public.projects IS 'Stores case studies or project showcases.';
COMMENT ON COLUMN public.projects.slug IS 'URL-friendly unique identifier for the project.';
COMMENT ON COLUMN public.projects.title IS 'Display title of the project.';
COMMENT ON COLUMN public.projects.client_name IS 'Name of the client for the project.';
COMMENT ON COLUMN public.projects.project_date IS 'Date of project completion or key milestone.';
COMMENT ON COLUMN public.projects.description IS 'Short summary/excerpt for project listing cards.';
COMMENT ON COLUMN public.projects.featured_image_url IS 'URL for the main preview image of the project.';
COMMENT ON COLUMN public.projects.og_image_url IS 'URL for the Open Graph image for social sharing.';
COMMENT ON COLUMN public.projects.content IS 'Detailed structured content of the case study (JSONB).';
COMMENT ON COLUMN public.projects.featured IS 'True if the project should be highlighted.';
COMMENT ON COLUMN public.projects.sort_order IS 'Manual sort order for displaying projects.';
COMMENT ON COLUMN public.projects.created_at IS 'Timestamp of when the project was created.';
COMMENT ON COLUMN public.projects.updated_at IS 'Timestamp of when the project was last updated.';

-- project_services
COMMENT ON TABLE public.project_services IS 'Join table linking projects to services rendered.';
COMMENT ON COLUMN public.project_services.project_id IS 'Foreign key to the projects table.';
COMMENT ON COLUMN public.project_services.service_id IS 'Foreign key to the services table.';
COMMENT ON COLUMN public.project_services.created_at IS 'Timestamp of when the link was created.';

-- project_tags
COMMENT ON TABLE public.project_tags IS 'Join table linking projects to their centrally managed tags.';
COMMENT ON COLUMN public.project_tags.project_id IS 'Foreign key to the projects table.';
COMMENT ON COLUMN public.project_tags.tag_id IS 'Foreign key to the central tags table.';
COMMENT ON COLUMN public.project_tags.created_at IS 'Timestamp of when the link was created.';

-- testimonials
COMMENT ON TABLE public.testimonials IS 'Stores user/client testimonials.';
COMMENT ON COLUMN public.testimonials.name IS 'Name of the person providing the testimonial.';
COMMENT ON COLUMN public.testimonials.role IS 'Role or title of the person (e.g., CEO, Developer).';
COMMENT ON COLUMN public.testimonials.company_name IS 'Name of the company the person is affiliated with.';
COMMENT ON COLUMN public.testimonials.avatar_url IS 'URL for the testimonial provider''s photo or avatar.';
COMMENT ON COLUMN public.testimonials.quote IS 'The full text of the testimonial.';
COMMENT ON COLUMN public.testimonials.project_id IS 'Optional foreign key linking the testimonial to a specific project.';
COMMENT ON COLUMN public.testimonials.featured IS 'True if the testimonial should be highlighted.';
COMMENT ON COLUMN public.testimonials.sort_order IS 'Manual sort order for displaying testimonials.';
COMMENT ON COLUMN public.testimonials.created_at IS 'Timestamp of when the testimonial was created.';
COMMENT ON COLUMN public.testimonials.updated_at IS 'Timestamp of when the testimonial was last updated.';

-- testimonial_services
COMMENT ON TABLE public.testimonial_services IS 'Join table linking testimonials to the services they endorse.';
COMMENT ON COLUMN public.testimonial_services.testimonial_id IS 'Foreign key to the testimonials table.';
COMMENT ON COLUMN public.testimonial_services.service_id IS 'Foreign key to the services table.';
COMMENT ON COLUMN public.testimonial_services.created_at IS 'Timestamp of when the link was created.';

-- posts
COMMENT ON TABLE public.posts IS 'Stores blog posts.';
COMMENT ON COLUMN public.posts.slug IS 'URL-friendly unique identifier for the post.';
COMMENT ON COLUMN public.posts.title IS 'Title of the blog post.';
COMMENT ON COLUMN public.posts.excerpt IS 'Short summary or excerpt of the post.';
COMMENT ON COLUMN public.posts.content IS 'Rich content for the blog post (JSONB format).';
COMMENT ON COLUMN public.posts.featured_image_url IS 'URL for the main image of the post.';
COMMENT ON COLUMN public.posts.og_image_url IS 'URL for the Open Graph image for social sharing of the post.';
COMMENT ON COLUMN public.posts.status IS 'Publication status of the post (draft, pending_review, published, archived).';
COMMENT ON COLUMN public.posts.published_at IS 'Timestamp of when the post was or is scheduled to be published.';
COMMENT ON COLUMN public.posts.author_id IS 'Optional foreign key to the user/author who wrote the post.';
COMMENT ON COLUMN public.posts.featured IS 'True if the post should be highlighted.';
COMMENT ON COLUMN public.posts.created_at IS 'Timestamp of when the post was created.';
COMMENT ON COLUMN public.posts.updated_at IS 'Timestamp of when the post was last updated.';

-- post_tags
COMMENT ON TABLE public.post_tags IS 'Join table linking blog posts to their tags.';
COMMENT ON COLUMN public.post_tags.post_id IS 'Foreign key to the posts table.';
COMMENT ON COLUMN public.post_tags.tag_id IS 'Foreign key to the tags table.';
COMMENT ON COLUMN public.post_tags.created_at IS 'Timestamp of when the link was created.';

-- pages
COMMENT ON TABLE public.pages IS 'Stores content and metadata for various site pages.';
COMMENT ON COLUMN public.pages.slug IS 'URL-friendly identifier for the page.';
COMMENT ON COLUMN public.pages.title IS 'The title of the page, typically used for the HTML <title> tag and SEO.';
COMMENT ON COLUMN public.pages.page_type IS 'Categorizes the page (e.g., MAIN, RESOURCES, LEGAL) for organizational or display purposes.';
COMMENT ON COLUMN public.pages.content IS 'Flexible JSONB field to store structured content for different page sections.';
COMMENT ON COLUMN public.pages.meta_description IS 'SEO meta description for the page.';
COMMENT ON COLUMN public.pages.og_image_url IS 'Open Graph image URL for social media sharing of the page.';
COMMENT ON COLUMN public.pages.status IS 'Publication status of the page (e.g., DRAFT, PUBLISHED).';
COMMENT ON COLUMN public.pages.published_at IS 'Timestamp indicating when the page was or is scheduled to be published.';
COMMENT ON COLUMN public.pages.user_id IS 'Optional foreign key to the user who created or last edited the page.';
COMMENT ON COLUMN public.pages.sort_order IS 'Numerical value to manually order pages, e.g., within a navigation group or footer list.';
COMMENT ON COLUMN public.pages.created_at IS 'Timestamp of when the page was created.';
COMMENT ON COLUMN public.pages.updated_at IS 'Timestamp of when the page was last updated.';

-- faq_categories
COMMENT ON TABLE public.faq_categories IS 'Stores categories for FAQs.';
COMMENT ON COLUMN public.faq_categories.name IS 'Display name of the FAQ category.';
COMMENT ON COLUMN public.faq_categories.slug IS 'URL-friendly slug for the category.';
COMMENT ON COLUMN public.faq_categories.description IS 'Optional description of the FAQ category.';
COMMENT ON COLUMN public.faq_categories.sort_order IS 'Manual sort order for FAQ categories.';
COMMENT ON COLUMN public.faq_categories.created_at IS 'Timestamp of when the category was created.';
COMMENT ON COLUMN public.faq_categories.updated_at IS 'Timestamp of when the category was last updated.';

-- faqs
COMMENT ON TABLE public.faqs IS 'Stores frequently asked questions and their answers.';
COMMENT ON COLUMN public.faqs.question IS 'The text of the FAQ question.';
COMMENT ON COLUMN public.faqs.answer IS 'The answer to the FAQ (JSONB for rich content).';
COMMENT ON COLUMN public.faqs.faq_category_id IS 'Optional foreign key linking the FAQ to a category.';
COMMENT ON COLUMN public.faqs.sort_order IS 'Manual sort order for FAQs.';
COMMENT ON COLUMN public.faqs.featured IS 'True if the FAQ should be highlighted.';
COMMENT ON COLUMN public.faqs.created_at IS 'Timestamp of when the FAQ was created.';
COMMENT ON COLUMN public.faqs.updated_at IS 'Timestamp of when the FAQ was last updated.';

-- faq_pages
COMMENT ON TABLE public.faq_pages IS 'Join table indicating on which page(s) an FAQ should be displayed.';
COMMENT ON COLUMN public.faq_pages.faq_id IS 'Foreign key to the faqs table.';
COMMENT ON COLUMN public.faq_pages.page_id IS 'Foreign key to the pages table.';
COMMENT ON COLUMN public.faq_pages.created_at IS 'Timestamp of when the link was created.';

-- design_process_steps
COMMENT ON TABLE public.design_process_steps IS 'Stores the individual steps or phases of the design process, with an optional associated icon via icon_id.';
COMMENT ON COLUMN public.design_process_steps.title IS 'The main title or name of the design process step.';
COMMENT ON COLUMN public.design_process_steps.slug IS 'URL-friendly slug if the step has a dedicated page.';
COMMENT ON COLUMN public.design_process_steps.description IS 'A brief description or summary of the design process step.';
COMMENT ON COLUMN public.design_process_steps.content IS 'Detailed structured content about the step (JSONB).';
COMMENT ON COLUMN public.design_process_steps.icon_id IS 'Optional foreign key to the icons table, representing the icon for this step.';
COMMENT ON COLUMN public.design_process_steps.sort_order IS 'Numerical value to define the order of the steps in the process.';
COMMENT ON COLUMN public.design_process_steps.created_at IS 'Timestamp of when the step was created.';
COMMENT ON COLUMN public.design_process_steps.updated_at IS 'Timestamp of when the step was last updated.';

-- ux_problems
COMMENT ON TABLE public.ux_problems IS 'Stores definitions of common UX problems or pain points.';
COMMENT ON COLUMN public.ux_problems.title IS 'Title of the UX problem.';
COMMENT ON COLUMN public.ux_problems.slug IS 'URL-friendly slug if the UX problem has a dedicated detail page.';
COMMENT ON COLUMN public.ux_problems.description IS 'A concise description of the UX problem.';
COMMENT ON COLUMN public.ux_problems.content IS 'Optional: Richer, structured content detailing the UX problem.';
COMMENT ON COLUMN public.ux_problems.icon_id IS 'Optional: Foreign key to an icon representing the problem.';
COMMENT ON COLUMN public.ux_problems.featured IS 'True if the problem should be highlighted.';
COMMENT ON COLUMN public.ux_problems.sort_order IS 'Manual sort order for displaying problems.';
COMMENT ON COLUMN public.ux_problems.created_at IS 'Timestamp of when the problem was created.';
COMMENT ON COLUMN public.ux_problems.updated_at IS 'Timestamp of when the problem was last updated.';

-- ux_problem_pages
COMMENT ON TABLE public.ux_problem_pages IS 'Join table linking UX problems to specific pages where they are mentioned or relevant.';
COMMENT ON COLUMN public.ux_problem_pages.ux_problem_id IS 'Foreign key to the ux_problems table.';
COMMENT ON COLUMN public.ux_problem_pages.page_id IS 'Foreign key to the pages table.';
COMMENT ON COLUMN public.ux_problem_pages.created_at IS 'Timestamp of when the link was created.';

-- ux_solutions
COMMENT ON TABLE public.ux_solutions IS 'Stores generic, reusable UX solutions or value propositions.';
COMMENT ON COLUMN public.ux_solutions.title IS 'Title of the UX solution.';
COMMENT ON COLUMN public.ux_solutions.slug IS 'URL-friendly slug for the UX solution.';
COMMENT ON COLUMN public.ux_solutions.description IS 'A concise summary of the UX solution.';
COMMENT ON COLUMN public.ux_solutions.content IS 'Optional: Richer, structured content detailing the solution (e.g., key benefits, approach).';
COMMENT ON COLUMN public.ux_solutions.icon_id IS 'Optional: Foreign key to an icon representing the solution.';
COMMENT ON COLUMN public.ux_solutions.featured IS 'True if the solution should be highlighted.';
COMMENT ON COLUMN public.ux_solutions.sort_order IS 'Manual sort order for displaying solutions.';
COMMENT ON COLUMN public.ux_solutions.created_at IS 'Timestamp of when the solution was created.';
COMMENT ON COLUMN public.ux_solutions.updated_at IS 'Timestamp of when the solution was last updated.';

-- ux_solution_pages
COMMENT ON TABLE public.ux_solution_pages IS 'Join table linking UX solutions to specific pages where they are mentioned or relevant.';
COMMENT ON COLUMN public.ux_solution_pages.ux_solution_id IS 'Foreign key to the ux_solutions table.';
COMMENT ON COLUMN public.ux_solution_pages.page_id IS 'Foreign key to the pages table.';
COMMENT ON COLUMN public.ux_solution_pages.created_at IS 'Timestamp of when the link was created.';

-- ux_problem_solutions
COMMENT ON TABLE public.ux_problem_solutions IS 'Join table linking UX problems to the UX solutions that address them.';
COMMENT ON COLUMN public.ux_problem_solutions.ux_problem_id IS 'Foreign key to the ux_problems table.';
COMMENT ON COLUMN public.ux_problem_solutions.ux_solution_id IS 'Foreign key to the ux_solutions table.';
COMMENT ON COLUMN public.ux_problem_solutions.created_at IS 'Timestamp of when the link was created.';

-- contact_submissions
COMMENT ON TABLE public.contact_submissions IS 'Stores messages submitted via public contact forms, optionally linked to a user.';
COMMENT ON COLUMN public.contact_submissions.name IS 'Name of the person submitting the message.';
COMMENT ON COLUMN public.contact_submissions.email IS 'Email address of the person submitting the message.';
COMMENT ON COLUMN public.contact_submissions.message IS 'The content of the message submitted.';
COMMENT ON COLUMN public.contact_submissions.source_page IS 'The page or form identifier from which the message was submitted.';
COMMENT ON COLUMN public.contact_submissions.ip_address IS 'IP address of the message submitter.';
COMMENT ON COLUMN public.contact_submissions.user_agent IS 'User agent string of the message submitter.';
COMMENT ON COLUMN public.contact_submissions.user_id IS 'Optional: UUID of the authenticated user, if the submission was from a logged-in user (no DB foreign key constraint).';
COMMENT ON COLUMN public.contact_submissions.is_read IS 'Indicates if the message has been read by an administrator.';
COMMENT ON COLUMN public.contact_submissions.archived IS 'Indicates if the message has been archived.';
COMMENT ON COLUMN public.contact_submissions.created_at IS 'Timestamp of when the message was submitted.';

-- feedback_submissions
COMMENT ON TABLE public.feedback_submissions IS 'Stores feedback submitted by users about the site or content.';
COMMENT ON COLUMN public.feedback_submissions.clarity_rating IS 'User rating for clarity (e.g., 1-5).';
COMMENT ON COLUMN public.feedback_submissions.usefulness_rating IS 'User rating for usefulness (e.g., 1-5).';
COMMENT ON COLUMN public.feedback_submissions.satisfaction_rating IS 'User rating for overall satisfaction (e.g., 1-5).';
COMMENT ON COLUMN public.feedback_submissions.feedback_type IS 'Type of feedback (e.g., general, bug, feature, content).';
COMMENT ON COLUMN public.feedback_submissions.comments IS 'Textual comments provided in the feedback.';
COMMENT ON COLUMN public.feedback_submissions.source_url IS 'The URL of the page from which the feedback was submitted.';
COMMENT ON COLUMN public.feedback_submissions.user_id IS 'UUID of the authenticated user, if available (no DB foreign key constraint).';
COMMENT ON COLUMN public.feedback_submissions.email IS 'Email address provided by an anonymous user submitting feedback.';
COMMENT ON COLUMN public.feedback_submissions.user_agent IS 'User agent string of the feedback submitter.';
COMMENT ON COLUMN public.feedback_submissions.ip_address IS 'IP address of the feedback submitter.';
COMMENT ON COLUMN public.feedback_submissions.is_actioned IS 'Indicates if the feedback has been reviewed or actioned.';
COMMENT ON COLUMN public.feedback_submissions.archived IS 'Indicates if the feedback submission has been archived.';
COMMENT ON COLUMN public.feedback_submissions.created_at IS 'Timestamp of when the feedback was submitted.';