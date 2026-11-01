/**
 * Idempotent DDL for the full Academic Future schema.
 * Mirrors src/db/schema.ts exactly. Safe to run on every deploy/start:
 * uses CREATE TYPE ... EXCEPTION WHEN duplicate_object and CREATE TABLE/INDEX IF NOT EXISTS.
 */
export const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('student','university_admin','platform_admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE university_status AS ENUM ('pending','approved','suspended','rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE sso_type AS ENUM ('password','google'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE join_request_status AS ENUM ('pending','approved','rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE student_status AS ENUM ('active','suspended','graduated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE sync_type AS ENUM ('manual','csv_import','api'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE sync_status AS ENUM ('success','partial','failed'); EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS platform_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  name_en varchar(255),
  code varchar(20) UNIQUE NOT NULL,
  city varchar(120),
  country varchar(120),
  website varchar(255),
  contact_email varchar(255),
  contact_phone varchar(60),
  logo_color varchar(20) DEFAULT '#E4B95B',
  status university_status DEFAULT 'pending' NOT NULL,
  sso_type sso_type DEFAULT 'password' NOT NULL,
  google_domain varchar(255),
  api_key varchar(64) UNIQUE,
  api_secret_hash text,
  founded_year integer,
  students_count integer,
  created_at timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS universities_status_idx ON universities (status);

CREATE TABLE IF NOT EXISTS university_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  name varchar(200) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role varchar(40) DEFAULT 'admin' NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS university_admins_uni_idx ON university_admins (university_id);

CREATE TABLE IF NOT EXISTS join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_name varchar(255) NOT NULL,
  university_name_en varchar(255),
  country varchar(120) NOT NULL,
  city varchar(120),
  website varchar(255),
  contact_name varchar(200) NOT NULL,
  contact_email varchar(255) NOT NULL,
  contact_phone varchar(60),
  students_count integer,
  sso_type sso_type DEFAULT 'password' NOT NULL,
  google_domain varchar(255),
  documents jsonb DEFAULT '[]'::jsonb,
  message text,
  status join_request_status DEFAULT 'pending' NOT NULL,
  review_note text,
  created_at timestamp DEFAULT now() NOT NULL,
  reviewed_at timestamp
);

CREATE TABLE IF NOT EXISTS colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  name varchar(255) NOT NULL,
  name_en varchar(255)
);
CREATE INDEX IF NOT EXISTS colleges_uni_idx ON colleges (university_id);

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  college_id uuid NOT NULL REFERENCES colleges(id) ON DELETE cascade,
  name varchar(255) NOT NULL,
  name_en varchar(255)
);
CREATE INDEX IF NOT EXISTS departments_college_idx ON departments (college_id);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  student_number varchar(40) NOT NULL,
  national_id varchar(40),
  full_name varchar(255) NOT NULL,
  email varchar(255),
  password_hash text NOT NULL,
  college_id uuid REFERENCES colleges(id) ON DELETE set null,
  department_id uuid REFERENCES departments(id) ON DELETE set null,
  level integer DEFAULT 1 NOT NULL,
  gpa numeric(3,2) DEFAULT '0.00',
  total_credits integer DEFAULT 0 NOT NULL,
  status student_status DEFAULT 'active' NOT NULL,
  enrolled_year integer,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS students_uni_number_unique ON students (university_id, student_number);
CREATE INDEX IF NOT EXISTS students_uni_idx ON students (university_id);
CREATE INDEX IF NOT EXISTS students_uni_email_idx ON students (university_id, email);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  department_id uuid REFERENCES departments(id) ON DELETE set null,
  code varchar(30) NOT NULL,
  name varchar(255) NOT NULL,
  instructor varchar(200),
  credit_hours integer DEFAULT 3 NOT NULL,
  level integer DEFAULT 1,
  semester varchar(60) DEFAULT 'الفصل الدراسي الأول'
);
CREATE INDEX IF NOT EXISTS courses_uni_idx ON courses (university_id);

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE cascade,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE cascade,
  semester varchar(60) DEFAULT 'الفصل الدراسي الأول' NOT NULL,
  grade varchar(5),
  score numeric(5,2),
  status varchar(20) DEFAULT 'enrolled' NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_student_course_unique ON enrollments (student_id, course_id);
CREATE INDEX IF NOT EXISTS enrollments_student_idx ON enrollments (student_id);

CREATE TABLE IF NOT EXISTS course_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE cascade,
  day_of_week integer NOT NULL,
  start_time varchar(5) NOT NULL,
  end_time varchar(5) NOT NULL,
  location varchar(120)
);
CREATE INDEX IF NOT EXISTS schedules_course_idx ON course_schedules (course_id);

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  title varchar(255) NOT NULL,
  body text NOT NULL,
  level integer,
  pinned boolean DEFAULT false NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS announcements_uni_idx ON announcements (university_id);

CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE cascade,
  type sync_type NOT NULL,
  action varchar(140) NOT NULL,
  records_count integer DEFAULT 0 NOT NULL,
  status sync_status NOT NULL,
  message text,
  created_at timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS sync_uni_idx ON sync_logs (university_id);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token varchar(128) UNIQUE NOT NULL,
  role user_role NOT NULL,
  user_id uuid NOT NULL,
  university_id uuid,
  expires_at timestamp NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions (token);
`;
