-- Seed data for public.ux_problem_solutions
-- Links UX problems to UX solutions that address them.

INSERT INTO public.ux_problem_solutions (id, ux_problem_id, ux_solution_id, created_at) VALUES
  (gen_random_uuid(), 'uxprob-uuid-lowconvert', 'uxsol-uuid-uxaudit', NOW()),
  (gen_random_uuid(), 'uxprob-uuid-poor-engage', 'uxsol-uuid-user-research', NOW()),
  (gen_random_uuid(), 'uxprob-uuid-poor-engage', 'uxsol-uuid-uxaudit', NOW()),
  (gen_random_uuid(), 'uxprob-uuid-nav-issues', 'uxsol-uuid-ia-wireframing', NOW()),
  (gen_random_uuid(), 'uxprob-uuid-nav-issues', 'uxsol-uuid-uxaudit', NOW());

-- Add more problem-solution links as needed