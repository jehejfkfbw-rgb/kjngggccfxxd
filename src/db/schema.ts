import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
  boolean,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";

/* ---------------------------------- Enums --------------------------------- */

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "university_admin",
  "platform_admin",
]);

export const universityStatusEnum = pgEnum("university_status", [
  "pending",
  "approved",
  "suspended",
  "rejected",
]);

export const ssoTypeEnum = pgEnum("sso_type", ["password", "google"]);

export const joinRequestStatusEnum = pgEnum("join_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const studentStatusEnum = pgEnum("student_status", [
  "active",
  "suspended",
  "graduated",
]);

export const syncTypeEnum = pgEnum("sync_type", ["manual", "csv_import", "api"]);

export const syncStatusEnum = pgEnum("sync_status", [
  "success",
  "partial",
  "failed",
]);

/* ------------------------------ Platform admin ---------------------------- */

export const platformAdmins = pgTable("platform_admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------- Universities ----------------------------- */

export const universities = pgTable(
  "universities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    nameEn: varchar("name_en", { length: 255 }),
    code: varchar("code", { length: 20 }).notNull().unique(),
    city: varchar("city", { length: 120 }),
    country: varchar("country", { length: 120 }),
    website: varchar("website", { length: 255 }),
    contactEmail: varchar("contact_email", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 60 }),
    logoColor: varchar("logo_color", { length: 20 }).default("#E4B95B"),
    status: universityStatusEnum("status").default("pending").notNull(),
    ssoType: ssoTypeEnum("sso_type").default("password").notNull(),
    googleDomain: varchar("google_domain", { length: 255 }),
    apiKey: varchar("api_key", { length: 64 }).unique(),
    apiSecretHash: text("api_secret_hash"),
    foundedYear: integer("founded_year"),
    studentsCount: integer("students_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("universities_status_idx").on(t.status)]
);

export const universityAdmins = pgTable(
  "university_admins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: varchar("role", { length: 40 }).default("admin").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("university_admins_uni_idx").on(t.universityId)]
);

/* ------------------------------ Join requests ----------------------------- */

export type JoinDocument = { name: string; size?: string };

export const joinRequests = pgTable("join_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  universityName: varchar("university_name", { length: 255 }).notNull(),
  universityNameEn: varchar("university_name_en", { length: 255 }),
  country: varchar("country", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }),
  website: varchar("website", { length: 255 }),
  contactName: varchar("contact_name", { length: 200 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 60 }),
  studentsCount: integer("students_count"),
  ssoType: ssoTypeEnum("sso_type").default("password").notNull(),
  googleDomain: varchar("google_domain", { length: 255 }),
  documents: jsonb("documents").$type<JoinDocument[]>().default([]),
  message: text("message"),
  status: joinRequestStatusEnum("status").default("pending").notNull(),
  reviewNote: text("review_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

/* --------------------------- Academic structure --------------------------- */

export const colleges = pgTable(
  "colleges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    nameEn: varchar("name_en", { length: 255 }),
  },
  (t) => [index("colleges_uni_idx").on(t.universityId)]
);

export const departments = pgTable(
  "departments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    nameEn: varchar("name_en", { length: 255 }),
  },
  (t) => [index("departments_college_idx").on(t.collegeId)]
);

/* --------------------------------- Students ------------------------------- */

export const students = pgTable(
  "students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    studentNumber: varchar("student_number", { length: 40 }).notNull(),
    nationalId: varchar("national_id", { length: 40 }),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    passwordHash: text("password_hash").notNull(),
    collegeId: uuid("college_id").references(() => colleges.id, {
      onDelete: "set null",
    }),
    departmentId: uuid("department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    level: integer("level").default(1).notNull(),
    gpa: numeric("gpa", { precision: 3, scale: 2 }).default("0.00"),
    totalCredits: integer("total_credits").default(0).notNull(),
    status: studentStatusEnum("status").default("active").notNull(),
    enrolledYear: integer("enrolled_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("students_uni_number_unique").on(t.universityId, t.studentNumber),
    index("students_uni_idx").on(t.universityId),
    index("students_uni_email_idx").on(t.universityId, t.email),
  ]
);

/* ------------------------------- Courses ---------------------------------- */

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    departmentId: uuid("department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    code: varchar("code", { length: 30 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    instructor: varchar("instructor", { length: 200 }),
    creditHours: integer("credit_hours").default(3).notNull(),
    level: integer("level").default(1),
    semester: varchar("semester", { length: 60 }).default("الفصل الدراسي الأول"),
  },
  (t) => [index("courses_uni_idx").on(t.universityId)]
);

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    semester: varchar("semester", { length: 60 })
      .default("الفصل الدراسي الأول")
      .notNull(),
    grade: varchar("grade", { length: 5 }),
    score: numeric("score", { precision: 5, scale: 2 }),
    status: varchar("status", { length: 20 }).default("enrolled").notNull(),
  },
  (t) => [
    uniqueIndex("enrollments_student_course_unique").on(t.studentId, t.courseId),
    index("enrollments_student_idx").on(t.studentId),
  ]
);

export const courseSchedules = pgTable(
  "course_schedules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday ... 6 = Saturday
    startTime: varchar("start_time", { length: 5 }).notNull(),
    endTime: varchar("end_time", { length: 5 }).notNull(),
    location: varchar("location", { length: 120 }),
  },
  (t) => [index("schedules_course_idx").on(t.courseId)]
);

/* ------------------------------ Announcements ----------------------------- */

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    level: integer("level"), // null = all levels
    pinned: boolean("pinned").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("announcements_uni_idx").on(t.universityId)]
);

/* -------------------------------- Sync logs ------------------------------- */

export const syncLogs = pgTable(
  "sync_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    type: syncTypeEnum("type").notNull(),
    action: varchar("action", { length: 140 }).notNull(),
    recordsCount: integer("records_count").default(0).notNull(),
    status: syncStatusEnum("status").notNull(),
    message: text("message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("sync_uni_idx").on(t.universityId)]
);

/* -------------------------------- Sessions -------------------------------- */

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    token: varchar("token", { length: 128 }).notNull().unique(),
    role: userRoleEnum("role").notNull(),
    userId: uuid("user_id").notNull(),
    universityId: uuid("university_id"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("sessions_token_idx").on(t.token)]
);

/* --------------------------------- Types ---------------------------------- */

export type University = typeof universities.$inferSelect;
export type Student = typeof students.$inferSelect;
export type College = typeof colleges.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type JoinRequest = typeof joinRequests.$inferSelect;
export type SyncLog = typeof syncLogs.$inferSelect;
export type UniversityAdmin = typeof universityAdmins.$inferSelect;
export type PlatformAdmin = typeof platformAdmins.$inferSelect;
