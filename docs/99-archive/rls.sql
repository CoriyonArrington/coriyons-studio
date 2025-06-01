-- SQL: RLS Policies for Coriyon’s Studio

-- Enable RLS on all public-facing and CMS tables
alter table pages enable row level security;
alter table services enable row level security;
alter table projects enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table process_phases enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table options enable row level security;
alter table contact_submissions enable row level security;
alter table feedback enable row level security;

-- Public read access policies
create policy "Public: read" on pages for select using (true);
create policy "Public: read" on services for select using (true);
create policy "Public: read" on projects for select using (true);
create policy "Public: read" on testimonials for select using (true);
create policy "Public: read" on faqs for select using (true);
create policy "Public: read" on process_phases for select using (true);
create policy "Public: read" on quizzes for select using (true);
create policy "Public: read" on questions for select using (true);
create policy "Public: read" on options for select using (true);

-- Public insert policies for forms
create policy "Anyone can submit contact" on contact_submissions for insert using (true);
create policy "Anyone can submit feedback" on feedback for insert using (true);
