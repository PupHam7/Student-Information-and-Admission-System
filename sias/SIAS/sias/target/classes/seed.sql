-- This file seeds the DB only when tables are empty.
-- It is called manually from DataSeeder.java on first startup.

-- ── SECTIONS ──────────────────────────────────────────────
INSERT INTO sections (period_key, section_id, name, enrolled, capacity) VALUES
  ('1-1','A','BSIT 1A',0,40),
  ('1-1','B','BSIT 1B',0,40),
  ('1-2','A','BSIT 1A',0,40),
  ('1-2','B','BSIT 1B',0,40),
  ('2-1','A','BSIT 2A',0,40),
  ('2-1','B','BSIT 2B',0,40),
  ('2-2','A','BSIT 2A',0,40),
  ('2-2','B','BSIT 2B',0,40)
ON CONFLICT (period_key, section_id) DO NOTHING;

-- ── SUBJECTS ──────────────────────────────────────────────
-- Each section has its own distinct schedule (different times, rooms, instructors)

-- ── 1st Year, 1st Semester — Section A (1A1) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('1-1','A','GE1',    'Understanding the Self',          3,'Mon/Wed','08:00','09:30','Room 1',  'M. Enriquez'),
  ('1-1','A','GE2',    'Readings in Philippine History',  3,'Tue/Thu','08:00','09:30','Room 2',  'D. Gerona'),
  ('1-1','A','GE3',    'The Contemporary World',          3,'Mon/Wed','09:30','11:00','Room 3',  'B. Caballero'),
  ('1-1','A','GEE1',   'Peace Studies',                   3,'Tue/Thu','09:30','11:00','Room 4',  'C. Jamer'),
  ('1-1','A','CC1',    'Introduction to Computing',       3,'Mon/Wed','11:00','12:30','Room 5',  'Sa. Briones'),
  ('1-1','A','CC2',    'Computer Programming 1',          3,'Tue/Thu','11:00','12:30','Room 6',  'J. Sabaria')
ON CONFLICT (period_key, section_id, code) DO NOTHING;

-- ── 1st Year, 1st Semester — Section B (1B1) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('1-1','B','GE1',    'Understanding the Self',          3,'Mon/Wed','13:00','14:30','Room 7',  'M. Enriquez'),
  ('1-1','B','GE2',    'Readings in Philippine History',  3,'Tue/Thu','13:00','14:30','Room 8',  'D. Gerona'),
  ('1-1','B','GE3',    'The Contemporary World',          3,'Mon/Wed','14:30','16:00','Room 9',  'B. Caballero'),
  ('1-1','B','GEE1',   'Peace Studies',                   3,'Tue/Thu','14:30','16:00','Room 10', 'C. Jamer'),
  ('1-1','B','CC1',    'Introduction to Computing',       3,'Mon/Wed','16:00','17:30','Room 11', 'Sa. Briones'),
  ('1-1','B','CC2',    'Computer Programming 1',          3,'Tue/Thu','16:00','17:30','Room 12', 'J. Sabaria')
ON CONFLICT (period_key, section_id, code) DO NOTHING;

-- ── 1st Year, 2nd Semester — Section A (1A2) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('1-2','A','GE4',    'Mathematics in the Modern World',              3,'Wed/Fri','08:00','09:30','Room 13', 'I. Consulta'),
  ('1-2','A','GE5',    'Purposive Communication',                      3,'Mon/Thu','08:00','09:30','Room 14', 'K. Paterno'),
  ('1-2','A','GEE2',   'Indigenous Peoples Studies',                   3,'Wed/Fri','09:30','11:00','Room 15', 'D. Plaza'),
  ('1-2','A','MS1',    'Discrete Mathematics',                         3,'Mon/Thu','09:30','11:00','Room 1',  'A. Benitez'),
  ('1-2','A','CC3',    'Computer Programming 2',                       3,'Wed/Fri','11:00','12:30','Room 2',  'J. Sabaria'),
  ('1-2','A','HCI',    'Introduction to Human Computer Interaction',   3,'Mon/Thu','11:00','12:30','Room 3',  'NP. Serrano')
ON CONFLICT (period_key, section_id, code) DO NOTHING;

-- ── 1st Year, 2nd Semester — Section B (1B2) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('1-2','B','GE4',    'Mathematics in the Modern World',              3,'Wed/Fri','13:00','14:30','Room 4',  'I. Consulta'),
  ('1-2','B','GE5',    'Purposive Communication',                      3,'Mon/Thu','13:00','14:30','Room 5',  'K. Paterno'),
  ('1-2','B','GEE2',   'Indigenous Peoples Studies',                   3,'Wed/Fri','14:30','16:00','Room 6',  'D. Plaza'),
  ('1-2','B','MS1',    'Discrete Mathematics',                         3,'Mon/Thu','14:30','16:00','Room 7',  'A. Benitez'),
  ('1-2','B','CC3',    'Computer Programming 2',                       3,'Wed/Fri','16:00','17:30','Room 8',  'J. Sabaria'),
  ('1-2','B','HCI',    'Introduction to Human Computer Interaction',   3,'Mon/Thu','16:00','17:30','Room 9',  'NP. Serrano')
ON CONFLICT (period_key, section_id, code) DO NOTHING;

-- ── 2nd Year, 1st Semester — Section A (2A1) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('2-1','A','GE6',    'Art Appreciation',                    3,'Tue/Fri','08:00','09:30','Room 10', 'SM. Serrano'),
  ('2-1','A','GEE3-C', 'Living in the IT Era',               3,'Mon/Thu','08:00','09:30','Room 11', 'NP. Serrano'),
  ('2-1','A','CC4',    'Data Structures and Algorithms',      3,'Tue/Fri','09:30','11:00','Room 12', 'Sh. Briones'),
  ('2-1','A','PF1',    'Object Oriented Programming',         3,'Mon/Thu','09:30','11:00','Room 13', 'J. Isorena'),
  ('2-1','A','PT1',    'Platform Technologies',               3,'Tue/Fri','11:00','12:30','Room 14', 'F. Penalosa'),
  ('2-1','A','ITP1',   'Open Source',                         3,'Mon/Thu','11:00','12:30','Room 15', 'F. Oliver')
ON CONFLICT (period_key, section_id, code) DO NOTHING;

-- ── 2nd Year, 1st Semester — Section B (2B1) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('2-1','B','GE6',    'Art Appreciation',                    3,'Tue/Fri','13:00','14:30','Room 1',  'SM. Serrano'),
  ('2-1','B','GEE3-C', 'Living in the IT Era',               3,'Mon/Thu','13:00','14:30','Room 2',  'NP. Serrano'),
  ('2-1','B','CC4',    'Data Structures and Algorithms',      3,'Tue/Fri','14:30','16:00','Room 3',  'Sh. Briones'),
  ('2-1','B','PF1',    'Object Oriented Programming',         3,'Mon/Thu','14:30','16:00','Room 4',  'J. Isorena'),
  ('2-1','B','PT1',    'Platform Technologies',               3,'Tue/Fri','16:00','17:30','Room 5',  'F. Penalosa'),
  ('2-1','B','ITP1',   'Open Source',                         3,'Mon/Thu','16:00','17:30','Room 6',  'F. Oliver')
ON CONFLICT (period_key, section_id, code) DO NOTHING;

-- ── 2nd Year, 2nd Semester — Section A (2A2) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('2-2','A','GE8',    'Ethics',                              3,'Wed/Fri','08:00','09:30','Room 7',  'R. Morcilla'),
  ('2-2','A','PF2',    'Event Driven Programming',            3,'Tue/Thu','08:00','09:30','Room 8',  'R. Artiaga'),
  ('2-2','A','CC5',    'Information Management',              3,'Wed/Fri','09:30','11:00','Room 9',  'F. Penalosa'),
  ('2-2','A','NET1',   'Networking 1',                        3,'Tue/Thu','09:30','11:00','Room 10', 'N. Pura'),
  ('2-2','A','MS2',    'Quantitative Methods',                3,'Wed/Fri','11:00','12:30','Room 11', 'H. Pesino'),
  ('2-2','A','SIA1',   'System Integration and Architecture', 3,'Tue/Thu','11:00','12:30','Room 12', 'Sa. Briones')
ON CONFLICT (period_key, section_id, code) DO NOTHING;

-- ── 2nd Year, 2nd Semester — Section B (2B2) ─────────────
INSERT INTO subjects (period_key, section_id, code, name, units, day, time_start, time_end, room, instructor) VALUES
  ('2-2','B','GE8',    'Ethics',                              3,'Wed/Fri','13:00','14:30','Room 13', 'R. Morcilla'),
  ('2-2','B','PF2',    'Event Driven Programming',            3,'Tue/Thu','13:00','14:30','Room 14', 'R. Artiaga'),
  ('2-2','B','CC5',    'Information Management',              3,'Wed/Fri','14:30','16:00','Room 15', 'F. Penalosa'),
  ('2-2','B','NET1',   'Networking 1',                        3,'Tue/Thu','14:30','16:00','Room 1',  'N. Pura'),
  ('2-2','B','MS2',    'Quantitative Methods',                3,'Wed/Fri','16:00','17:30','Room 2',  'H. Pesino'),
  ('2-2','B','SIA1',   'System Integration and Architecture', 3,'Tue/Thu','16:00','17:30','Room 3',  'Sa. Briones')
ON CONFLICT (period_key, section_id, code) DO NOTHING;