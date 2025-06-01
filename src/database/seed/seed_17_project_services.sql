-- Seed data for public.project_services
-- Links projects to services.

INSERT INTO public.project_services (id, project_id, service_id, created_at) VALUES
  (gen_random_uuid(), 'proj-uuid-wellness-app', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW()), -- User Research
  (gen_random_uuid(), 'proj-uuid-wellness-app', 'd1b9f8f1-7c3f-4f0a-aa1e-7f3c8c6b1b3a', NOW()), -- Clickable Prototype
  (gen_random_uuid(), 'proj-uuid-saas-platform', 'bcaf8f9b-14a1-4d67-9f2b-1a7a6f0d8e7f', NOW()); -- UX Audit (example)

-- Add more project-service links as needed