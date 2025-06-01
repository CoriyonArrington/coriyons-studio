-- Seed data for public.ux_solution_pages
-- Links UX solutions to pages where they might be showcased or relevant.

INSERT INTO public.ux_solution_pages (id, ux_solution_id, page_id, created_at) VALUES
  (gen_random_uuid(), 'uxsol-uuid-uxaudit', 'd7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', NOW()),           -- UX Audit solution on services page
  (gen_random_uuid(), 'uxsol-uuid-user-research', 'd7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', NOW()),   -- User Research solution on services page
  (gen_random_uuid(), 'uxsol-uuid-uxaudit', '0192f9a5-2c07-4439-883a-321d6607021c', NOW());          -- UX Audit solution also mentioned on home

-- Add more solution-page links as needed