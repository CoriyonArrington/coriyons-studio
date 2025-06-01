-- Seed data for public.contact_submissions
-- User IDs are NULL. ip_address and user_agent are illustrative.

INSERT INTO public.contact_submissions (id, name, email, message, source_page, ip_address, user_agent, user_id, is_read, archived, created_at) VALUES
  (gen_random_uuid(), 'Alice Interested', 'alice@example.com', 'I''d love to learn more about your Design Systems service for my startup. Can we schedule a brief chat?', '/services/design-systems', '192.0.2.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36', NULL, FALSE, FALSE, NOW() - interval '2 days'),
  (gen_random_uuid(), 'Bob Question', 'bob@example.org', 'Just had a quick question about the UX audit process. What''s the typical turnaround time?', '/contact', '203.0.113.45', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15', NULL, TRUE, FALSE, NOW() - interval '1 day');

-- Add more contact submissions as needed