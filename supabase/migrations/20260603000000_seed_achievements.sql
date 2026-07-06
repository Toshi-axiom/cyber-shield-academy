-- Seed Achievements Catalog
INSERT INTO public.achievements (id, title, description, icon) VALUES
  ('first-flag', 'First Blood', 'Captured your first cyber training flag.', 'target'),
  ('streak-5', 'Consistent Hacker', 'Maintained a 5-day active hack streak.', 'flame'),
  ('quiz-master', 'Decrypted Mind', 'Scored 100% on any security phase quiz.', 'cpu'),
  ('level-5', 'Elite Agent', 'Reached operative status Level 5.', 'shield'),
  ('curriculum-half', 'Midway Access', 'Decrypted progress in 6 or more phases.', 'trophy')
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon;
