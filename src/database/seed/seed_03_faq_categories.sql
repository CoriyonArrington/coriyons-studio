-- Seed data for public.faq_categories
-- These UUIDs can be referenced by faqs.faq_category_id.

INSERT INTO public.faq_categories (id, name, slug, description, sort_order, created_at, updated_at) VALUES
  ('faqcat-uuid-general', 'General Questions', 'general', 'Frequently asked questions about Coriyon’s Studio and general topics.', 1, NOW(), NOW()),
  ('faqcat-uuid-services', 'Services', 'services', 'Questions related to specific services offered.', 2, NOW(), NOW()),
  ('faqcat-uuid-process', 'Process', 'process', 'Questions about my design and development process.', 3, NOW(), NOW()),
  ('faqcat-uuid-technical', 'Technical', 'technical', 'Technical questions regarding tools, technologies, or implementation details.', 4, NOW(), NOW());

-- Add more FAQ categories as needed