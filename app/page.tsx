'use client';
export default function DashboardPage() {
  const kpi=[
    {label:'진행 현장',value:'0건',color:'bg-blue-50 text-blue-700 border-blue-200'},
    {label:'월 매출',value:'0원',color:'bg-green-50 text-green-700 border-green-200'},
    {label:'월 매입',value:'0원',color:'bg-orange-50 text-orange-700 border-orange-200'},
    {label:'미수금',value:'0원',color:'bg-red-50 text-red-700 border-red-200'},
    {label:'순익',value:'0원',color:'bg-teal-50 text-teal-700 border-teal-200'},
    {label:'VAT',value:'0원',color:'bg-purple-50 text-purple-700 border-purple-200'},
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-4">
        {kpi.map(k=>(
          <div key={k.label} className={`rounded-xl border p-4 ${k.color}`}>
            <p className="text-xs font-medium opacity-70 mb-1">{k.label}</p>
            <p className="text-xl font-bold">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        캘린더 영역 (Firebase 연결 후 활성화)
      </div>
    </div>
  );
}
