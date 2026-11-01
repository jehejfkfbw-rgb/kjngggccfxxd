import "dotenv/config";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  announcements,
  colleges,
  courses,
  courseSchedules,
  departments,
  enrollments,
  joinRequests,
  platformAdmins,
  sessions,
  students,
  syncLogs,
  universities,
  universityAdmins,
  type University,
} from "./schema";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

const FIRST = ["أحمد", "محمد", "عمر", "خالد", "يوسف", "عبدالله", "زياد", "كريم", "طارق", "حمزة", "سارة", "فاطمة", "نورة", "ليلى", "مريم", "هدى", "سلمى", "ريم", "جنى", "آية"];
const MID = ["عبدالرحمن", "إبراهيم", "حسن", "عصام", "مصطفى", "سامي", "فارس", "هيثم", "بدر", "ماجد"];
const LAST = ["الشريف", "العتيبي", "القحطاني", "الحربي", "المطيري", "الدوسري", "الغامدي", "المالكي", "الزهراني", "الشهري", "السبيعي", "العنزي", "الرشيدي", "النجار", "الخطيب"];
const INSTRUCTORS = ["د. أحمد السيد", "د. منى الحوسني", "د. خالد الأنصاري", "د. رنا العتيق", "د. هشام الجابري", "د. سلوى المهدي", "د. عمر فتوح", "د. إيمان خليفة"];

const SEMESTERS_PAST = ["الفصل الأول 2024/2025", "الفصل الثاني 2024/2025", "الفصل الصيفي 2025"];
const CURRENT_SEMESTER = "الفصل الأول 2025/2026";

const COURSE_TOPICS: Record<string, { code: string; name: string }[]> = {
  cs: [
    { code: "CS101", name: "مقدمة في علوم الحاسب" },
    { code: "CS102", name: "أساسيات البرمجة" },
    { code: "CS201", name: "هياكل البيانات" },
    { code: "CS202", name: "تحليل وتصميم الخوارزميات" },
    { code: "CS301", name: "قواعد البيانات" },
    { code: "CS302", name: "هندسة البرمجيات" },
    { code: "CS401", name: "الذكاء الاصطناعي" },
    { code: "CS402", name: "أمن المعلومات" },
  ],
  it: [
    { code: "IT110", name: "شبكات الحاسب" },
    { code: "IT120", name: "أنظمة التشغيل" },
    { code: "IT210", name: "تطوير تطبيقات الويب" },
    { code: "IT220", name: "إدارة قواعد البيانات" },
    { code: "IT310", name: "الحوسبة السحابية" },
    { code: "IT420", name: "تحليل البيانات الضخمة" },
  ],
  ba: [
    { code: "BA101", name: "مبادئ إدارة الأعمال" },
    { code: "BA102", name: "المحاسبة المالية" },
    { code: "BA201", name: "سلوك تنظيمي" },
    { code: "BA202", name: "إدارة التسويق" },
    { code: "BA301", name: "الإدارة المالية" },
    { code: "BA401", name: "إدارة المشاريع" },
  ],
  eng: [
    { code: "EN101", name: "الرياضيات الهندسية" },
    { code: "EN102", name: "الفيزياء الهندسية" },
    { code: "EN201", name: "ميكانيكا المواد" },
    { code: "EN202", name: "الدوائر الكهربائية" },
    { code: "EN301", name: "الديناميكا الحرارية" },
    { code: "EN401", name: "تصميم الأنظمة الهندسية" },
  ],
  med: [
    { code: "MD101", name: "التشريح البشري" },
    { code: "MD102", name: "علم وظائف الأعضاء" },
    { code: "MD201", name: "الكيمياء الحيوية" },
    { code: "MD301", name: "علم الأدوية" },
  ],
};

export async function seedDatabase() {
  console.log("== Academic Future — seeding ==");

  /* ------------------------------- Clean slate ------------------------------ */
  await db.delete(sessions);
  await db.delete(syncLogs);
  await db.delete(enrollments);
  await db.delete(courseSchedules);
  await db.delete(courses);
  await db.delete(announcements);
  await db.delete(students);
  await db.delete(departments);
  await db.delete(colleges);
  await db.delete(universityAdmins);
  await db.delete(universities);
  await db.delete(joinRequests);
  await db.delete(platformAdmins);

  /* ------------------------------ Platform admin ---------------------------- */
  await db.insert(platformAdmins).values({
    name: "مشغل المنصة",
    email: "admin@academicfuture.io",
    passwordHash: hashPassword("Admin@2026!"),
  });
  console.log("✓ platform admin  admin@academicfuture.io / Admin@2026!");

  /* ------------------------------- Universities ----------------------------- */
  const pwUni = hashPassword("Uni@12345");

  const [fut] = await db
    .insert(universities)
    .values({
      name: "جامعة المستقبل",
      nameEn: "Future University",
      code: "FUT",
      city: "الرياض",
      country: "السعودية",
      website: "https://future.edu.sa",
      contactEmail: "registrar@future.edu.sa",
      contactPhone: "+966112345678",
      logoColor: "#d9ac45",
      status: "approved",
      ssoType: "password",
      apiKey: "afk_demo_future_key_001",
      apiSecretHash: hashPassword("secret-future-demo"),
      foundedYear: 2009,
      studentsCount: 28400,
    })
    .returning();

  const [nust] = await db
    .insert(universities)
    .values({
      name: "جامعة النيل للعلوم والتكنولوجيا",
      nameEn: "Nile University of Science & Technology",
      code: "NUST",
      city: "القاهرة",
      country: "مصر",
      website: "https://nile.edu.eg",
      contactEmail: "admin@nile.edu.eg",
      contactPhone: "+20255550100",
      logoColor: "#4fd1c5",
      status: "approved",
      ssoType: "google",
      googleDomain: "nile.edu.eg",
      apiKey: "afk_demo_nile_key_002",
      apiSecretHash: hashPassword("secret-nile-demo"),
      foundedYear: 2014,
      studentsCount: 12150,
    })
    .returning();

  const [hiu] = await db
    .insert(universities)
    .values({
      name: "جامعة الأفق الدولية",
      nameEn: "Horizon International University",
      code: "HIU",
      city: "دبي",
      country: "الإمارات",
      website: "https://horizon.ac.ae",
      contactEmail: "it@horizon.ac.ae",
      contactPhone: "+97143210099",
      logoColor: "#9f7cfa",
      status: "approved",
      ssoType: "password",
      foundedYear: 2001,
      studentsCount: 19800,
    })
    .returning();

  await db.insert(universityAdmins).values([
    { universityId: fut.id, name: "د. سارة العمري", email: "admin@future.edu.sa", passwordHash: pwUni },
    { universityId: nust.id, name: "م. كريم عبدالعزيز", email: "admin@nile.edu.eg", passwordHash: pwUni },
    { universityId: hiu.id, name: "أ. ليان الحوسني", email: "admin@horizon.ac.ae", passwordHash: pwUni },
  ]);
  console.log("✓ 3 universities + admins (password Uni@12345)");

  /* --------------------------- Structure builder ---------------------------- */

  async function buildStructure(
    uniId: string,
    spec: { name: string; nameEn: string; depts: { name: string; nameEn: string; topic: keyof typeof COURSE_TOPICS }[] }[]
  ) {
    const deptMap: { id: string; name: string; collegeName: string; topic: keyof typeof COURSE_TOPICS }[] = [];
    for (const c of spec) {
      const [college] = await db.insert(colleges).values({ universityId: uniId, name: c.name, nameEn: c.nameEn }).returning();
      for (const d of c.depts) {
        const [dept] = await db
          .insert(departments)
          .values({ universityId: uniId, collegeId: college.id, name: d.name, nameEn: d.nameEn })
          .returning();
        deptMap.push({ id: dept.id, name: dept.name, collegeName: college.name, topic: d.topic });
      }
    }
    return deptMap;
  }

  const futDepts = await buildStructure(fut.id, [
    {
      name: "كلية الحاسبات والمعلومات",
      nameEn: "Faculty of Computers & Information",
      depts: [
        { name: "علوم الحاسب", nameEn: "Computer Science", topic: "cs" },
        { name: "نظم المعلومات", nameEn: "Information Systems", topic: "it" },
      ],
    },
    {
      name: "كلية الهندسة",
      nameEn: "Faculty of Engineering",
      depts: [{ name: "الهندسة الكهربائية", nameEn: "Electrical Engineering", topic: "eng" }],
    },
    {
      name: "كلية إدارة الأعمال",
      nameEn: "Faculty of Business Administration",
      depts: [{ name: "إدارة الأعمال", nameEn: "Business Administration", topic: "ba" }],
    },
  ]);

  const nustDepts = await buildStructure(nust.id, [
    {
      name: "كلية الهندسة والعلوم التطبيقية",
      nameEn: "Faculty of Engineering & Applied Sciences",
      depts: [{ name: "هندسة البرمجيات", nameEn: "Software Engineering", topic: "cs" }],
    },
    {
      name: "كلية العلوم الطبية",
      nameEn: "Faculty of Medical Sciences",
      depts: [{ name: "العلوم الطبية", nameEn: "Medical Sciences", topic: "med" }],
    },
  ]);

  const hiuDepts = await buildStructure(hiu.id, [
    {
      name: "كلية إدارة الأعمال الدولية",
      nameEn: "International Business School",
      depts: [{ name: "الإدارة الدولية", nameEn: "International Management", topic: "ba" }],
    },
  ]);
  console.log("✓ colleges & departments");

  /* ------------------------------- Courses ---------------------------------- */

  type CourseRow = typeof courses.$inferSelect;
  const uniCourses: Record<string, CourseRow[]> = {};

  async function buildCourses(uniId: string, deptSpecs: { id: string; topic: keyof typeof COURSE_TOPICS }[]) {
    const list: CourseRow[] = [];
    for (const ds of deptSpecs) {
      for (const t of COURSE_TOPICS[ds.topic]) {
        const lvl = Math.min(5, parseInt(t.code.match(/\d/)![0]) || 1);
        const [c] = await db
          .insert(courses)
          .values({
            universityId: uniId,
            departmentId: ds.id,
            code: t.code,
            name: t.name,
            instructor: pick(INSTRUCTORS),
            creditHours: pick([2, 3, 3, 4]),
            level: lvl,
            semester: CURRENT_SEMESTER,
          })
          .returning();
        list.push(c);
      }
    }
    uniCourses[uniId] = list;
    return list;
  }

  const futCourses = await buildCourses(fut.id, futDepts.map((d) => ({ id: d.id, topic: d.topic })));
  await buildCourses(nust.id, nustDepts.map((d) => ({ id: d.id, topic: d.topic })));
  await buildCourses(hiu.id, hiuDepts.map((d) => ({ id: d.id, topic: d.topic })));
  console.log("✓ courses");

  /* ------------------------------ Schedules --------------------------------- */

  const locations = ["مدرج 1", "مدرج 3", "معمل الحاسب 2", "قاعة 204", "مدرج ابن خلدون", "قاعة 110"];
  const timeSlots: [string, string][] = [
    ["08:00", "09:30"],
    ["09:45", "11:15"],
    ["11:30", "13:00"],
    ["13:15", "14:45"],
    ["15:00", "16:30"],
  ];

  for (const c of futCourses) {
    const dayA = pick([0, 1, 2, 3]);
    const dayB = dayA === 4 ? 0 : dayA + 1 === 4 ? 2 : dayA + 1;
    const slot = pick(timeSlots);
    const slot2 = pick(timeSlots.filter((s) => s !== slot));
    for (const day of [dayA, dayB]) {
      const ts = day === dayA ? slot : slot2;
      await db.insert(courseSchedules).values({
        universityId: fut.id,
        courseId: c.id,
        dayOfWeek: day,
        startTime: ts[0],
        endTime: ts[1],
        location: pick(locations),
      });
    }
  }
  console.log("✓ schedules");

  /* ------------------------------- Students --------------------------------- */

  function gradeFromScore(score: number): string {
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 75) return "B";
    if (score >= 65) return "C+";
    if (score >= 55) return "C";
    if (score >= 50) return "D";
    return "F";
  }
  function gpaPoints(score: number): number {
    if (score >= 90) return 4.0;
    if (score >= 85) return 3.7;
    if (score >= 75) return 3.3;
    if (score >= 65) return 2.7;
    if (score >= 55) return 2.3;
    if (score >= 50) return 1.7;
    return 0.5;
  }

  const pwStudent = hashPassword("Student@123");

  type DeptSeed = { id: string; name: string; collegeName: string };
  async function seedStudents(
    uni: University,
    depts: DeptSeed[],
    domain: string,
    countPerDept: number[],
    startSeq: number
  ) {
    let seq = startSeq;
    let total = 0;
    for (let di = 0; di < depts.length; di++) {
      const dept = depts[di];
      const deptCourses = (uniCourses[uni.id] ?? []).filter((c) => c.departmentId === dept.id);
      const [collegeRow] = await db.select().from(colleges).where(eq(colleges.name, dept.collegeName)).limit(1);

      for (const level of [1, 2, 3, 4]) {
        const num = countPerDept[level - 1] ?? 3;
        for (let i = 0; i < num; i++) {
          const fullName = `${pick(FIRST)} ${pick(MID)} ${pick(LAST)}`;
          const year = 2026 - level;
          const studentNumber = `${year}${String(seq++).padStart(4, "0")}`;
          const email = `s${studentNumber}@${domain}`;

          const [st] = await db
            .insert(students)
            .values({
              universityId: uni.id,
              studentNumber,
              fullName,
              email,
              nationalId: `29${rand(100000, 999999)}${rand(10000000, 99999999)}`.slice(0, 14),
              passwordHash: pwStudent,
              collegeId: collegeRow?.id ?? null,
              departmentId: dept.id,
              level,
              status: Math.random() < 0.94 ? "active" : "graduated",
              enrolledYear: year,
            })
            .returning();
          total++;

          // Completed courses (past semesters) for levels below the student's level
          const completedPool = deptCourses.filter((c) => (c.level ?? 1) < level);
          let points = 0;
          let hours = 0;
          for (const c of completedPool) {
            const score = rand(58, 99);
            await db.insert(enrollments).values({
              studentId: st.id,
              courseId: c.id,
              semester: pick(SEMESTERS_PAST),
              grade: gradeFromScore(score),
              score: String(score),
              status: "completed",
            });
            points += gpaPoints(score) * c.creditHours;
            hours += c.creditHours;
          }

          // Current semester courses
          const currentPool = deptCourses.filter((c) => (c.level ?? 1) === level);
          for (const c of currentPool) {
            await db.insert(enrollments).values({
              studentId: st.id,
              courseId: c.id,
              semester: CURRENT_SEMESTER,
              status: "enrolled",
            });
          }

          const gpa = hours > 0 ? (points / hours).toFixed(2) : "0.00";
          await db.update(students).set({ gpa, totalCredits: hours }).where(eq(students.id, st.id));
        }
      }
    }
    return total;
  }

  const futCount = await seedStudents(fut, futDepts, "future.edu.sa", [3, 3, 3, 3], 1);
  const nustCount = await seedStudents(nust, nustDepts, "nile.edu.eg", [2, 2, 1, 0], 400);
  const hiuCount = await seedStudents(hiu, hiuDepts, "horizon.ac.ae", [2, 1, 1, 0], 300);
  console.log(`✓ students FUT=${futCount} NUST=${nustCount} HIU=${hiuCount}`);

  await db.update(universities).set({ studentsCount: futCount }).where(eq(universities.id, fut.id));
  await db.update(universities).set({ studentsCount: nustCount }).where(eq(universities.id, nust.id));
  await db.update(universities).set({ studentsCount: hiuCount }).where(eq(universities.id, hiu.id));

  /* ----------------------------- Announcements ------------------------------ */

  await db.insert(announcements).values([
    {
      universityId: fut.id,
      title: "بدء التسجيل للفصل الدراسي الثاني 2025/2026",
      body: "تعلن عمادة القبول والتسجيل عن فتح باب تسجيل المواد للفصل الدراسي الثاني اعتباراً من يوم الأحد القادم وحتى نهاية الأسبوع الثاني من بدء الدراسة. على جميع الطلاب مراجعة المرشد الأكاديمي قبل اعتماد الجدول.",
      pinned: true,
    },
    {
      universityId: fut.id,
      title: "جدول الاختبارات النهائية للفصل الحالي",
      body: "تم اعتماد جدول الاختبارات النهائية وتثبيت قاعات الاختبار. تبدأ الاختبارات بتاريخ 18 الشهر القادم وفق الجدول المعلن في بوابة الطالب. الحضور إلزامي مع بطاقة الهوية الجامعية.",
      pinned: false,
    },
    {
      universityId: fut.id,
      title: "ورشة عمل: مهارات البحث العلمي للفرقة الثالثة",
      body: "تنظم مكتبة الجامعة ورشة عمل متخصصة في مهارات البحث العلمي وقواعد التوثيق يوم الثلاثاء القادم بقاعة المؤتمرات. التسجيل عبر البريد الجامعي.",
      level: 3,
      pinned: false,
    },
    {
      universityId: nust.id,
      title: "تفعيل حسابات Google Workspace للطلاب الجدد",
      body: "تم تفعيل البريد الجامعي لجميع طلاب الفرقة الأولى. يمكنكم الآن الدخول إلى المنصة مباشرة عبر حساب Google الجامعي دون كلمة مرور إضافية.",
      pinned: true,
    },
    {
      universityId: nust.id,
      title: "مسابقة هندسة البرمجيات السنوية",
      body: "يفتح قسم هندسة البرمجيات باب الترشح لمسابقة الابتكار البرمجي السنوية. آخر موعد لتسليم المشاريع نهاية الشهر الجاري.",
      pinned: false,
    },
    {
      universityId: hiu.id,
      title: "اعتماد نتائج الفصل الصيفي",
      body: "تم اعتماد نتائج الفصل الصيفي 2025 رسمياً وأصبحت متاحة الآن في سجلات الطلاب على المنصة. الاعتراضات تقبل خلال أسبوع من تاريخه.",
      pinned: true,
    },
  ]);
  console.log("✓ announcements");

  /* ------------------------------- Join requests ---------------------------- */

  await db.insert(joinRequests).values([
    {
      universityName: "جامعة الواحة للعلوم التقنية",
      universityNameEn: "Oasis University of Technology",
      country: "السعودية",
      city: "الدمام",
      website: "https://oasis-tech.edu.sa",
      contactName: "د. طارق النعيمي",
      contactEmail: "registrar@oasis-tech.edu.sa",
      contactPhone: "+966138000111",
      studentsCount: 8400,
      ssoType: "password",
      message: "نرغب في نقل سجلات الطلاب إلى منصة Academic Future خلال الفصل القادم. نظامنا الداخلي يدعم التكامل عبر API.",
      documents: [
        { name: "قرار-الاعتماد-الأكاديمي.pdf", size: "1.2 MB" },
        { name: "السجل-التجاري.pdf", size: "840 KB" },
        { name: "خطاب-رسمي-موقع.pdf", size: "320 KB" },
      ],
      status: "pending",
    },
    {
      universityName: "أكاديمية المدينة للعلوم الصحية",
      universityNameEn: "Madinah Academy of Health Sciences",
      country: "السعودية",
      city: "المدينة المنورة",
      website: "https://mahs.edu.sa",
      contactName: "د. هيفاء باجابر",
      contactEmail: "it@mahs.edu.sa",
      contactPhone: "+966148220700",
      studentsCount: 3100,
      ssoType: "google",
      googleDomain: "mahs.edu.sa",
      message: "جميع طلابنا على Google Workspace ونحتاج إلى تفعيل الدخول الموحد قبل بدء العام الأكاديمي.",
      documents: [
        { name: "ترخيص-التشغيل.pdf", size: "2.1 MB" },
        { name: "اعتماد-برامج-الكلية.pdf", size: "990 KB" },
      ],
      status: "pending",
    },
    {
      universityName: "معهد الأفق للتدريب المهني",
      universityNameEn: "Ofoq Vocational Institute",
      country: "الكويت",
      city: "مدينة الكويت",
      website: "https://ofoq.edu.kw",
      contactName: "أ. سالم الرميحي",
      contactEmail: "info@ofoq.edu.kw",
      studentsCount: 900,
      ssoType: "password",
      documents: [{ name: "ترخيص.pdf", size: "410 KB" }],
      status: "rejected",
      reviewNote: "الجهة معهد تدريب مهني وليست جامعة معتمدة أكاديمياً — المنصة مخصصة للجامعات فقط.",
      reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
    },
  ]);
  console.log("✓ join requests (2 pending, 1 rejected)");

  /* -------------------------------- Sync logs ------------------------------- */

  const mkLog = async (
    universityId: string,
    type: "manual" | "csv_import" | "api",
    action: string,
    recordsCount: number,
    status: "success" | "partial" | "failed",
    message: string | null,
    hoursAgo: number
  ) => {
    await db.insert(syncLogs).values({
      universityId,
      type,
      action,
      recordsCount,
      status,
      message: message ?? undefined,
      createdAt: new Date(Date.now() - hoursAgo * 3600_000),
    });
  };

  await mkLog(fut.id, "csv_import", "استيراد ملف بيانات الطلاب", 120, "success", "تم إنشاء 118 وتحديث 2 وفشل 0", 50);
  await mkLog(fut.id, "manual", "تحديث بيانات طالب", 1, "success", "الطالبة نورة المالكي", 26);
  await mkLog(fut.id, "api", "مزامنة سجلات الطلاب عبر API", 34, "success", "created=0 updated=34 failed=0", 9);
  await mkLog(fut.id, "api", "سحب بيانات الطلاب عبر API", futCount, "success", null, 3);
  await mkLog(nust.id, "csv_import", "استيراد ملف بيانات الطلاب", 42, "partial", "تم إنشاء 40 وتحديث 0 وفشل 2", 70);
  await mkLog(nust.id, "api", "مزامنة سجلات الطلاب عبر API", 10, "success", "created=0 updated=10 failed=0", 20);
  await mkLog(hiu.id, "manual", "إضافة طالب جديد", 1, "success", "الطالب كريم الرشيدي", 12);
  console.log("✓ sync logs");

  console.log("\n=== Demo credentials ===");
  console.log("Admin      → /secure-admin/login     admin@academicfuture.io / Admin@2026!");
  console.log("University → /login/university      admin@future.edu.sa / Uni@12345");
  console.log("Student    → /login/student         FUT · 20220010 / Student@123");
  console.log("Google SSO → /login/student         NUST · s20230404@nile.edu.eg (any seeded NUST email)");
  console.log("=== Seed complete ===");
}
