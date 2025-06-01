-- Seed data for public.post_tags
-- Links posts to tags.

INSERT INTO public.post_tags (id, post_id, tag_id, created_at) VALUES
  (gen_random_uuid(), 'post-uuid-ux-trends-2025', 'tag-uuid-ux-design', NOW()),
  (gen_random_uuid(), 'post-uuid-ux-trends-2025', 'tag-uuid-innovation', NOW()),
  (gen_random_uuid(), 'post-uuid-ux-trends-2025', 'tag-uuid-strategy', NOW()),
  (gen_random_uuid(), 'post-uuid-accessible-design', 'tag-uuid-ux-design', NOW()),
  (gen_random_uuid(), 'post-uuid-accessible-design', 'tag-uuid-process', NOW());

-- Add more post-tag links as needed