-- SQL: Table Definitions for Coriyon's Studio

-- pages
create table if not exists pages (
  id uuid primary key,
  slug text unique not null,
  type text not null, -- e.g. main, solution, resource
  title text not null,
  content jsonb,
  meta_title text,
  meta_desc text,
  created_at timestamp default now()
);

-- services
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- projects
create table if not exists projects (
  id uuid primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  featured_img text,
  created_at timestamp default now()
);

-- testimonials
create table if not exists testimonials (
  id uuid primary key,
  name text,
  role text,
  quote text,
  created_at timestamp default now()
);

-- faqs
create table if not exists faqs (
  id uuid primary key,
  question text not null,
  answer text not null,
  category text,
  created_at timestamp default now()
);

-- process_phases
create table if not exists process_phases (
  id uuid primary key,
  slug text unique not null,
  title text not null,
  description text,
  content jsonb,
  created_at timestamp default now()
);

-- quizzes, questions, options
create table if not exists quizzes (
  id uuid primary key,
  title text not null,
  slug text unique not null
);

create table if not exists questions (
  id uuid primary key,
  quiz_id uuid references quizzes(id),
  text text not null
);

create table if not exists options (
  id uuid primary key,
  question_id uuid references questions(id),
  text text not null,
  is_correct boolean default false
);

-- contact_submissions
create table if not exists contact_submissions (
  id uuid primary key,
  name text,
  email text,
  message text,
  created_at timestamp default now()
);

-- feedback
create table if not exists feedback (
  id uuid primary key,
  rating int,
  comment text,
  created_at timestamp default now()
);
