-- Seed data for public.project_tags
-- Links projects to tags.

INSERT INTO public.project_tags (id, project_id, tag_id, created_at) VALUES
  (gen_random_uuid(), 'proj-uuid-wellness-app', 'tag-uuid-ux-design', NOW()),
  (gen_random_uuid(), 'proj-uuid-wellness-app', 'tag-uuid-ui-dev', NOW()),
  (gen_random_uuid(), 'proj-uuid-saas-platform', 'tag-uuid-ux-design', NOW()),
  (gen_random_uuid(), 'proj-uuid-saas-platform', 'tag-uuid-process', NOW());

-- Add more project-tag links as needed