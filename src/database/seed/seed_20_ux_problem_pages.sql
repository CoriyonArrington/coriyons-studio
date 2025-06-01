-- Seed data for public.ux_problem_pages
-- Links UX problems to pages where they might be discussed or relevant.

INSERT INTO public.ux_problem_pages (id, ux_problem_id, page_id, created_at) VALUES
  (gen_random_uuid(), 'uxprob-uuid-lowconvert', 'd7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', NOW()), -- Low conversion discussed on services page
  (gen_random_uuid(), 'uxprob-uuid-poor-engage', '0192f9a5-2c07-4439-883a-321d6607021c', NOW()), -- Poor engagement mentioned on home
  (gen_random_uuid(), 'uxprob-uuid-nav-issues', 'd7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', NOW());  -- Navigation issues relevant to services

-- Add more problem-page links as needed