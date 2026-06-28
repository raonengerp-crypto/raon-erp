'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const NAV=[{label:'Dashboard',href:'/'},{label:'현장',href:'/field'},{label:'견적',href:'/quote'},{label:'스케줄',href:'/schedule'},{label:'자재',href:'/material'},{label:'세무',href:'/tax'},{label:'AS',href:'/as'}];
export default function RootLayout({children}:{children:React.ReactNode}) {
  const p=usePathname();
  return (
    <html lang="ko"><body className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold text-blue-700">RAON E&G ERP</span>
            <nav className="flex items-center gap-1">
              {NAV.map(item=>{const a=item.href==='/'?p==='/':p.startsWith(item.href);return(<Link key={item.href} href={item.href} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${a?'bg-blue-600 text-white':'text-gray-600 hover:bg-gray-100'}`}>{item.label}</Link>);})}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <button className="hover:text-gray-800">보안</button><span className="text-gray-300">|</span>
            <button className="hover:text-gray-800">회사정보</button><span className="text-gray-300">|</span>
            <button className="hover:text-red-600">로그아웃</button>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </body></html>
  );
}
