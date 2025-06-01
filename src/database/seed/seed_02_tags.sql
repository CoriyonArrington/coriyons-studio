-- Seed data for public.tags
-- These UUIDs can be referenced by project_tags and post_tags.

INSERT INTO public.tags (id, name, slug, description, created_at, updated_at) VALUES
  ('tag-uuid-ux-design', 'UX Design', 'ux-design', 'Topics related to User Experience Design, research, and strategy.', NOW(), NOW()),
  ('tag-uuid-ui-dev', 'UI Development', 'ui-development', 'Topics related to User Interface Development, frontend technologies, and coding.', NOW(), NOW()),
  ('tag-uuid-casestudy', 'Case Study', 'case-study', 'Detailed project showcases and case studies.', NOW(), NOW()),
  ('tag-uuid-innovation', 'Innovation', 'innovation', 'Content focusing on new ideas, trends, and innovative approaches.', NOW(), NOW()),
  ('tag-uuid-process', 'Design Process', 'design-process', 'Insights and articles about design methodologies and processes.', NOW(), NOW());

-- Add more tags as needed