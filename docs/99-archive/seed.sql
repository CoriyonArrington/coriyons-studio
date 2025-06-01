-- SQL: Sample Seed Data for Coriyon’s Studio (Updated)
-- Ensure to run 00_types_and_functions.sql and 01_tables_core.sql before this seed script.

-- Clear existing data (optional, use with caution in non-dev environments)
-- (Add DELETE FROM statements here if needed, in reverse order of creation due to FKs)
-- Example:
-- DELETE FROM public.post_tags;
-- DELETE FROM public.posts;
-- DELETE FROM public.tags;
-- ... and so on for all tables

-- Seed ENUM dependent tables first where applicable

-- Seed public.icons
INSERT INTO public.icons (id, name, description, icon_library, created_at, updated_at) VALUES
  ('d4ad4325-f56b-4cf4-9b10-0003ab4fbd51', 'problem-generic', 'Generic icon for UX problems', 'Custom', now(), now()),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'solution-generic', 'Generic icon for UX solutions', 'Custom', now(), now()),
  ('c1d2e3f4-a5b6-c7d8-e9f0-a1b2c3d4e5f6', 'palette-icon', 'Palette icon for design process', 'Heroicons', now(), now()),
  ('f1e2d3c4-b5a6-9876-5432-10fedcba9876', 'lightbulb-icon', 'Lightbulb icon for ideas', 'Heroicons', now(), now());

-- Seed public.tags
INSERT INTO public.tags (id, name, slug, description, created_at, updated_at) VALUES
  ('tag-uuid-ux', 'UX Design', 'ux-design', 'Content related to User Experience Design.', now(), now()),
  ('tag-uuid-dev', 'Development', 'development', 'Content related to Web Development.', now(), now()),
  ('tag-uuid-strategy', 'Strategy', 'strategy', 'Content related to business and UX strategy.', now(), now());

-- Seed public.services
INSERT INTO public.services (id, slug, title, description, content, featured_image_url, featured, sort_order, created_at, updated_at) VALUES
  ('svc-uuid-audit', 'ux-audit', 'UX Audit', 'Comprehensive evaluation of your product''s user experience to identify issues and opportunities for improvement.', '{"hero": {"headline": "Deep Dive UX Audit"}, "details": "Our audit covers usability, accessibility, and conversion.", "process_overview": "...", "deliverables": ["Report", "Recommendations"]}', '/images/services/ux-audit.png', TRUE, 1, now(), now()),
  ('svc-uuid-design', 'design-system', 'Design Systems', 'Scalable and maintainable design systems for consistent brand experiences.', '{"hero": {"headline": "Robust Design Systems"}, "details": "From tokens to components, built for scale."}', '/images/services/design-system.png', TRUE, 2, now(), now());

-- Seed public.pages
INSERT INTO public.pages (id, slug, title, page_type, content, meta_description, og_image_url, status, published_at, user_id, sort_order, created_at, updated_at) VALUES
  ('page-uuid-home', 'home', 'Coriyon’s Studio | UX Design & Development', 'MAIN', '{"hero": {"headline": "Good UX Solves Business Problems.", "subheadline": "Let''s build something amazing.", "cta": "Get Free Consultation", "href": "/contact"}, "services_section": {"headline": "Our Services", "cta": "View All", "href": "/services"}}', 'Expert UX design and development services to elevate your digital products. Based in Minneapolis.', '/images/og/home.png', 'PUBLISHED', now(), NULL, 1, now(), now()),
  ('page-uuid-about', 'about', 'About Coriyon’s Studio', 'MAIN', '{"hero": {"headline": "About Us"}, "mission": "Our mission is...", "team": "..."}', 'Learn about Coriyon’s Studio, our mission, and our passion for user-centered design.', '/images/og/about.png', 'PUBLISHED', now(), NULL, 2, now(), now()),
  ('page-uuid-contact', 'contact', 'Contact Us | Coriyon’s Studio', 'MAIN', '{"hero": {"headline": "Get In Touch"}, "form_details": "..."}', 'Contact Coriyon’s Studio for a consultation or to discuss your project needs.', '/images/og/contact.png', 'PUBLISHED', now(), NULL, 3, now(), now()),
  ('page-uuid-services', 'services', 'Services | Coriyon’s Studio', 'CONTENT_HUB', '{"hero": {"headline": "Our UX & Design Services"}, "service_listing": "..."}', 'Explore the range of UX design, research, and development services offered by Coriyon’s Studio.', '/images/og/services.png', 'PUBLISHED', now(), NULL, 1, now(), now());

-- Seed public.projects
INSERT INTO public.projects (id, slug, title, client_name, project_date, description, featured_image_url, og_image_url, content, featured, sort_order, created_at, updated_at) VALUES
  ('proj-uuid-wellness', 'wellness-app-revamp', 'Wellness App UX Revamp', 'HealthyCo', '2024-03-15', 'A complete overhaul of a mobile wellness application to improve user engagement and daily active users.', '/images/projects/wellness-app.png', '/images/og/projects/wellness-app.png', '{"overview": "The app suffered from low retention...", "challenge": "...", "solution": "...", "results": "20% increase in DAU.", "visuals": [{"alt": "App Screenshot 1", "url": "/images/projects/wellness-app/01.png"}]}', TRUE, 1, now(), now()),
  ('proj-uuid-ecom', 'ecommerce-platform', 'E-commerce Platform Design', 'ShopLocal Inc.', '2023-11-01', 'Designing a multi-vendor e-commerce platform with a focus on local businesses.', '/images/projects/ecom-platform.png', '/images/og/projects/ecom-platform.png', '{"overview": "...", "challenge": "...", "solution": "...", "results": "..."}', FALSE, 2, now(), now());

-- Seed public.project_tags (linking projects to tags)
INSERT INTO public.project_tags (project_id, tag_id, created_at) VALUES
  ('proj-uuid-wellness', 'tag-uuid-ux', now()),
  ('proj-uuid-wellness', 'tag-uuid-dev', now()),
  ('proj-uuid-ecom', 'tag-uuid-ux', now());

-- Seed public.project_services (linking projects to services)
INSERT INTO public.project_services (project_id, service_id, created_at) VALUES
  ('proj-uuid-wellness', 'svc-uuid-audit', now()),
  ('proj-uuid-wellness', 'svc-uuid-design', now());

-- Seed public.posts
INSERT INTO public.posts (id, slug, title, excerpt, content, featured_image_url, og_image_url, status, published_at, author_id, featured, created_at, updated_at) VALUES
  ('post-uuid-ux-trends', 'ux-trends-2025', 'Top UX Design Trends in 2025', 'Explore the latest trends shaping user experience design this year.', '{"type": "article", "blocks": [{"type": "paragraph", "data": {"text": "AI in UX is becoming mainstream..."}}]}', '/images/blog/ux-trends.png', '/images/og/blog/ux-trends.png', 'published', now() - interval '1 day', NULL, TRUE, now() - interval '1 day', now()),
  ('post-uuid-dev-tools', 'essential-dev-tools', 'Essential Tools for Modern Web Developers', 'A curated list of tools that can boost your development workflow.', '{"type": "article", "blocks": [{"type": "paragraph", "data": {"text": "VS Code extensions, browser devtools, and more..."}}]}', '/images/blog/dev-tools.png', '/images/og/blog/dev-tools.png', 'published', now() - interval '5 days', NULL, FALSE, now() - interval '5 days', now());

-- Seed public.post_tags (linking posts to tags)
INSERT INTO public.post_tags (post_id, tag_id, created_at) VALUES
  ('post-uuid-ux-trends', 'tag-uuid-ux', now()),
  ('post-uuid-ux-trends', 'tag-uuid-strategy', now()),
  ('post-uuid-dev-tools', 'tag-uuid-dev', now());

-- Seed public.faq_categories
INSERT INTO public.faq_categories (id, name, slug, description, sort_order, created_at, updated_at) VALUES
  ('faqcat-uuid-general', 'General Questions', 'general-questions', 'Common questions about Coriyon’s Studio.', 1, now(), now()),
  ('faqcat-uuid-services', 'Services', 'services', 'Questions related to our service offerings.', 2, now(), now());

-- Seed public.faqs
INSERT INTO public.faqs (id, question, answer, faq_category_id, sort_order, featured, created_at, updated_at) VALUES
  ('faq-uuid-what-services', 'What services do you offer?', '{"blocks": [{"type": "paragraph", "data": {"text": "We offer a range of UX services including UX Audits, Design Systems, Prototyping, and more. Check our services page for details!"}}]}', 'faqcat-uuid-services', 1, TRUE, now(), now()),
  ('faq-uuid-process', 'What is your design process like?', '{"blocks": [{"type": "paragraph", "data": {"text": "Our design process is collaborative and iterative, typically involving discovery, design, prototyping, and testing phases."}}]}', 'faqcat-uuid-general', 2, FALSE, now(), now());

-- Seed public.faq_pages (linking FAQs to pages)
INSERT INTO public.faq_pages (faq_id, page_id, created_at) VALUES
  ('faq-uuid-what-services', 'page-uuid-home', now()),
  ('faq-uuid-what-services', 'page-uuid-services', now()),
  ('faq-uuid-process', 'page-uuid-home', now());

-- Seed public.design_process_steps
INSERT INTO public.design_process_steps (id, title, slug, description, content, icon_id, sort_order, created_at, updated_at) VALUES
  ('dps-uuid-discovery', 'Discovery & Research', 'discovery', 'Understanding your users, business goals, and technical constraints.', '{"objectives": ["Define scope", "User interviews"], "deliverables": ["Research report", "Personas"]}', 'f1e2d3c4-b5a6-9876-5432-10fedcba9876', 1, now(), now()),
  ('dps-uuid-design', 'Design & Prototyping', 'design', 'Crafting user flows, wireframes, and interactive prototypes.', '{"activities": ["Wireframing", "UI Design", "Prototyping"], "tools": ["Figma", "ProtoPie"]}', 'c1d2e3f4-a5b6-c7d8-e9f0-a1b2c3d4e5f6', 2, now(), now());

-- Seed public.ux_problems
INSERT INTO public.ux_problems (id, title, slug, description, content, icon_id, featured, sort_order, created_at, updated_at) VALUES
  ('uxprob-uuid-lowconvert', 'Low Conversion Rates', 'low-conversion-rates', 'Users are visiting but not completing desired actions (e.g., sign-ups, purchases).', '{"symptoms": ["High cart abandonment", "Low CTA clicks"]}', 'd4ad4325-f56b-4cf4-9b10-0003ab4fbd51', TRUE, 1, now(), now());

-- Seed public.ux_solutions
INSERT INTO public.ux_solutions (id, title, slug, description, content, icon_id, featured, sort_order, created_at, updated_at) VALUES
  ('uxsol-uuid-uxaudit', 'UX Audit & Optimization', 'ux-audit-optimization', 'Identify and fix usability issues to improve key metrics.', '{"benefits": ["Higher conversion", "Better satisfaction"], "process_summary": "Heuristic evaluation, user testing..."}', 'a1b2c3d4-e5f6-7890-1234-56789abcdef0', TRUE, 1, now(), now());

-- Seed public.ux_problem_solutions (linking problems to solutions)
INSERT INTO public.ux_problem_solutions (ux_problem_id, ux_solution_id, created_at) VALUES
  ('uxprob-uuid-lowconvert', 'uxsol-uuid-uxaudit', now());

-- Seed public.ux_problem_pages (linking problems to pages)
INSERT INTO public.ux_problem_pages (ux_problem_id, page_id, created_at) VALUES
  ('uxprob-uuid-lowconvert', 'page-uuid-services', now());

-- Seed public.ux_solution_pages (linking solutions to pages)
INSERT INTO public.ux_solution_pages (ux_solution_id, page_id, created_at) VALUES
  ('uxsol-uuid-uxaudit', 'page-uuid-services', now());
  
-- Seed public.testimonials
INSERT INTO public.testimonials (id, name, role, company_name, avatar_url, quote, project_id, featured, sort_order, created_at, updated_at) VALUES
  ('testi-uuid-john', 'John Doe', 'CEO', 'ExampleCorp', '/images/avatars/john-doe.png', 'This service transformed our user engagement!', 'proj-uuid-wellness', TRUE, 1, now(), now());

-- Seed public.testimonial_services
INSERT INTO public.testimonial_services (testimonial_id, service_id, created_at) VALUES
 ('testi-uuid-john', 'svc-uuid-audit', now());

-- Seed public.contact_submissions
INSERT INTO public.contact_submissions (id, name, email, message, source_page, ip_address, user_agent, user_id, is_read, archived, created_at) VALUES
  (gen_random_uuid(), 'Jane Interested', 'jane@example.com', 'Hello, I would like to inquire about your UX Audit services.', '/contact', '192.168.1.100', 'Mozilla/5.0...', NULL, FALSE, FALSE, now());

-- Seed public.feedback_submissions
INSERT INTO public.feedback_submissions (id, clarity_rating, usefulness_rating, satisfaction_rating, feedback_type, comments, source_url, user_id, email, user_agent, ip_address, is_actioned, archived, created_at) VALUES
  (gen_random_uuid(), 5, 5, 5, 'general', 'Loved the new blog post on UX trends!', '/blog/ux-trends-2025', NULL, 'visitor@example.com', 'Mozilla/5.0...', '192.168.1.101', FALSE, FALSE, now());

-- Add more seed data as needed for all tables...