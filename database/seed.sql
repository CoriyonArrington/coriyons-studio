-- SQL: Sample Seed Data for Coriyon’s Studio

insert into pages (id, slug, type, title, content) values
  (gen_random_uuid(), 'about', 'main', 'About Coriyon’s Studio', '{}'),
  (gen_random_uuid(), 'contact', 'main', 'Contact Us', '{}'),
  (gen_random_uuid(), 'consulting', 'main', 'Advisory Consulting', '{}');

insert into services (id, slug, title, description, content) values
  (gen_random_uuid(), 'ux-audit', 'UX Audit', 'Evaluate and optimize your product UX', '{}');

insert into projects (id, slug, title, excerpt, content) values
  (gen_random_uuid(), 'sample-project', 'Health App Redesign', 'A wellness app UX revamp', '## Case Study');

insert into faqs (id, question, answer) values
  (gen_random_uuid(), 'What services do you offer?', 'We offer UX audits, prototyping, and more.');

insert into process_phases (id, slug, title, description, content) values
  (gen_random_uuid(), 'discovery', 'Discovery', 'Understand user and business needs.', '{}');
