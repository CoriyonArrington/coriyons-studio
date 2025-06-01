-- Seed data for public.faq_pages
-- Links FAQs to pages.

INSERT INTO public.faq_pages (id, faq_id, page_id, created_at) VALUES
  (gen_random_uuid(), 'faq-uuid-what-services', '0192f9a5-2c07-4439-883a-321d6607021c', NOW()), -- Home page
  (gen_random_uuid(), 'faq-uuid-what-services', 'd7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', NOW()), -- Services Hub page
  (gen_random_uuid(), 'faq-uuid-process-detail', '0192f9a5-2c07-4439-883a-321d6607021c', NOW()), -- Home page
  (gen_random_uuid(), 'faq-uuid-process-detail', 'b9c0f3e6-7d8a-4f5b-9c1d-8e7f6a5b4c3d', NOW()), -- About page
  (gen_random_uuid(), 'faq-uuid-cost', 'd7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', NOW()), -- Services Hub page
  (gen_random_uuid(), 'faq-uuid-timeline', 'd7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', NOW()); -- Services Hub page

-- Add more faq-page links as needed