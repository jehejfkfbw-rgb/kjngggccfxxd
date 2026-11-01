"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type { Student } from "@/db/schema";
import { deleteStudentAction, saveStudentAction } from "@/lib/actions/university";
import { LEVELS_AR, cn, initials } from "@/lib/utils";

type College = { id: string; name: string };
type Department = { id: string; name: string; collegeId: string };

const statusChip: Record<string, { cls: string; label: string }> = {
  active: { cls: "chip-green", label: "نشط" },
  suspended: { cls: "chip-red", label: "موقوف" },
  graduated: { cls: "chip-blue", label: "خريج" },
};

function buildQuery(base: Record<string, string>) {
  const p = new URLSearchParams();
  Object.entries(base).forEach(([k, v]) => v && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function StudentsManager({
  students,
  colleges,
  departments,
  q,
  page,
  totalPages,
  collegeFilter,
  levelFilter,
}: {
  students: Student[];
  colleges: College[];
  departments: Department[];
  q: string;
  page: number;
  totalPages: number;
  collegeFilter: string;
  levelFilter: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [formCollege, setFormCollege] = useState("");
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(q);

  const openCreate = () => {
    setEditing(null);
    setFormCollege("");
    dialogRef.current?.showModal();
  };
  const openEdit = (s: Student) => {
    setEditing(s);
    setFormCollege(s.collegeId ?? "");
    dialogRef.current?.showModal();
  };

  const filteredDepartments = departments.filter((d) => !formCollege || d.collegeId === formCollege);
  const query = { q, college: collegeFilter, level: levelFilter };

  return (
    <div>
      {/* Filters */}
      <div className="card-surface mb-5 flex flex-wrap items-center gap-3 p-4">
        <form
          className="relative min-w-[240px] flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/dashboard/students${buildQuery({ q: search, college: collegeFilter, level: levelFilter })}`);
          }}
        >
          <Search size={16} className="field-icon" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الرقم الجامعي أو البريد..."
            className="input has-icon !ps-10"
          />
        </form>
        <select
          className="input !w-auto"
          value={collegeFilter}
          onChange={(e) =>
            router.push(`/dashboard/students${buildQuery({ q, college: e.target.value, level: levelFilter })}`)
          }
        >
          <option value="">كل الكليات</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          className="input !w-auto"
          value={levelFilter}
          onChange={(e) =>
            router.push(`/dashboard/students${buildQuery({ q, college: collegeFilter, level: e.target.value })}`)
          }
        >
          <option value="">كل الفرق</option>
          {[1, 2, 3, 4, 5].map((l) => (
            <option key={l} value={l}>{LEVELS_AR[l]}</option>
          ))}
        </select>
        <button onClick={openCreate} className="btn btn-gold ms-auto">
          <Plus size={16} /> إضافة طالب
        </button>
      </div>

      {/* Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl min-w-[880px]">
            <thead>
              <tr>
                <th>الطالب</th>
                <th>الرقم الجامعي</th>
                <th>الكلية / القسم</th>
                <th>الفرقة</th>
                <th>المعدل</th>
                <th>الحالة</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center gap-3 py-14 text-center">
                      <UserRound size={34} className="text-mist-500" />
                      <p className="text-[0.86rem] text-mist-400">لا يوجد طلاب مطابقون — أضف أول طالب أو استورد ملف بيانات.</p>
                      <button onClick={openCreate} className="btn btn-gold !py-2.5"><Plus size={15} /> إضافة طالب</button>
                    </div>
                  </td>
                </tr>
              )}
              {students.map((s) => {
                const college = colleges.find((c) => c.id === s.collegeId);
                const dept = departments.find((d) => d.id === s.departmentId);
                const st = statusChip[s.status] ?? statusChip.active;
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-ink-500 to-ink-700 font-display text-[0.68rem] font-bold text-gold-300">
                          {initials(s.fullName)}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{s.fullName}</p>
                          <p className="text-[0.68rem] text-mist-500" dir="ltr">{s.email ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-[0.76rem] text-azure-300" dir="ltr">{s.studentNumber}</td>
                    <td>
                      <p className="text-[0.82rem]">{college?.name ?? "—"}</p>
                      <p className="text-[0.68rem] text-mist-500">{dept?.name ?? ""}</p>
                    </td>
                    <td className="text-[0.8rem]">{LEVELS_AR[s.level]}</td>
                    <td className="tnum font-semibold text-gold-300" dir="ltr">{parseFloat(s.gpa ?? "0").toFixed(2)}</td>
                    <td><span className={cn("chip", st.cls)}>{st.label}</span></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(s)} title="تعديل" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-mist-300 transition-colors hover:border-gold-500/50 hover:text-gold-300">
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => { setDeleting(s); deleteRef.current?.showModal(); }}
                          title="حذف"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-mist-300 transition-colors hover:border-rose-400/50 hover:text-rose-300"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/8 px-5 py-3.5">
            <p className="text-[0.74rem] text-mist-500">صفحة {page} من {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => router.push(`/dashboard/students${buildQuery({ ...query, page: String(page - 1) })}`)}
                className="btn btn-ghost !px-3 !py-2 disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => router.push(`/dashboard/students${buildQuery({ ...query, page: String(page + 1) })}`)}
                className="btn btn-ghost !px-3 !py-2 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <dialog ref={dialogRef} className="modal-dialog" onClose={() => setEditing(null)}>
        <div className="ring-gold card-surface p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">{editing ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}</h2>
            <button onClick={() => dialogRef.current?.close()} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-mist-400 hover:text-white">
              <X size={15} />
            </button>
          </div>

          <form
            key={editing?.id ?? "new"}
            action={(fd) => startTransition(async () => { await saveStudentAction(fd); dialogRef.current?.close(); })}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div>
              <label className="label">الرقم الجامعي *</label>
              <input name="studentNumber" required defaultValue={editing?.studentNumber} dir="ltr" className="input text-end" placeholder="20210001" />
            </div>
            <div>
              <label className="label">الاسم الكامل *</label>
              <input name="fullName" required defaultValue={editing?.fullName} className="input" placeholder="اسم الطالب الرباعي" />
            </div>
            <div className="col-span-2">
              <label className="label">البريد الإلكتروني الجامعي</label>
              <input name="email" type="email" defaultValue={editing?.email ?? ""} dir="ltr" className="input text-end" placeholder="student@university.edu" />
            </div>
            <div>
              <label className="label">الرقم القومي / الهوية</label>
              <input name="nationalId" defaultValue={editing?.nationalId ?? ""} dir="ltr" className="input text-end" />
            </div>
            <div>
              <label className="label">الفرقة الدراسية</label>
              <select name="level" defaultValue={editing?.level ?? 1} className="input">
                {[1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>{LEVELS_AR[l]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">الكلية</label>
              <select name="collegeId" value={formCollege} onChange={(e) => setFormCollege(e.target.value)} className="input">
                <option value="">— غير محدد —</option>
                {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">القسم</label>
              <select name="departmentId" defaultValue={editing?.departmentId ?? ""} className="input">
                <option value="">— غير محدد —</option>
                {filteredDepartments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">الحالة</label>
              <select name="status" defaultValue={editing?.status ?? "active"} className="input">
                <option value="active">نشط</option>
                <option value="suspended">موقوف</option>
                <option value="graduated">خريج</option>
              </select>
            </div>
            <div>
              <label className="label">{editing ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور (افتراضياً الرقم الجامعي)"}</label>
              <div className="has-icon relative">
                <KeyRound size={14} className="field-icon" />
                <input name="password" type="text" dir="ltr" className="input text-end" placeholder={editing ? "اتركها فارغة لعدم التغيير" : "اتركها فارغة للافتراضي"} />
              </div>
            </div>
            <div className="col-span-2 mt-2 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => dialogRef.current?.close()} className="btn btn-ghost">إلغاء</button>
              <button type="submit" disabled={pending} className="btn btn-gold disabled:opacity-60">
                {pending ? "جارٍ الحفظ..." : editing ? "حفظ التعديلات" : "إضافة الطالب"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete dialog */}
      <dialog ref={deleteRef} className="modal-dialog !max-w-md" onClose={() => setDeleting(null)}>
        <div className="card-surface p-7">
          <h2 className="font-display text-lg font-bold text-white">حذف سجل الطالب؟</h2>
          <p className="mt-3 text-[0.86rem] leading-7 text-mist-400">
            سيتم حذف <span className="font-semibold text-white">{deleting?.fullName}</span> نهائياً مع جميع سجلاته
            الأكاديمية المرتبطة. لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => deleteRef.current?.close()} className="btn btn-ghost">تراجع</button>
            <form action={(fd) => startTransition(async () => { await deleteStudentAction(fd); deleteRef.current?.close(); })}>
              <input type="hidden" name="id" value={deleting?.id ?? ""} />
              <button type="submit" disabled={pending} className="btn btn-danger w-full">
                {pending ? "جارٍ الحذف..." : "تأكيد الحذف"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
