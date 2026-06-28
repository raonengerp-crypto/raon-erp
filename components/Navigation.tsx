import Link from "next/link";

const menus = [
  ["대시보드", "/dashboard"],
  ["현장관리", "/field"],
  ["견적관리", "/quote"],
  ["자재관리", "/material"],
  ["세무관리", "/tax"],
  ["협력업체", "/vendor"],
  ["직원관리", "/employee"],
  ["AS관리", "/as"],
  ["설정", "/settings"],
];

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="h-16 px-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">R</div>
          <div>
            <div className="font-black text-slate-900 leading-none">RAON E&G ERP v14</div>
            <div className="text-[11px] text-slate-500 mt-1">Commercial HVAC SaaS</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {menus.map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700">회사정보</button>
          <button className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white">로그아웃</button>
        </div>
      </div>
    </header>
  );
}
