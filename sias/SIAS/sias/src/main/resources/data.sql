INSERT INTO classification (name)
VALUES ('Freshman'), ('Transferee'), ('Returnee')
ON CONFLICT (name) DO NOTHING;

-- For your course table
INSERT INTO course (course_code, course_name, slots_available)
VALUES
  ('BSCS', 'Bachelor of Science in Computer Science', 50),
  ('BSIT', 'Bachelor of Science in Information Technology', 50)
ON CONFLICT (course_code) DO NOTHING;

