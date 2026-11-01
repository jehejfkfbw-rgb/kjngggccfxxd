import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Readex_Pro, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const readex = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex",
  display: "swap",
});
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Academic Future — منظومة الجامعات الموحدة", template: "%s | Academic Future" },
  description: "Academic Future — منصة تعليمية مركزية تجمع الجامعات والطلاب. Developed by Nova Digital.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${readex.variable} ${plex.variable}`}>
      <body className="noise hex-bg min-h-screen font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
