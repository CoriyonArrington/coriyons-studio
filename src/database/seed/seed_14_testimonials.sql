-- Seed data for public.testimonials
-- References public.projects using project_id.

INSERT INTO public.testimonials (id, name, role, company_name, avatar_url, quote, project_id, featured, sort_order, created_at, updated_at) VALUES
  ('testi-uuid-jane-p', 'Jane Porter', 'Head of Product', 'HealthyLife Inc.', '/images/seed/avatars/jane-porter.png', 'Working with Coriyon’s Studio on our wellness app overhaul was a game-changer. The new design is not only beautiful but also incredibly intuitive, and our user engagement metrics have skyrocketed!', 'proj-uuid-wellness-app', TRUE, 10, NOW(), NOW()),
  ('testi-uuid-mark-s', 'Mark Stein', 'CTO', 'Innovate Solutions Ltd.', '/images/seed/avatars/mark-stein.png', 'The design system delivered was top-notch. It has become the backbone of our UI development, enabling us to build faster and more consistently than ever before. Highly recommended!', 'proj-uuid-saas-platform', TRUE, 20, NOW(), NOW()),
  ('testi-uuid-sarah-l', 'Sarah Lee', 'Marketing Manager', 'ShopLocal Inc.', '/images/seed/avatars/sarah-lee.png', 'The UX audit provided invaluable insights that helped us pinpoint exactly where our users were struggling. The recommendations were clear, actionable, and made a real difference to our conversion rates.', NULL, FALSE, 30, NOW(), NOW());

-- Add more testimonials as needed