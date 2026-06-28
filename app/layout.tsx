import type { Metadata } from 'next';
import './globals.css';
import Navigation from './Navigation';

export const metadata: Metadata = { title: 'RAON E&G ERP' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <Navigation />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
