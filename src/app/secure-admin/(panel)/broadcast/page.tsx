import { requirePlatformAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/dash/shell";
import { Megaphone, Send, ShieldAlert, Sparkles } from "lucide-react";
import { platformBroadcastAction } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "البث المركزي" };

export default async function AdminBroadcastPage() {
  await requirePlatformAdmin();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="البث المركزي للمنصة" subtitle="إرسال إعلان عاجل سيظهر في بوابات جميع طلاب الجامعات المعتمدة فوراً">
         <span className="chip chip-coral"><Megaphone size={13} /> Global Broadcast Mode</span>
      </PageHeader>

      <div className="card-surface p-8 relative overflow-hidden">
        <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-red-500 via-violet-500 to-teal-500" />
        
        <div className="flex items-start gap-5 mb-8">
           <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-400/10 text-red-400">
             <ShieldAlert size={28} />
           </span>
           <div>
             <h3 className="text-xl font-bold text-white mb-2">تنبيه الإدارة المركزية</h3>
             <p className="text-[0.85rem] text-slate-400 leading-7">
               هذا الإجراء قوي جداً. سيتم إنشاء إعلان "مثبت" في كل جامعة معتمدة على المنصة.
               استخدم هذا فقط للبلاغات التقنية الهامة، تحديثات النظام، أو الإعلانات الرسمية من إدارة Academic Future.
             </p>
           </div>
        </div>

        <form action={platformBroadcastAction} className="space-y-5">
           <div>
             <label className="label">عنوان البث *</label>
             <input 
               name="title" 
               required 
               className="input !py-3 !text-[1rem] !bg-space-800 border-red-500/10 focus:border-red-500/40" 
               placeholder="مثال: تحديث أمني هام لنظام الدخول الموحد" 
             />
           </div>
           <div>
             <label className="label">نص البث (سيظهر لجميع الطلاب) *</label>
             <textarea 
               name="body" 
               required 
               rows={6} 
               className="input resize-none !bg-space-800 border-red-500/10 focus:border-red-500/40" 
               placeholder="اكتب تفاصيل الرسالة هنا..." 
             />
           </div>

           <button className="btn btn-coral w-full !py-4 !text-[1rem] font-bold group">
             <Send size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
             إرسال البث لجميع الجامعات والطلاب
           </button>
        </form>

        <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
           <Sparkles size={16} className="text-teal-400 shrink-0" />
           <p className="text-[0.72rem] text-slate-500 italic">
             سيتم إضافة ترويسة "[تبليغ من الإدارة المركزية]" تلقائياً لعنوان الإعلان لضمان الوضوح للطلاب.
           </p>
        </div>
      </div>
    </div>
  );
}
