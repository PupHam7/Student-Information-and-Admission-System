-- 1. Create the Master Application table (The central hub)
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    control_no VARCHAR(16) UNIQUE NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_confirmed BOOLEAN DEFAULT FALSE
);

-- 2. Create the Personal Data table
CREATE TABLE applicants (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    name_extension VARCHAR(10),
    date_of_birth DATE NOT NULL,
    sex VARCHAR(10) NOT NULL,
    religion VARCHAR(50),
    civil_status VARCHAR(20) NOT NULL,
    birth_place TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    street VARCHAR(255),
    temp_address TEXT,
    tel_no VARCHAR(20),
    cell_no VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL,
    cultural_group VARCHAR(100),
    indigenous_group VARCHAR(100),
    citizenship VARCHAR(50) NOT NULL
);

-- 3. Create the Family Background table
CREATE TABLE family_backgrounds (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    -- Father's Info
    father_last_name VARCHAR(100),
    father_first_name VARCHAR(100),
    father_middle_name VARCHAR(100),
    father_cp_no VARCHAR(15),
    father_occupation VARCHAR(100),
    father_income VARCHAR(50),
    -- Mother's Info
    mother_last_name VARCHAR(100),
    mother_first_name VARCHAR(100),
    mother_middle_name VARCHAR(100),
    mother_cp_no VARCHAR(15),
    mother_occupation VARCHAR(100),
    mother_income VARCHAR(50),
    -- Guardian Info
    guardian_name VARCHAR(200) NOT NULL,
    guardian_cp_no VARCHAR(15) NOT NULL,
    guardian_relationship VARCHAR(50) NOT NULL
);

-- 4. Create the Admission Data table
CREATE TABLE admission_data (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    admission_for VARCHAR(50) NOT NULL, -- College / Graduate School
    applicant_type VARCHAR(50) NOT NULL, -- Freshman, Transferee, etc.
    incoming_year_level INT NOT NULL,
    lrn VARCHAR(12),
    campus VARCHAR(100) NOT NULL,
    preferred_course_1 VARCHAR(150) NOT NULL,
    preferred_course_2 VARCHAR(150),
    preferred_course_3 VARCHAR(150),
    
    -- High School Fields (Nullable for Transferees)
    hs_school_name VARCHAR(255),
    hs_school_addr TEXT,
    hs_strand VARCHAR(50),
    hs_year_grad VARCHAR(4),
    hs_gwa VARCHAR(10),
    
    -- Last School Fields (Nullable for Freshmen)
    last_school_name VARCHAR(255),
    last_school_addr TEXT,
    last_program VARCHAR(150),
    last_year_attended VARCHAR(10),
    last_year_level VARCHAR(50),
    last_gwa VARCHAR(10)
);