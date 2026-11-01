"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";

export type Lang = "ar" | "en";

type Dict = Omit<typeof ar, "dir"> & { dir: "rtl" | "ltr" };

const ar = {
  dir: "rtl" as const,
  nav: {
    universities: "الجامعات",
    services: "الخدمات",
    features: "المميزات",
    how: "كيف تعمل",
    contact: "تواصل معنا",
    studentLogin: "دخول الطلاب",
    uniLogin: "دخول الجامعات",
    joinNow: "انضم كجامعة",
  },
  hero: {
    badge: "المنظومة المركزية الأولى للجامعات",
    titleA: "مستقبلك الجامعي،",
    titleB: "في منصة واحدة",
    sub: "Academic Future منظومة إلكترونية مركزية تجمع الجامعات والطلاب في مكان واحد — بيانات أكاديمية موثوقة، دخول موحد، ونتائج وجداول محدثة لحظياً من مصدرها الرسمي.",
    ctaStudent: "دخول الطلاب",
    ctaJoin: "انضم كجامعة",
    syncOk: "مزامنة البيانات ناجحة",
    syncDesc: "آخر تحديث قبل دقيقتين · عبر API",
    profileTitle: "بطاقة طالب معتمدة",
    gpaLabel: "المعدل التراكمي",
    gradeChip: "نتيجة الفصل الأول",
    uniWord: "جامعة مشاركة",
    studentWord: "طالب مسجل",
    liveOps: "عملية مزامنة اليوم",
  },
  stats: {
    universities: "جامعة مشاركة",
    students: "طالب مسجل",
    courses: "مادة دراسية",
    syncs: "عملية مزامنة يومياً",
  },
  about: {
    eyebrow: "تعريف المنصة",
    title: "منصة أكاديمية مركزية تربط الجامعة بأبنائها الطلاب",
    body: "تمنح Academic Future كل جامعة بوابة إدارة مستقلة ومؤمّنة بالكامل، وتمنح كل طالب حساباً معتمداً يعرض بياناته الرسمية كما ترسلها جامعته — دون وسطاء، ودون إمكانية إنشاء حسابات ذاتية.",
    goals: [
      "توحيد السجلات الأكاديمية للطلاب في نظام مركزي موثوق",
      "تمكين الجامعات من إدارة بياناتها باستقلالية وخصوصية تامة",
      "ضمان صحة البيانات عبر الاعتماد الرسمي والتحقق المؤسسي",
      "توفير تجربة رقمية سريعة ومتجاوبة على كل الأجهزة",
    ],
  },
  services: {
    eyebrow: "الخدمات التعليمية",
    title: "كل ما تحتاجه الجامعة والطالب",
    sub: "منظومة متكاملة من الخدمات الأكاديمية الرقمية المصممة لتعمل على نطاق مؤسسي حقيقي.",
    items: [
      { t: "السجلات الأكاديمية الموحدة", d: "ملف طالب شامل: الكلية، القسم، الفرقة، المعدل التراكمي، والساعات المعتمدة — محدث من مصدر الجامعة." },
      { t: "التسجيل والمواد الدراسية", d: "استعراض المواد المسجلة لكل فصل دراسي مع الساعات والمحاضرين وأماكن المحاضرات." },
      { t: "النتائج والجداول الفورية", d: "نشر النتائج والجداول الدراسية لحظة اعتمادها من الجامعة، مع سجل كامل لكل الفصول." },
      { t: "الدخول الموحد SSO", d: "تسجيل دخول بالرقم الجامعي أو عبر Google Workspace للجامعات المعتمدة على بيئة Google." },
      { t: "استيراد البيانات الذكي", d: "استيراد آلاف السجلات من ملفات Excel و CSV مع توليد بيانات الدخول تلقائياً." },
      { t: "واجهة برمجية API آمنة", d: "ربط نظام الجامعة الداخلي بالمنصة عبر API مشفّر بمفاتيح خاصة وسجل مزامنة كامل." },
    ],
  },
  features: {
    eyebrow: "مميزات المنصة",
    title: "بنية مؤسسية مصممة للثقة",
    sub: "كل قرار تقني في Academic Future يدور حول ثلاثة محاور: الأمان، الخصوصية، والسرعة.",
    securityT: "أمان على مستوى المؤسسات",
    securityD: "مصادقة متعددة الطبقات وتشفير كامل لكلمات المرور والمفاتيح، مع تحديد معدل المحاولات وجلسات محدودة الصلاحية.",
    bullets: ["تشفير Scrypt لكلمات المرور", "جلسات HttpOnly موقّتة", "حماية من التخمين والهجمات"],
    isolationT: "عزل كامل لبيانات الجامعات",
    isolationD: "كل جامعة تعمل في مساحة معزولة تماماً — لا يمكن لأي جامعة الاطلاع على بيانات جامعة أخرى.",
    langT: "عربي أولاً، وإنجليزي كامل",
    langD: "واجهة RTL مصممة للعربية أصالة مع دعم كامل للإنجليزية بنقرة واحدة.",
    liveT: "تحديث لحظي",
    liveD: "أي تعديل من الجامعة ينعكس فوراً على بوابة الطالب.",
  },
  how: {
    eyebrow: "آلية العمل",
    title: "ثلاث خطوات تنقل جامعتك إلى المستقبل",
    sub: "عملية انضمام مدروسة تحمي الطلاب وتضمن موثوقية البيانات من اليوم الأول.",
    steps: [
      { t: "قدّم طلب الانضمام", d: "سجّل بيانات جامعتك الرسمية وارفع المستندات المطلوبة للتحقق من الكيان القانوني." },
      { t: "المراجعة والاعتماد", d: "تراجع إدارة المنصة الطلب والمستندات، ثم تصدر حساب المسؤول ومفاتيح API الخاصة بجامعتك." },
      { t: "اربط بياناتك وابدأ", d: "استورد بيانات الطلاب عبر Excel أو اربط نظامك مباشرة عبر الـ API، وتظهر النتائج لطلابك فوراً." },
    ],
    note: "متوسط زمن الاعتماد: 48 ساعة عمل",
  },
  portals: {
    eyebrow: "بوابات الدخول",
    title: "بوابة مخصصة لكل طرف",
    sub: "تجربة منفصلة ومخصصة للطلاب وللجامعات — كلٌ بصلاحياته وبياناته.",
    studentT: "بوابة الطالب",
    studentD: "ادخل برقمك الجامعي المعتمد لاستعراض ملفك الأكاديمي، موادك، جدولك، نتائجك، وإعلانات جامعتك.",
    studentCta: "تسجيل دخول الطلاب",
    studentNote: "الحسابات تُنشأ من الجامعة فقط — لا يوجد تسجيل ذاتي",
    uniT: "بوابة الجامعات",
    uniD: "لوحة تحكم مستقلة لإدارة الطلاب والكليات والمواد والإعلانات، مع استيراد الملفات والربط البرمجي.",
    uniCta: "تسجيل دخول الجامعات",
    uniCta2: "تقديم طلب انضمام",
  },
  contact: {
    eyebrow: "التواصل والدعم",
    title: "فريق دعم يعمل معك على مدار الساعة",
    sub: "دعم فني متخصص للجامعات والطلاب، مع مسار سريع لشراكات الجامعات الجديدة.",
    emailL: "البريد الإلكتروني",
    phoneL: "الخط الساخن",
    hoursL: "ساعات الدعم",
    hoursV: "الأحد – الخميس · 9ص إلى 11م",
    partnerL: "شراكات الجامعات",
    partnerV: "partners@academicfuture.io",
    supportEmail: "support@academicfuture.io",
    phone: "9200 04 118 (+966)",
  },
  footer: {
    desc: "منظومة إلكترونية مركزية تجمع الجامعات والطلاب في منصة أكاديمية واحدة آمنة وموثوقة.",
    portalsL: "البوابات",
    linksL: "روابط سريعة",
    contactL: "تواصل",
    rights: "جميع الحقوق محفوظة © 2026 Academic Future",
    developed: "Developed by Nova Digital",
    adminLink: "دخول الإدارة",
  },
};

const en: Dict = {
  dir: "ltr" as const,
  nav: {
    universities: "Universities",
    services: "Services",
    features: "Features",
    how: "How it works",
    contact: "Contact",
    studentLogin: "Student Login",
    uniLogin: "University Login",
    joinNow: "Join as University",
  },
  hero: {
    badge: "The first centralized university ecosystem",
    titleA: "Your academic future,",
    titleB: "in one platform",
    sub: "Academic Future is a centralized electronic ecosystem bringing universities and students together — trusted academic records, single sign-on, and results & schedules updated in real time from their official source.",
    ctaStudent: "Student Portal",
    ctaJoin: "Join as University",
    syncOk: "Data sync successful",
    syncDesc: "Updated 2 minutes ago · via API",
    profileTitle: "Verified Student Card",
    gpaLabel: "Cumulative GPA",
    gradeChip: "Fall semester results",
    uniWord: "partner universities",
    studentWord: "registered students",
    liveOps: "sync operations today",
  },
  stats: {
    universities: "Partner universities",
    students: "Registered students",
    courses: "Managed courses",
    syncs: "Daily sync operations",
  },
  about: {
    eyebrow: "About the platform",
    title: "A central academic platform connecting universities with their students",
    body: "Academic Future gives every university a fully isolated, secure management portal, and gives every student a verified account showing official records exactly as the university publishes them — no middlemen, no self-registration.",
    goals: [
      "Unify student academic records in one trusted central system",
      "Empower universities to manage their data independently and privately",
      "Guarantee data integrity through official verification",
      "Deliver a fast, responsive experience on every device",
    ],
  },
  services: {
    eyebrow: "Academic services",
    title: "Everything a university and student need",
    sub: "A complete suite of digital academic services engineered for real institutional scale.",
    items: [
      { t: "Unified Academic Records", d: "A complete student file: college, department, level, cumulative GPA and credit hours — synced from the university source." },
      { t: "Registration & Courses", d: "Browse registered courses per semester with credit hours, instructors and lecture venues." },
      { t: "Instant Results & Schedules", d: "Results and timetables published the moment the university approves them, with full semester history." },
      { t: "Single Sign-On (SSO)", d: "Sign in with university ID, or via Google Workspace for institutions on Google." },
      { t: "Smart Data Import", d: "Import thousands of records from Excel & CSV files with automatic credential generation." },
      { t: "Secure API", d: "Connect the university's internal systems via an encrypted API with dedicated keys and a full sync log." },
    ],
  },
  features: {
    eyebrow: "Platform features",
    title: "Institutional-grade, built on trust",
    sub: "Every technical decision in Academic Future revolves around three axes: security, privacy and speed.",
    securityT: "Enterprise-grade security",
    securityD: "Layered authentication, full encryption of passwords and keys, login attempt throttling and expiring sessions.",
    bullets: ["Scrypt password hashing", "Timed HttpOnly sessions", "Brute-force protection"],
    isolationT: "Complete university data isolation",
    isolationD: "Each university operates in a fully isolated space — no university can ever see another's data.",
    langT: "Arabic-first, full English",
    langD: "An RTL interface natively designed for Arabic with complete English support in one click.",
    liveT: "Real-time updates",
    liveD: "Any change made by the university reflects instantly on the student portal.",
  },
  how: {
    eyebrow: "How it works",
    title: "Three steps to move your university into the future",
    sub: "A deliberate onboarding process that protects students and guarantees data integrity from day one.",
    steps: [
      { t: "Submit the join request", d: "Register your university's official details and upload the documents required to verify your legal entity." },
      { t: "Review & approval", d: "Platform administration reviews the request and documents, then issues your admin account and API keys." },
      { t: "Connect your data & launch", d: "Import student records via Excel or connect your system directly through the API — results appear to students instantly." },
    ],
    note: "Average approval time: 48 business hours",
  },
  portals: {
    eyebrow: "Access portals",
    title: "A dedicated portal for every side",
    sub: "Separate, purpose-built experiences for students and universities — each with its own permissions and data.",
    studentT: "Student Portal",
    studentD: "Sign in with your verified university ID to view your academic profile, courses, schedule, results and announcements.",
    studentCta: "Student Sign In",
    studentNote: "Accounts are created by universities only — no self sign-up",
    uniT: "University Portal",
    uniD: "An independent dashboard to manage students, colleges, courses and announcements, with file import and API integration.",
    uniCta: "University Sign In",
    uniCta2: "Submit a join request",
  },
  contact: {
    eyebrow: "Contact & support",
    title: "A support team working with you around the clock",
    sub: "Specialized technical support for universities and students, with a fast lane for new university partnerships.",
    emailL: "Email",
    phoneL: "Hotline",
    hoursL: "Support hours",
    hoursV: "Sun – Thu · 9AM to 11PM",
    partnerL: "University partnerships",
    partnerV: "partners@academicfuture.io",
    supportEmail: "support@academicfuture.io",
    phone: "+966 9200 04 118",
  },
  footer: {
    desc: "A centralized electronic ecosystem bringing universities and students together in one secure, trusted academic platform.",
    portalsL: "Portals",
    linksL: "Quick links",
    contactL: "Contact",
    rights: "All rights reserved © 2026 Academic Future",
    developed: "Developed by Nova Digital",
    adminLink: "Admin",
  },
};

const dictionaries: Record<Lang, Dict> = { ar, en };

interface LangCtx {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dict;
  toggle: () => void;
}

const Ctx = createContext<LangCtx>({ lang: "ar", dir: "rtl", t: ar, toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("af-lang")) as Lang | null;
    if (saved === "en" || saved === "ar") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const toggle = () => {
    setLang((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      localStorage.setItem("af-lang", next);
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ lang, dir: dictionaries[lang].dir, t: dictionaries[lang], toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  return useContext(Ctx);
}

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="btn btn-ghost !px-3 !py-2 text-xs font-bold"
    >
      <Languages size={15} />
      {!compact && <span>{lang === "ar" ? "EN" : "عربي"}</span>}
    </button>
  );
}
