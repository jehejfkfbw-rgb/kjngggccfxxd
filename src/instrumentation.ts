export async function register() {
  // Runs once when a serverless instance (Node.js runtime) starts —
  // i.e. on every Vercel deploy / cold start. Never crashes the app.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { ensureDb } = await import("@/lib/bootstrap");
      await ensureDb();
    } catch (err) {
      // The lazy ensureDb() inside pages will retry on first request.
      console.error("[instrumentation] database bootstrap failed:", err);
    }
  }
}
