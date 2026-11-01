"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Copy, KeyRound, RefreshCw, TriangleAlert } from "lucide-react";
import { regenerateApiCredentialsAction } from "@/lib/actions/university";

export function ApiCredentials({ apiKey }: { apiKey: string | null }) {
  const [fresh, setFresh] = useState<{ apiKey: string; apiSecret: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const copy = (text: string, which: "key" | "secret") => {
    navigator.clipboard.writeText(text);
    if (which === "key") { setCopiedKey(true); setTimeout(() => setCopiedKey(false), 1800); }
    else { setCopiedSecret(true); setTimeout(() => setCopiedSecret(false), 1800); }
  };

  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
          <KeyRound size={18} className="text-gold-400" />
          مفاتيح الربط البرمجي
        </h3>
        <button
          onClick={() => startTransition(async () => setFresh(await regenerateApiCredentialsAction()))}
          disabled={pending}
          className="btn btn-ghost !px-4 !py-2 !text-xs disabled:opacity-50"
        >
          <RefreshCw size={13} className={pending ? "animate-spin" : ""} />
          إعادة توليد المفاتيح
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <p className="mb-1.5 text-[0.72rem] text-mist-400">API Key — عام</p>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3">
            <code className="min-w-0 flex-1 truncate font-mono text-[0.78rem] text-azure-300" dir="ltr">
              {fresh?.apiKey ?? apiKey ?? "—"}
            </code>
            {(fresh?.apiKey ?? apiKey) && (
              <button onClick={() => copy((fresh?.apiKey ?? apiKey)!, "key")} className="text-mist-400 hover:text-gold-300">
                {copiedKey ? <CheckCircle2 size={15} className="text-emerald-300" /> : <Copy size={15} />}
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[0.72rem] text-mist-400">API Secret — سرّي</p>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3">
            <code className="min-w-0 flex-1 truncate font-mono text-[0.78rem] text-mist-400" dir="ltr">
              {fresh ? fresh.apiSecret : "••••••••••••••••••••••••••••"}
            </code>
            {fresh && (
              <button onClick={() => copy(fresh.apiSecret, "secret")} className="text-mist-400 hover:text-gold-300">
                {copiedSecret ? <CheckCircle2 size={15} className="text-emerald-300" /> : <Copy size={15} />}
              </button>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-amber-300">
            <TriangleAlert size={12} />
            {fresh
              ? "احفظ هذا السر الآن — لن يظهر مرة أخرى بعد مغادرة الصفحة."
              : "السر مخزّن مشفراً ولا يمكن استعراضه — أعد التوليد عند الحاجة."}
          </p>
        </div>
      </div>
    </div>
  );
}
