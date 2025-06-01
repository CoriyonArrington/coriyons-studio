-- Updated Seed data for public.services
-- Includes Core Services (as 'INDIVIDUAL') and Bundled Packages (as 'BUNDLE')
-- Uses valid UUIDs for all 'id' columns.

-- Optional: Clear existing services data (Run this if you want a clean slate for services)
-- DELETE FROM public.services;

-- Core Services (Type: INDIVIDUAL)
INSERT INTO public.services (id, slug, title, description, content, offering_type, featured_image_url, featured, sort_order, created_at, updated_at) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'user-research', 'User Research', '24-hour mini-study: top 3 insights + 15-min strategy call.',
  '{
    "price": "$997",
    "what_you_get": "24-hour mini-study: top 3 insights + 15-min strategy call",
    "turnaround": "24 hours",
    "capacity": "10 slots/month",
    "guarantee": "At least 3 actionable findings or we’ll add 2 extra interviews at no cost",
    "cta_text": "Book User Research Now",
    "cta_link": "#"
  }',
  'INDIVIDUAL', '/images/seed/services/user-research.png', TRUE, 10, NOW(), NOW()),

  ('79c3e188-989f-4a7d-910e-156391607c47', 'usability-testing', 'Usability Testing', '48-hour test of a critical flow (5 users) + annotated video highlights + heatmap report.',
  '{
    "price": "$1,199",
    "what_you_get": "48-hour test of a critical flow (5 users) + annotated video highlights + heatmap report",
    "turnaround": "48 hours",
    "capacity": "8 rounds/month",
    "guarantee": "20% improvement in success rate or we retest free",
    "cta_text": "Book Usability Testing Now",
    "cta_link": "#"
  }',
  'INDIVIDUAL', '/images/seed/services/usability-testing.png', TRUE, 20, NOW(), NOW()),

  ('bcaf8f9b-14a1-4d67-9f2b-1a7a6f0d8e7f', 'ux-audit', 'UX Audit', '5-point expert review + Rapid Fix Guide PDF + 15-min follow-up call.',
  '{
    "price": "$1,499",
    "what_you_get": "5-point expert review + Rapid Fix Guide PDF + 15-min follow-up call",
    "turnaround": "72 hours",
    "capacity": "8 audits/month",
    "guarantee": "Implement our top 3 fixes; if metrics don’t improve by 15%, we’ll add 2 more suggestions at no charge",
    "cta_text": "Book UX Audit Now",
    "cta_link": "#"
  }',
  'INDIVIDUAL', '/images/seed/services/ux-audit.png', TRUE, 30, NOW(), NOW()),

  ('d1b9f8f1-7c3f-4f0a-aa1e-7f3c8c6b1b3a', 'clickable-prototype', 'Clickable Prototype', 'Single-flow interactive Figma prototype + flowchart diagram + testing script for 3 users.',
  '{
    "price": "$1,999",
    "what_you_get": "Single-flow interactive Figma prototype + flowchart diagram + testing script for 3 users",
    "turnaround": "5 days",
    "capacity": "6 prototypes/month",
    "guarantee": "If baseline usability goals aren’t met, we’ll iterate once at no cost",
    "cta_text": "Book Clickable Prototype Now",
    "cta_link": "#"
  }',
  'INDIVIDUAL', '/images/seed/services/clickable-prototype.png', TRUE, 40, NOW(), NOW()),

  ('e8a0c7d8-4b3a-4c1e-9f0a-1b2c3d4e5f6a', 'ai-rapid-prototype', 'AI Rapid Prototype', 'AI-assisted no-code demo on Supabase + deployment guide + 1-hour post-deploy support call.',
  '{
    "price": "$2,199",
    "what_you_get": "AI-assisted no-code demo on Supabase + deployment guide + 1-hour post-deploy support call",
    "turnaround": "5 days",
    "capacity": "4 sprints/quarter",
    "guarantee": "Fully deployable or we’ll fix any issues at no charge",
    "cta_text": "Book AI Rapid Prototype Now",
    "cta_link": "#"
  }',
  'INDIVIDUAL', '/images/seed/services/ai-prototype.png', TRUE, 50, NOW(), NOW()),

  ('9f8c7b6a-5d4e-3c2b-1a0f-9e8d7c6b5a4d', 'strategy-sprint', 'Strategy Sprint', 'Research (2 interviews) + prototype + 30-min strategy call + bonus “10% off” coupon for next project.',
  '{
    "price": "$2,499",
    "what_you_get": "Research (2 interviews) + prototype + 30-min strategy call + bonus “10% off” coupon for next project",
    "turnaround": "72 hours",
    "capacity": "5 sprints/month",
    "guarantee": "75% prototype success rate or we’ll refine + retest for free",
    "cta_text": "Book Strategy Sprint Now",
    "cta_link": "#"
  }',
  'INDIVIDUAL', '/images/seed/services/strategy-sprint.png', TRUE, 60, NOW(), NOW());

-- Bundled Packages (Type: BUNDLE)
INSERT INTO public.services (id, slug, title, description, content, offering_type, featured_image_url, featured, sort_order, created_at, updated_at) VALUES
  ('029c7d28-b291-4b9b-8126-5f89a7b3f4e9', 'kickstart-bundle', '🚀 Kickstart Bundle', 'Includes: User Research + Clickable Prototype. Perfect for: Solo practitioners or small clinics needing a rapid test of their most critical flow.',
  '{
    "price": "$2,199",
    "includes_summary": "User Research + Clickable Prototype",
    "perfect_for": "Solo practitioners or small clinics needing a rapid test of their most critical flow",
    "use_cases": [
      "Validate your online booking or scheduling flow before development",
      "Test a new patient intake process on live users",
      "Preview key changes to your patient portal with real-user feedback"
    ],
    "savings_summary": "Individual Cost: $2,996 → You Save $797",
    "cta_text": "Book Kickstart Bundle Now",
    "cta_link": "#kickstart-bundle"
  }',
  'BUNDLE', '/images/seed/bundles/kickstart.png', TRUE, 1, NOW(), NOW()),

  ('a1b9d8f2-3c4e-5a6b-7c8d-9e0f1a2b3c4d', 'momentum-bundle', '🌱 Momentum Bundle', 'Includes: Usability Testing + UX Audit + Clickable Prototype. Perfect for: Medium-sized practices or teams revamping multiple user journeys.',
  '{
    "price": "$3,499",
    "includes_summary": "Usability Testing + UX Audit + Clickable Prototype",
    "perfect_for": "Medium-sized practices or teams revamping multiple user journeys",
    "use_cases": [
      "Audit + prototype both booking and intake flows to reduce drop-offs",
      "Identify friction in your patient portal and test fixes in one cycle",
      "Baseline usability across two core workflows and prioritize improvements"
    ],
    "savings_summary": "Individual Cost: $4,697 → You Save $1,198",
    "cta_text": "Book Momentum Bundle Now",
    "cta_link": "#momentum-bundle"
  }',
  'BUNDLE', '/images/seed/bundles/momentum.png', TRUE, 2, NOW(), NOW()),

  ('c3d9e0f1-a2b3-4c5d-6e7f-8a9b0c1d2e3f', 'elevate-bundle', '🏆 Elevate Bundle', 'Includes: AI Rapid Prototype + Strategy Sprint. Perfect for: Digital health startups or clinics launching a full MVP with strategic support.',
  '{
    "price": "$4,999",
    "includes_summary": "AI Rapid Prototype + Strategy Sprint",
    "perfect_for": "Digital health startups or clinics launching a full MVP with strategic support",
    "use_cases": [
      "Launch an AI-driven demo for investor pitches and stakeholder buy-in",
      "Prototype advanced features (e.g., telehealth flow) and gather quick feedback",
      "Map out a UX roadmap for your upcoming product launch or major redesign"
    ],
    "value_summary": "Individual items cost $4,698. This bundle includes a bonus 30-min extra strategy call (worth $300). Total value gain: approx $299.",
    "cta_text": "Book Elevate Bundle Now",
    "cta_link": "#elevate-bundle"
  }',
  'BUNDLE', '/images/seed/bundles/elevate.png', TRUE, 3, NOW(), NOW());