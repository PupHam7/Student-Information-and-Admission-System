-- 1. REFERENCE TABLES (No dependencies)
CREATE TABLE classifications (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE course (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    slots_available INTEGER DEFAULT 0
);

CREATE TABLE document_type (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE entrance_exam_schedule (
    id BIGSERIAL PRIMARY KEY,
    exam_date TIMESTAMP NOT NULL,
    venue VARCHAR(100),
    capacity INTEGER
);

-- 2. APPLICANT DATA (The person)
CREATE TABLE applicants (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    contact_no VARCHAR(20),
    birth_place VARCHAR(255),
    citizenship VARCHAR(100),
    civil_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE family_background (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT REFERENCES applicants(id) ON DELETE CASCADE,
    father_name VARCHAR(200),
    mother_name VARCHAR(200),
    guardian_name VARCHAR(200)
);

CREATE TABLE medical_information (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT REFERENCES applicants(id) ON DELETE CASCADE,
    blood_type VARCHAR(5),
    allergies TEXT,
    medical_condition TEXT
);

CREATE TABLE emergency_contact (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT REFERENCES applicants(id) ON DELETE CASCADE,
    full_name VARCHAR(200),
    relationship VARCHAR(50),
    contact_no VARCHAR(20)
);

-- 3. THE APPLICATION PROCESS (The request)
CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    control_no VARCHAR(50) UNIQUE NOT NULL,
    applicant_id BIGINT REFERENCES applicants(id),
    classification_id BIGINT REFERENCES classifications(id),
    status VARCHAR(50) DEFAULT 'PENDING',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_choice (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT REFERENCES applications(id),
    course_id BIGINT REFERENCES course(id),
    priority INTEGER NOT NULL
);

CREATE TABLE uploaded_document (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT REFERENCES applications(id),
    document_type_id BIGINT REFERENCES document_type(id),
    file_path VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE entrance_exam_results (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT REFERENCES applications(id),
    score DECIMAL(5,2),
    remarks VARCHAR(100)
);

-- 4. POST-ADMISSION (Student records)
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT REFERENCES applicants(id),
    student_no VARCHAR(20) UNIQUE,
    enrollment_status VARCHAR(50)
);

CREATE TABLE enrollment (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    academic_year VARCHAR(20),
    semester VARCHAR(20),
    enrollment_date DATE
);

CREATE TABLE student_account (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- SEED DATA (Critical for Postman)
INSERT INTO classifications (name) VALUES ('Freshman'), ('Transferee'), ('Returnee');
INSERT INTO course (course_code, course_name, slots_available) 
VALUES ('BSCS', 'Bachelor of Science in Computer Science', 50),
       ('BSIT', 'Bachelor of Science in Information Technology', 50);