'use client';
import { useState } from 'react';

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const DAYS = ['일','월','화','수','목','금','토'];
const TYPE_COLOR: Record<string,string> = { pipe:'bg-blue-400', install:'bg-green-400', as:'bg-orange-400', other:'bg-gray-400' };
const TYPE_TEXT: Record<string,string>  = { pipe:'bg-blue-100 text-blue-700', install:'bg-green-100 text-green-700', as:'bg-orange-100 text-orange-700', other:'bg-gray-100 text-gray-700' };
const TYPE_LABEL: Record<string,string> = { pipe:'선배관', install:'기계설치', as:'AS', other:'기타' };

function toStr(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

export default function Dashboard() {
  const [cur, setCur] = useState(new Date());
  const [schedules, setSchedules] = useState<{id:string;date:string;title:string;type:string}[]>([]);
  const [selDate, setSelDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', type:'other' });

  const year = cur.getFullYear(), month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date();
  const todayStr = toStr(today);

  const cells: (number|null)[] = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const forDate = (dateStr: string) => schedules.filter(s => s.date === dateStr);

  const addSchedule = () => {
    if (!form.title) return;
    setSchedules(p => [...p, { id: crypto.randomUUID(), date: selDate, ...form }]);
    setForm({ title:'', type:'other' });
    setShowForm(false);
  };

  const weekDays = Array.from({length:7}, (_,i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  const KPI = [
    {label:'진행 현장',value:'0건',bg:'bg-blue-50',text:'text-blue-700',border:'border-blue-200'},
    {label:'월 매출',value:'0원',bg:'bg-green-50',text:'text-green-700',border:'border-green-200'},
    {label:'월 매입',value:'0원',bg:'bg-orange-50',text:'text-orange-700',border:'border-orange-200'},
    {label:'미수금',value:'0원',bg:'bg-red-50',text:'text-red-700',border:'border-red-200'},
    {label:'순익',value:'0원',bg:'bg-teal-50',text:'text-teal-700',border:'border-teal-200'},
    {label:'VAT',value:'0원',bg:'bg-purple-50',text:'text-purple-700',border:'border-purple-200'},
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-4">
        {KPI.map(k=>(
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg} ${k.text} ${k.border}`}>
            <p className="text-xs font-medium opacity-70 mb-1">{k.label}</p>
            <p className="text-xl font-bold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={()=>setCur(new Date(year,month-1,1))} className="p-2 rounded hover:bg-gray-100">◀</button>
            <h2 className="text-lg font-bold text-gray-800">{year}년 {MONTHS[month]}</h2>
            <button onClick={()=>setCur(new Date(year,month+1,1))} className="p-2 rounded hover:bg-gray-100">▶</button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d,i)=><div key={d} className={`text-center text-xs font-semibold py-1 ${i===0?'text-red-500':i===6?'text-blue-500':'text-gray-500'}`}>{d}</div>)}
          </div>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {Array.from({length: cells.length/7}, (_,ri)=>(
              <div key={ri} className="grid grid-cols-7">
                {cells.slice(ri*7,(ri+1)*7).map((day,di)=>{
                  const dateStr = day ? `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` : '';
                  const ds = dateStr ? forDate(dateStr) : [];
                  const isTod = dateStr === todayStr;
                  return (
                    <div key={di} onClick={()=>{if(day){setSelDate(dateStr);setShowForm(true);}}}
                      className={`min-h-[80px] p-1.5 border-b border-r border-gray-100 ${day?'bg-white hover:bg-blue-50 cursor-pointer':'bg-gray-50'} ${selDate===dateStr?'ring-2 ring-inset ring-blue-400':''}`}>
                      {day && <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1 ${isTod?'bg-blue-600 text-white':di===0?'text-red-500':di===6?'text-blue-500':'text-gray-700'}`}>{day}</span>}
                      <div className="space-y-0.5">
                        {ds.slice(0,2).map(s=><div key={s.id} className={`text-white text-[10px] px-1 rounded truncate ${TYPE_COLOR[s.type]??'bg-gray-400'}`}>{s.title}</div>)}
                        {ds.length>2&&<div className="text-[10px] text-gray-400">+{ds.length-2}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="w-64 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">오늘 일정</h3>
              <span className="text-xs text-gray-400">{today.getMonth()+1}월 {today.getDate()}일</span>
            </div>
            {forDate(todayStr).length===0 ? <p className="text-xs text-gray-400 text-center py-3">일정 없음</p> : (
              <ul className="space-y-2">
                {forDate(todayStr).map(s=>(
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${TYPE_TEXT[s.type]}`}>{TYPE_LABEL[s.type]}</span>
                      <span className="text-xs text-gray-700 truncate">{s.title}</span>
                    </div>
                    <button onClick={()=>setSchedules(p=>p.filter(x=>x.id!==s.id))} className="text-red-400 text-xs shrink-0">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">주간 일정</h3>
            <div className="space-y-1.5">
              {weekDays.map((day,i)=>{
                const ds = forDate(toStr(day));
                const isTod = toStr(day)===todayStr;
                return (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-8 text-center shrink-0 ${isTod?'font-bold text-blue-600':'text-gray-500'}`}>
                      <div className="text-[10px]">{DAYS[i]}</div>
                      <div className="text-xs">{day.getDate()}</div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      {ds.length===0?<div className="h-4 border-b border-gray-100"/>:(
                        <div className="space-y-0.5">{ds.map(s=><div key={s.id} className={`text-white text-[10px] px-1.5 py-0.5 rounded truncate ${TYPE_COLOR[s.type]}`}>{s.title}</div>)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e=>e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-1">일정 추가</h3>
            <p className="text-xs text-gray-400 mb-4">{selDate}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">제목</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} autoFocus
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="일정 제목" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">종류</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="pipe">선배관</option>
                  <option value="install">기계설치</option>
                  <option value="as">AS</option>
                  <option value="other">기타</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={addSchedule} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
