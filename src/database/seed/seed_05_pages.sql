-- Seed data for public.pages
-- Corrected version with valid UUIDs for the 'id' column.
-- User IDs are NULL as we don't have a users/profiles seed yet.
-- Assumes ENUM types page_type_enum and page_status_enum are created,
-- and the pages table structure is correct.

-- Optional: Clear existing pages data
-- DELETE FROM public.pages;

INSERT INTO public.pages (id, slug, title, page_type, content, meta_description, og_image_url, status, published_at, user_id, sort_order, created_at, updated_at) VALUES
  ('0192f9a5-2c07-4439-883a-321d6607021c', 'home', 'Minneapolis Digital Health UX Studio | Patient-First UX for Clinics & Startups', 'MAIN',
  '{
    "hero_section": {
      "headline": "Bad UX Drives Patients Away. We Fix That in Days.",
      "subheadline": "As Minneapolis’s Digital Health UX Studio, we help clinics and health-tech startups turn confusing booking flows and portals into patient-approved experiences—quickly, affordably, and with a guarantee.",
      "cta": {"text": "→ Book a Free 20-Minute Consult", "href": "/contact?reason=free-consult"}
    },
    "why_our_studio_section": {
      "headline": "A Great App Isn’t Enough—Users Need to Love It.",
      "body_paragraphs": [
        "Most patients don’t leave because your service lacks features. They leave because booking, intake, or portal flows feel clunky, confusing, or downright frustrating. In Minneapolis, where patients expect seamless digital care, outdated UX means no-shows, frustrated staff, and lost revenue.",
        "At our Digital Health UX Studio, we specialize in designing experiences that feel effortless, familiar, and human—so your users stay longer, come back often, and actually complete the tasks you need. From solo practitioners to enterprise health-tech teams, we’ve helped MSP brands simplify digital health, reduce no-shows, and boost engagement with empathy and clarity."
      ],
      "cta": {"text": "→ See How We Can Help", "href": "/services"}
    },
    "testimonials_section": {
      "headline": "What Minneapolis Clinics & Startups Say",
      "items": [
        {"quote": "Their 48-hour mini-audit uncovered issues we didn’t even notice—our no-shows dropped by 30% in a week.", "author": "Dr. Patel, Uptown Family Practice"},
        {"quote": "With their AI-powered prototype, we had a working demo in days—investors were impressed, and we closed our seed round.", "author": "Sara M., Health-Tech Founder"},
        {"quote": "The Momentum Bundle’s usability tests and prototype clarified our portal’s pain points—and our patient satisfaction soared.", "author": "Jamie K., Minneapolis Therapy Center"}
      ]
    },
    "services_section": {
      "headline": "You’re Building Health Experiences, Not Just Features.",
      "body_intro_paragraphs": [
        "A slick interface alone won’t keep patients engaged. At Minneapolis Digital Health UX Studio, we combine strategy, research, and rapid prototyping to make sure your digital health product—or clinic portal—works beautifully before it even launches.",
        "Whether you’re a solo practitioner or an in-house product team, here’s how we start:"
      ],
      "cta": {"text": "→ Explore Our Services", "href": "/services"}
    },
    "process_section": {
      "headline": "Design Shouldn’t Feel Like a Black Box.",
      "body_intro_paragraph": "Too often, UX happens behind closed doors—leaving you uncertain about what’s next. That slows down teams and wastes time. As your Minneapolis UX partner, we keep the process collaborative and transparent:",
      "steps": [
        {"title": "1. Discover", "description": "We start with user research or audit to pinpoint pain points."},
        {"title": "2. Prototype", "description": "In days, we deliver a clickable demo you can test with real users."},
        {"title": "3. Validate", "description": "We measure success, iterate if needed, and prepare for handoff."},
        {"title": "4. Launch", "description": "You deploy a patient-approved experience that reduces no-shows."},
        {"title": "5. Optimize", "description": "Ongoing workshops or retainers help you refine KPIs over time."}
      ],
      "body_outro_paragraph": "Our clients launch faster and align teams across product, engineering, and marketing—because everyone sees the “why” and “how” in real time.",
      "cta": {"text": "→ Learn How We Work", "href": "/process"}
    },
    "case_studies_section": {
      "headline": "Real Results from Real Digital Health Projects.",
      "body_intro_paragraph": "UX isn’t just about pretty screens; it’s about measurable outcomes. Browse our Minneapolis case studies to see before, after, and why UX strategy and thoughtful design helped these practices thrive:",
      "examples": [
        {"summary": "Uptown Family Practice: 30% drop in no-shows after our Quick UX Snapshot and prototype rollout."},
        {"summary": "Twin Cities Therapy Center: 45% increase in portal completions following Momentum Bundle."},
        {"summary": "Health-Tech Startup: Secured seed funding after our AI Rapid Prototype impressed investors."}
      ],
      "body_outro_paragraph": "Each story highlights our clear process, empathetic research, and quantifiable impact.",
      "cta": {"text": "→ Explore Our Work", "href": "/work"}
    },
    "about_section": {
      "headline": "Design That Puts Patients First—Always.",
      "body_intro_paragraph": "Too many digital health products are built without enough input from the people who use them—resulting in clunky UX, messy interfaces, and frustrated users. I founded this UX studio in Minneapolis to change that:",
      "points": [
        "Empathy-Driven: Every design starts with real interviews and testing with local patients.",
        "Local Expertise: I’ve worked with clinics, wellness brands, and health-tech startups here in MSP for 10+ years.",
        "Collaborative Spirit: We partner closely with your team—no silos, no surprises."
      ],
      "body_outro_paragraph": "My mission is simple: create digital health experiences that feel effortless, human, and aligned with your business goals—so patients stay longer and come back often.",
      "cta": {"text": "→ Get to Know Me", "href": "/about"}
    },
    "final_cta_section": {
      "headline": "Let’s Build Something Meaningful Together.",
      "body_paragraph": "Your patients deserve a seamless experience, and you deserve a UX partner in Minneapolis who listens. Let’s simplify what’s not working—so you can launch solutions that truly help. I’ll bring the process, the pixels, and the strategy. You bring your vision for healthier, happier patients.",
      "ctas": [
        {"text": "→ Book a Free 20-Minute Consult", "href": "/contact?reason=consult"},
        {"text": "→ Start a Project", "href": "/contact?reason=new-project"}
      ]
    }
  }',
  'Fast, guaranteed UX solutions for Minneapolis clinics and health-tech founders. From rapid audits to AI-powered prototypes, we make digital health experiences easier to use and love.',
  '/images/seed/og/home-og.png', 'PUBLISHED', NOW(), NULL, 1, NOW(), NOW()),

  ('b9c0f3e6-7d8a-4f5b-9c1d-8e7f6a5b4c3d', 'about', 'About Me – Coriyon’s Studio', 'MAIN',
  '{
    "hero": {"headline": "About Coriyon Arrington"},
    "bio_section": {"title": "My Journey into UX", "text": "A passionate designer and developer dedicated to crafting user-centered experiences..."},
    "philosophy_section": {"title": "Design Philosophy", "text": "Simplicity, clarity, and empathy are at the core of my work."}
  }',
  'Learn about Coriyon Arrington, the founder of Coriyon’s Studio, and my passion for creating impactful user experiences.',
  '/images/seed/og/about-og.png', 'PUBLISHED', NOW(), NULL, 2, NOW(), NOW()),

  ('c8d1e2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f', 'contact', 'Contact – Coriyon’s Studio', 'MAIN',
  '{
    "hero": {"headline": "Let''s Connect"},
    "form_intro": "Have a project in mind or just want to say hi? Fill out the form below.",
    "contact_details": {"email": "hello@coriyons.studio", "phone": "555-123-4567"}
  }',
  'Get in touch with Coriyon’s Studio to discuss your UX design or development project, or for a consultation.',
  '/images/seed/og/contact-og.png', 'PUBLISHED', NOW(), NULL, 5, NOW(), NOW()),

  ('d7e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', 'services', 'UX & Design Services – Coriyon’s Studio', 'CONTENT_HUB',
  '{
    "hero": {"headline": "Our Services"},
    "intro_text": "Discover how our specialized UX and design services can help your business succeed by solving real user problems and achieving tangible results.",
    "services_display_config": {"layout": "card_grid"}
  }',
  'Explore the comprehensive UX design, research, development, and strategy services offered by Coriyon’s Studio.',
  '/images/seed/og/services-hub-og.png', 'PUBLISHED', NOW(), NULL, 3, NOW(), NOW()),

  ('e6f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'work', 'Portfolio & Case Studies – Coriyon’s Studio', 'CONTENT_HUB',
  '{
    "hero": {"headline": "Our Work"},
    "intro_text": "Browse through a selection of our recent projects and case studies that showcase our approach to creating impactful user experiences.",
    "projects_display_config": {"layout": "masonry_grid", "filter_by_tag": true}
  }',
  'View the portfolio of Coriyon’s Studio, showcasing successful UX design projects and case studies across various industries.',
  '/images/seed/og/work-hub-og.png', 'PUBLISHED', NOW(), NULL, 4, NOW(), NOW()),

  ('f5a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'privacy-policy', 'Privacy Policy – Coriyon’s Studio', 'LEGAL',
  '{
    "document_title": "Privacy Policy",
    "last_updated_date": "2025-06-01",
    "sections": [
      {"heading": "1. Introduction", "content_md": "Welcome to Coriyon’s Studio..."},
      {"heading": "2. Information We Collect", "content_md": "We may collect personal identification information..."},
      {"heading": "3. How We Use Your Information", "content_md": "To personalize user experience, improve our site..."}
    ]
  }',
  'Read the Privacy Policy for Coriyon’s Studio to understand how we collect, use, and protect your personal information.',
  '/images/seed/og/privacy-og.png', 'PUBLISHED', NOW(), NULL, 100, NOW(), NOW());

-- Add more pages as needed