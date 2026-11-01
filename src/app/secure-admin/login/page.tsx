"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Activity, Fingerprint, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { adminLoginAction, type AuthState } from "@/lib/actions/auth";
import { AFLogo } from "@/components/brand";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    adminLoginAction,
    null
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1530 50%, #0a0f1e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "var(--font-plex), sans-serif",
      }}
    >
      {/* Glow orbs */}
      <div style={{
        position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px", borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(79,209,197,0.12) 0%, transparent 65%)",
      }} />
      <div style={{
        position: "fixed", bottom: "-5%", right: "-5%",
        width: "400px", height: "400px", borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(159,122,234,0.1) 0%, transparent 65%)",
      }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "440px" }}>

        {/* Logo + title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Link href="/"><AFLogo /></Link>
          </div>

          {/* RESTRICTED badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(245,101,101,0.1)", border: "1px solid rgba(245,101,101,0.4)",
            borderRadius: "999px", padding: "0.4rem 1rem",
            color: "#fc8181", fontSize: "0.68rem", fontWeight: 700,
            letterSpacing: "0.15em", marginBottom: "1.25rem",
            direction: "ltr",
          }}>
            <Fingerprint size={13} />
            RESTRICTED · PLATFORM OPERATORS ONLY
          </div>

          <h1 style={{
            color: "#ffffff", fontSize: "1.6rem", fontWeight: 800,
            margin: "0 0 0.5rem 0", lineHeight: 1.3,
            fontFamily: "var(--font-readex), sans-serif",
          }}>
            لوحة تحكم إدارة المنصة
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", lineHeight: 1.7, margin: 0 }}>
            هذه المنطقة محمية بمصادقة صارمة، وجميع المحاولات مسجلة.
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "#111827",
          border: "1px solid rgba(79,209,197,0.25)",
          borderRadius: "1.25rem",
          padding: "2rem",
          boxShadow: "0 0 0 1px rgba(79,209,197,0.05), 0 32px 80px -20px rgba(0,0,0,0.8)",
        }}>
          <form action={action}>

            {/* Error */}
            {state?.error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: "0.75rem", padding: "0.85rem 1rem",
                color: "#fca5a5", fontSize: "0.83rem", lineHeight: 1.6,
                marginBottom: "1.25rem", display: "flex", alignItems: "flex-start", gap: "0.6rem",
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f87171", flexShrink: 0, marginTop: "5px" }} />
                {state.error}
              </div>
            )}

            {/* Email field */}
            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{
                display: "block", marginBottom: "0.5rem",
                color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600,
              }}>
                البريد الإلكتروني
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute", left: "0.9rem", top: "50%",
                    transform: "translateY(-50%)", color: "#4fd1c5", pointerEvents: "none",
                  }}
                />
                <input
                  name="email" type="email" required
                  dir="ltr" autoComplete="off"
                  placeholder="operator@nova.digital"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#1e293b",
                    border: "1.5px solid rgba(79,209,197,0.3)",
                    borderRadius: "0.75rem",
                    padding: "0.8rem 1rem 0.8rem 2.8rem",
                    color: "#ffffff", fontSize: "0.9rem",
                    outline: "none", textAlign: "right",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(79,209,197,0.8)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(79,209,197,0.3)")}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block", marginBottom: "0.5rem",
                color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600,
              }}>
                كلمة المرور
              </label>
              <div style={{ position: "relative" }}>
                <KeyRound
                  size={16}
                  style={{
                    position: "absolute", left: "0.9rem", top: "50%",
                    transform: "translateY(-50%)", color: "#4fd1c5", pointerEvents: "none",
                  }}
                />
                <input
                  name="password" type="password" required
                  placeholder="••••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#1e293b",
                    border: "1.5px solid rgba(79,209,197,0.3)",
                    borderRadius: "0.75rem",
                    padding: "0.8rem 1rem 0.8rem 2.8rem",
                    color: "#ffffff", fontSize: "1rem",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(79,209,197,0.8)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(79,209,197,0.3)")}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={pending}
              style={{
                width: "100%", padding: "0.9rem 1.5rem",
                background: pending
                  ? "rgba(79,209,197,0.3)"
                  : "linear-gradient(135deg, #4fd1c5 0%, #38b2ac 60%, #2c7a7b 100%)",
                border: "none", borderRadius: "0.85rem",
                color: "#04050f", fontSize: "0.96rem", fontWeight: 700,
                cursor: pending ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                boxShadow: pending ? "none" : "0 10px 30px -10px rgba(79,209,197,0.7)",
                fontFamily: "var(--font-readex), inherit",
                transition: "all 0.3s",
              }}
            >
              {pending ? (
                <>
                  <span style={{
                    width: "16px", height: "16px", border: "2px solid rgba(4,5,15,0.3)",
                    borderTopColor: "#04050f", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite", display: "inline-block",
                  }} />
                  جارٍ المصادقة...
                </>
              ) : "مصادقة ودخول"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: "1.25rem", display: "flex", alignItems: "center",
          justifyContent: "center", gap: "0.6rem",
          color: "#475569", fontSize: "0.7rem",
        }}>
          <ShieldCheck size={13} style={{ color: "#38b2ac" }} />
          جلسات محدودة بـ 8 ساعات وحماية من التخمين
          <Activity size={13} style={{ color: "#805ad5" }} />
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
