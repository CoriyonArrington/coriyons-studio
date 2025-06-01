-- Seed data for public.feedback_submissions
-- User IDs are NULL. ip_address and user_agent are illustrative.

INSERT INTO public.feedback_submissions (id, clarity_rating, usefulness_rating, satisfaction_rating, feedback_type, comments, source_url, user_id, email, user_agent, ip_address, is_actioned, archived, created_at) VALUES
  (gen_random_uuid(), 5, 5, 5, 'general', 'This website is incredibly well-designed and easy to navigate. Love the project portfolio!', 'https://coriyons.studio/work', NULL, 'happy_visitor@example.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', '198.51.100.22', TRUE, FALSE, NOW() - interval '3 hours'),
  (gen_random_uuid(), 4, 3, 4, 'content_suggestion', 'It would be great to see more detailed blog posts about your design process for specific case studies.', 'https://coriyons.studio/blog', NULL, NULL, 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0', '203.0.113.78', FALSE, FALSE, NOW() - interval '10 hours');

-- Add more feedback submissions as needed