export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDateAr(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTimeAr(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function timeAgoAr(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "الآن";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يوم`;
  return formatDateAr(d);
}

export function gradeColor(grade: string | null | undefined): string {
  switch (grade) {
    case "A+":
    case "A":
      return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
    case "B+":
    case "B":
      return "text-sky-300 bg-sky-400/10 border-sky-400/20";
    case "C+":
    case "C":
      return "text-amber-300 bg-amber-400/10 border-amber-400/20";
    case "D":
      return "text-orange-300 bg-orange-400/10 border-orange-400/20";
    case "F":
      return "text-rose-300 bg-rose-400/10 border-rose-400/20";
    default:
      return "text-slate-300 bg-white/5 border-white/10";
  }
}

export function gpaFromScore(score: number): number {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 80) return 3.3;
  if (score >= 75) return 3.0;
  if (score >= 70) return 2.7;
  if (score >= 65) return 2.3;
  if (score >= 60) return 2.0;
  if (score >= 55) return 1.5;
  if (score >= 50) return 1.0;
  return 0;
}

export function letterFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 75) return "B";
  if (score >= 65) return "C+";
  if (score >= 55) return "C";
  if (score >= 50) return "D";
  return "F";
}

export const LEVELS_AR: Record<number, string> = {
  1: "الفرقة الأولى",
  2: "الفرقة الثانية",
  3: "الفرقة الثالثة",
  4: "الفرقة الرابعة",
  5: "الفرقة الخامسة",
};

export const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] ?? "") + (parts[1][0] ?? "");
}
