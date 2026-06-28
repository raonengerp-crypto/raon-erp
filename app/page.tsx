'use client';
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-4">
        {[
          {label:'진행 현장', value:'0건', bg:'bg-blue-50', text:'text-blue-700'},
          {label:'월 매출', value:'0원', bg:'bg-green-50', text:'text-green-700'},
          {label:'월 매입', value:'0원', bg:'bg-orange-50', text:'text-orange-700'},
          {label:'미수금', value:'0원', bg:'bg-red-50', text:'text-red-700'},
          {label:'순익', value:'0원', bg:'bg-teal-50', text:'text-teal-700'},
          {label:'VAT', value:'0원', bg:'bg-purple-50', text:'text-purple-700'},
        ].map(k => (
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg} ${k.text}`}>
            <p className="text-xs font-medium opacity-70 mb-1">{k.label}</p>
            <p className="text-xl font-bold">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        📅 캘린더 영역 — Firebase 연결 후 활성화됩니다
      </div>
    </div>
  );
}
