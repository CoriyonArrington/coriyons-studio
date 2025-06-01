-- Seed data for public.icons
-- These UUIDs can be referenced by other tables like design_process_steps, ux_problems, ux_solutions.

INSERT INTO public.icons (id, name, description, icon_library, created_at, updated_at) VALUES
  ('d4ad4325-f56b-4cf4-9b10-0003ab4fbd51', 'problem-generic', 'Generic icon for UX problems, like a tangled thread or a question mark.', 'Custom', NOW(), NOW()),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'solution-generic', 'Generic icon for UX solutions, like a lightbulb or a checkmark.', 'Custom', NOW(), NOW()),
  ('c1d2e3f4-a5b6-c7d8-e9f0-a1b2c3d4e5f6', 'palette-color', 'Icon representing color palette or design theming.', 'Heroicons', NOW(), NOW()),
  ('f1e2d3c4-b5a6-9876-5432-10fedcba9876', 'lightbulb-idea', 'Icon representing an idea, innovation, or insight.', 'Heroicons', NOW(), NOW()),
  ('b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6', 'user-profile', 'Icon representing a user profile or account.', 'FeatherIcons', NOW(), NOW()),
  ('e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6', 'chat-bubble', 'Icon representing communication or testimonials.', 'Material Design Icons', NOW(), NOW());

-- Add more icons as needed