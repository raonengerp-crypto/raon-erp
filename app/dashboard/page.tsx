"use client";

import { useMemo, useState } from "react";

type ScheduleType = "선배관" | "기계설치" | "현장방문" | "AS";
type Schedule = {
  id: string;
  site: string;
  type: ScheduleType;
  date: string;
  time: string;
  memo: string;
};

const INITIAL_SCHEDULES: Schedule[] = [
  { id: "s1", site: "여수 OO상가", type: "선배관", date: "2026-07-24", time: "09:00", memo: "배관 재사용 확인" },
  { id: "s2", site: "순천 푸르지오", type: "기계설치", date: "2026-07-25", time: "08:30", memo: "실내기 4대 설치" },
  { id: "s3", site: "광양 XX카페", type: "AS", date: "2026-07-26", time: "13:00", memo: "누수 확인" },
];

const color: Record<ScheduleType, string> = {
  선배관: "bg-blue-100 text-blue-700 border-blue-200",
  기계설치: "bg-green-100 text-green-700 border-green-200",
  현장방문: "bg-orange-100 text-orange-700 border-orange-200",
  AS: "bg-purple-100 text-purple-700 border-purple-200",
};

function money(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function DashboardPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [selected, setSelected] = useState<Schedule | null>(null);
  const [editing, setEditing] = useState<Schedule | null>(null);

  const today = new Date("2026-07-24");
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, i)), []);

  const kpi = {
    activeSites: 12,
    monthlySales: 186400000,
    monthlyPurchases: 94800000,
    unpaid: 31500000,
    profit: 47200000,
    vat: 8327000,
  };

  const saveEdit = () => {
    if (!editing) return;
    setSchedules(prev => prev.map(s => (s.id === editing.id ? editing : s)));
    setSelected(editing);
    setEditing(null);
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (!confirm("일정을 삭제하시겠습니까?")) return;
    setSchedules(prev => prev.filter(s => s.id !== selected.id));
    setSelected(null);
    setEditing(null);
  };

  return (
    <div className="p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-black text-slate-900">대시보드</h1>
        <p className="text-sm text-slate-500 mt-1">라온이앤지 현장·매출·일정 통합 관리</p>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        {[
          ["진행 현장", `${kpi.activeSites}개`],
          ["월 매출", money(kpi.monthlySales)],
          ["월 매입", money(kpi.monthlyPurchases)],
          ["미수금", money(kpi.unpaid)],
          ["예상 순익", money(kpi.profit)],
          ["예상 VAT", money(kpi.vat)],
        ].map(([title, value]) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-500">{title}</p>
            <div className="text-xl font-black text-slate-900 mt-2">{value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[1fr_360px] gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-slate-900">주간 일정</h2>
              <p className="text-xs text-slate-500 mt-1">오늘 기준 7일 일정 표시</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold">+ 일정 등록</button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {week.map(d => {
              const date = ymd(d);
              const items = schedules.filter(s => s.date === date);
              return (
                <div key={date} className="min-h-[420px] rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-500">{d.toLocaleDateString("ko-KR", { weekday: "short" })}</div>
                  <div className="text-lg font-black text-slate-900 mt-1">{d.getDate()}</div>

                  <div className="mt-3 space-y-2">
                    {items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelected(item);
                          setEditing(null);
                        }}
                        className={`w-full text-left rounded-xl border p-2 text-xs ${color[item.type]}`}
                      >
                        <div className="font-black">{item.type}</div>
                        <div className="truncate">{item.site}</div>
                        <div>{item.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-black text-slate-900">빠른 이동</h2>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {["현장 등록", "견적 작성", "세무관리", "자재관리"].map(x => (
                <button key={x} className="rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700">{x}</button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-black text-slate-900">일정 확인</h2>

            {!selected ? (
              <p className="text-sm text-slate-500 mt-4">캘린더에서 일정을 선택하세요.</p>
            ) : !editing ? (
              <div className="mt-4 space-y-3">
                <div className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${color[selected.type]}`}>{selected.type}</div>
                <div>
                  <p className="text-xs text-slate-500">현장</p>
                  <p className="font-bold">{selected.site}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">일시</p>
                  <p className="font-bold">{selected.date} {selected.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">메모</p>
                  <p className="font-bold">{selected.memo || "-"}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(selected)} className="flex-1 rounded-xl bg-blue-600 text-white py-2 text-sm font-bold">수정</button>
                  <button onClick={deleteSelected} className="flex-1 rounded-xl bg-red-50 text-red-600 py-2 text-sm font-bold">삭제</button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-bold text-slate-500">현장명</label>
                <input className="w-full border rounded-xl px-3 py-2 text-sm" value={editing.site} onChange={e => setEditing({ ...editing, site: e.target.value })} />

                <label className="block text-xs font-bold text-slate-500">구분</label>
                <select className="w-full border rounded-xl px-3 py-2 text-sm" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as ScheduleType })}>
                  {["선배관", "기계설치", "현장방문", "AS"].map(x => <option key={x}>{x}</option>)}
                </select>

                <label className="block text-xs font-bold text-slate-500">날짜</label>
                <input type="date" className="w-full border rounded-xl px-3 py-2 text-sm" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} />

                <label className="block text-xs font-bold text-slate-500">시간</label>
                <input type="time" className="w-full border rounded-xl px-3 py-2 text-sm" value={editing.time} onChange={e => setEditing({ ...editing, time: e.target.value })} />

                <label className="block text-xs font-bold text-slate-500">메모</label>
                <textarea className="w-full border rounded-xl px-3 py-2 text-sm" value={editing.memo} onChange={e => setEditing({ ...editing, memo: e.target.value })} />

                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex-1 rounded-xl bg-blue-600 text-white py-2 text-sm font-bold">저장</button>
                  <button onClick={() => setEditing(null)} className="flex-1 rounded-xl bg-slate-100 text-slate-700 py-2 text-sm font-bold">취소</button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
