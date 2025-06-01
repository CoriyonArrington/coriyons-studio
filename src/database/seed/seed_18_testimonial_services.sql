-- Seed data for public.testimonial_services
-- Links testimonials to services.

INSERT INTO public.testimonial_services (id, testimonial_id, service_id, created_at) VALUES
  (gen_random_uuid(), 'testi-uuid-jane-p', 'd1b9f8f1-7c3f-4f0a-aa1e-7f3c8c6b1b3a', NOW()), -- Jane's testimonial for Clickable Prototype
  (gen_random_uuid(), 'testi-uuid-mark-s', 'e8a0c7d8-4b3a-4c1e-9f0a-1b2c3d4e5f6a', NOW()), -- Mark's testimonial for AI Rapid Prototype (example, assuming it was part of their service)
  (gen_random_uuid(), 'testi-uuid-sarah-l', 'bcaf8f9b-14a1-4d67-9f2b-1a7a6f0d8e7f', NOW()); -- Sarah's testimonial for UX Audit service

-- Add more testimonial-service links as needed