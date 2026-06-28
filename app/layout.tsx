import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "RAON E&G ERP v14",
  description: "Commercial HVAC SaaS ERP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Navigation />
        <main className="min-h-screen bg-slate-50">{children}</main>
      </body>
    </html>
  );
}
