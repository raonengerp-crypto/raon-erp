'use client';
import { useState } from 'react';

/* ── 타입 ── */
type ScType = '기계설치'|'현장 점검'|'자재 입고'|'AS 방문'|'선배관 점검';
type ViewMode = '월간'|'주간'|'일간';
interface Sc { id:number; title:string; date:string; time:string; type:ScType; site:string; }

/* ── 상수 ── */
const TC:Record<ScType,{bg:string;text:string;dot:string}> = {
  '기계설치':  {bg:'bg-blue-100',  text:'text-blue-700',  dot:'bg-blue-500'},
  '현장 점검': {bg:'bg-green-100', text:'text-green-700', dot:'bg-green-500'},
  '자재 입고': {bg:'bg-orange-100',text:'text-orange-700',dot:'bg-orange-500'},
  'AS 방문':   {bg:'bg-purple-100',text:'text-purple-700',dot:'bg-purple-500'},
  '선배관 점검':{bg:'bg-teal-100', text:'text-teal-700',  dot:'bg-teal-500'},
};
const DOW = ['일','월','화','수','목','금','토'];
const HOURS = Array.from({length:14},(_,i)=>i+7);
function toKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function weekStart(d:Date){const r=new Date(d);r.setDate(r.getDate()-r.getDay());r.setHours(0,0,0,0);return r;}
function monthCells(y:number,m:number):{date:Date;in:boolean}[]{
  const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate();
  const cells:{date:Date;in:boolean}[]=[];
  for(let i=first-1;i>=0;i--)cells.push({date:new Date(y,m-1,prev-i),in:false});
  for(let d=1;d<=days;d++)cells.push({date:new Date(y,m,d),in:true});
  while(cells.length%7)cells.push({date:new Date(y,m+1,cells.length-days-first+1),in:false});
  return cells;
}

const TODAY = new Date(); TODAY.setHours(0,0,0,0);
const TODAY_KEY = toKey(TODAY);

const SAMPLE:Sc[] = [
  {id:1,title:'에어컨 설치',date:'2024-06-03',time:'09:00',type:'기계설치',site:'강남구 사무소'},
  {id:2,title:'냉동기 점검',date:'2024-06-05',time:'14:00',type:'현장 점검',site:'용산 빌딩'},
  {id:3,title:'자재 입고',date:'2024-06-07',time:'10:00',type:'자재 입고',site:'본사 창고'},
  {id:4,title:'AS 수리',date:'2024-06-10',time:'11:00',type:'AS 방문',site:'마포구 아파트'},
  {id:5,title:'선배관 점검',date:'2024-06-12',time:'09:00',type:'선배관 점검',site:'송파구 현장'},
];

/* ── SVG 아이콘 ── */
const Ico = {
  Building:(p:{c?:string})=><svg className={p.c||'w-6 h-6'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>,
  Calendar:(p:{c?:string})=><svg className={p.c||'w-6 h-6'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>,
  Doc:(p:{c?:string})=><svg className={p.c||'w-6 h-6'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>,
  Card:(p:{c?:string})=><svg className={p.c||'w-6 h-6'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  Bell:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Shield:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Users:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Menu:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/></svg>,
  Plus:(p:{c?:string})=><svg className={p.c||'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round"/></svg>,
  ChevL:(p:{c?:string})=><svg className={p.c||'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round"/></svg>,
  ChevR:(p:{c?:string})=><svg className={p.c||'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round"/></svg>,
  Wallet:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4"/><circle cx="18" cy="12" r="2"/></svg>,
  List:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Bar:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Table:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>,
  Tag:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Pie:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>,
  Line:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Receipt:(p:{c?:string})=><svg className={p.c||'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><polyline points="6 2 3 2 3 22 21 22 21 2 18 2"/><rect x="6" y="2" width="12" height="4"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>,
};

/* ── 퀵메뉴 버튼 ── */
function QB({icon,label,color,bg,border}:{icon:React.ReactNode;label:string;color:string;bg:string;border:string}) {
  return (
    <button className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border ${border} ${bg} hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95`}>
      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${color}`}>{icon}</div>
      <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">{label}</span>
    </button>
  );
}

export default function Dashboard() {
  const [view, setView] = useState<ViewMode>('월간');
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(5);
  const [ws, setWs] = useState(()=>weekStart(new Date(2024,5,1)));
  const [dv, setDv] = useState(new Date(2024,5,1));
  const [scs, setScs] = useState<Sc[]>(SAMPLE);
  const [showForm, setShowForm] = useState(false);
  const [selDate, setSelDate] = useState('');
  const [form, setForm] = useState({title:'',time:'09:00',type:'기계설치' as ScType,site:''});

  const prev=()=>{if(view==='월간'){if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1);}else if(view==='주간'){const d=new Date(ws);d.setDate(d.getDate()-7);setWs(d);}else{const d=new Date(dv);d.setDate(d.getDate()-1);setDv(d);}};
  const next=()=>{if(view==='월간'){if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1);}else if(view==='주간'){const d=new Date(ws);d.setDate(d.getDate()+7);setWs(d);}else{const d=new Date(dv);d.setDate(d.getDate()+1);setDv(d);}};
  const goToday=()=>{const n=new Date();setYear(n.getFullYear());setMonth(n.getMonth());setWs(weekStart(n));const d=new Date(n);d.setHours(0,0,0,0);setDv(d);};
  const forDate=(date:Date)=>scs.filter(s=>s.date===toKey(date));
  const addSc=()=>{if(!form.title)return;setScs(p=>[...p,{id:Date.now(),date:selDate,...form}]);setForm({title:'',time:'09:00',type:'기계설치',site:''});setShowForm(false);};
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(ws);d.setDate(d.getDate()+i);return d;});
  const cells=monthCells(year,month);
  const headLabel=view==='월간'?`${year}년 ${month+1}월`:view==='주간'?`${ws.getMonth()+1}월 ${ws.getDate()}일 – ${weekDays[6].getMonth()+1}월 ${weekDays[6].getDate()}일`:`${dv.getFullYear()}년 ${dv.getMonth()+1}월 ${dv.getDate()}일`;

  const KPI=[
    {icon:<Ico.Building c="w-7 h-7"/>,ib:'bg-blue-50',ic:'text-blue-500',title:'진행 현장',val:'0 개',vc:'',sub:'전체 현장',link:'현장관리 바로가기 →',lc:'text-blue-500',grad:'from-blue-400 to-blue-300'},
    {icon:<Ico.Calendar c="w-7 h-7"/>,ib:'bg-emerald-50',ic:'text-emerald-500',title:'오늘 일정',val:'0 건',vc:'',sub:'예정된 일정',link:'일정관리 바로가기 →',lc:'text-emerald-500',grad:'from-emerald-400 to-teal-300'},
    {icon:<Ico.Doc c="w-7 h-7"/>,ib:'bg-orange-50',ic:'text-orange-500',title:'미수금',val:'0 원',vc:'text-orange-500',sub:'전체 미수금',link:'세무관리에서 확인 →',lc:'text-orange-500',grad:'from-orange-400 to-amber-300'},
    {icon:<Ico.Card c="w-7 h-7"/>,ib:'bg-purple-50',ic:'text-purple-500',title:'입금 예정',val:'0 원',vc:'text-purple-600',sub:'이번달 예정',link:'세무관리에서 확인 →',lc:'text-purple-500',grad:'from-purple-400 to-violet-300'},
  ];

  const CONTRACT=[
    {icon:<Ico.Doc c="w-5 h-5"/>,label:'계약 등록',color:'text-blue-600',bg:'bg-blue-50',border:'border-blue-100'},
    {icon:<Ico.Card c="w-5 h-5"/>,label:'입금 등록',color:'text-emerald-600',bg:'bg-emerald-50',border:'border-emerald-100'},
    {icon:<Ico.List c="w-5 h-5"/>,label:'입금 내역',color:'text-violet-600',bg:'bg-violet-50',border:'border-violet-100'},
    {icon:<Ico.Bell c="w-5 h-5"/>,label:'미수금 조회',color:'text-rose-600',bg:'bg-rose-50',border:'border-rose-100'},
    {icon:<Ico.Doc c="w-5 h-5"/>,label:'계약 현황',color:'text-indigo-600',bg:'bg-indigo-50',border:'border-indigo-100'},
    {icon:<Ico.Calendar c="w-5 h-5"/>,label:'입금 예정',color:'text-amber-600',bg:'bg-amber-50',border:'border-amber-100'},
    {icon:<Ico.Receipt c="w-5 h-5"/>,label:'영수증 관리',color:'text-teal-600',bg:'bg-teal-50',border:'border-teal-100'},
    {icon:<Ico.Bell c="w-5 h-5"/>,label:'입금 알림',color:'text-orange-600',bg:'bg-orange-50',border:'border-orange-100'},
  ];

  const COST=[
    {icon:<Ico.Wallet c="w-5 h-5"/>,label:'비용 등록',color:'text-blue-600',bg:'bg-blue-50',border:'border-blue-100'},
    {icon:<Ico.List c="w-5 h-5"/>,label:'비용 내역',color:'text-slate-600',bg:'bg-slate-50',border:'border-slate-200'},
    {icon:<Ico.Bar c="w-5 h-5"/>,label:'손익 현황',color:'text-emerald-600',bg:'bg-emerald-50',border:'border-emerald-100'},
    {icon:<Ico.Table c="w-5 h-5"/>,label:'현장별 손익',color:'text-violet-600',bg:'bg-violet-50',border:'border-violet-100'},
    {icon:<Ico.Tag c="w-5 h-5"/>,label:'비용 분류',color:'text-pink-600',bg:'bg-pink-50',border:'border-pink-100'},
    {icon:<Ico.Card c="w-5 h-5"/>,label:'예산 관리',color:'text-amber-600',bg:'bg-amber-50',border:'border-amber-100'},
    {icon:<Ico.Doc c="w-5 h-5"/>,label:'손익 보고서',color:'text-indigo-600',bg:'bg-indigo-50',border:'border-indigo-100'},
    {icon:<Ico.Line c="w-5 h-5"/>,label:'차트 보고서',color:'text-cyan-600',bg:'bg-cyan-50',border:'border-cyan-100'},
  ];

  return (
    <div className="space-y-4 -m-6 bg-gray-50 min-h-screen">

      {/* ── KPI ── */}
      <div className="px-6 pt-6 grid grid-cols-4 gap-4">
        {KPI.map((k,i)=>(
          <div key={i} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${k.grad}`}/>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${k.ib} ${k.ic} shadow-sm group-hover:scale-105 transition-transform`}>{k.icon}</div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase bg-gray-50 px-2 py-1 rounded-md">{k.title}</span>
            </div>
            <p className={`text-3xl font-extrabold tracking-tight ${k.vc||'text-gray-800'}`}>{k.val}</p>
            <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
            <div className="h-px bg-gray-100 my-3"/>
            <button className={`text-xs font-semibold ${k.lc}`}>{k.link}</button>
          </div>
        ))}
      </div>

      {/* ── 캘린더 ── */}
      <div className="px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* 캘린더 헤더 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-gray-800">오늘 일정</h2>
              <button onClick={goToday} className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">오늘</button>
              <button onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"><Ico.ChevL/></button>
              <button onClick={next} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"><Ico.ChevR/></button>
              <span className="text-sm font-bold text-gray-700">{headLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 text-xs font-semibold">
                {(['월간','주간','일간'] as ViewMode[]).map(v=>(
                  <button key={v} onClick={()=>setView(v)} className={`px-4 py-2 transition-colors ${view===v?'bg-blue-500 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>{v}</button>
                ))}
              </div>
              <button onClick={()=>{setSelDate(toKey(new Date()));setShowForm(true);}} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 shadow-sm">
                <Ico.Plus/> 일정 등록
              </button>
            </div>
          </div>

          {/* 월간 뷰 */}
          {view==='월간'&&(
            <div className="p-4">
              <div className="grid grid-cols-7 mb-1">
                {DOW.map((d,i)=><div key={d} className={`text-center text-[11px] font-bold py-2 ${i===0?'text-red-500':i===6?'text-blue-500':'text-gray-400'}`}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-b-xl overflow-hidden">
                {cells.map((cell,idx)=>{
                  const ds=forDate(cell.date),isTod=toKey(cell.date)===TODAY_KEY,dow=cell.date.getDay();
                  return (
                    <div key={idx} onClick={()=>{if(cell.in){setSelDate(toKey(cell.date));setShowForm(true);}}}
                      className={`min-h-[100px] border-b border-r border-gray-100 p-1.5 ${!cell.in?'bg-gray-50/60':'bg-white hover:bg-blue-50/40'} cursor-pointer transition-colors`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-[11px] font-bold rounded-full mb-1 ${isTod?'bg-blue-500 text-white':!cell.in?'text-gray-300':dow===0?'text-red-500':dow===6?'text-blue-500':'text-gray-700'}`}>{cell.date.getDate()}</span>
                      <div className="space-y-0.5">
                        {ds.slice(0,2).map(s=>{const c=TC[s.type];return(
                          <div key={s.id} className={`flex items-center gap-1 px-1.5 py-[3px] rounded-md text-[10px] ${c.bg} ${c.text}`}>
                            <span className={`w-1 h-1 rounded-full shrink-0 ${c.dot}`}/><span className="font-bold">{s.time}</span><span className="truncate">{s.title}</span>
                          </div>
                        );})}
                        {ds.length>2&&<div className="text-[10px] text-gray-400 px-1">+{ds.length-2}개</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* 범례 */}
              <div className="flex items-center gap-4 mt-3 px-1 flex-wrap">
                {(Object.keys(TC) as ScType[]).map(t=>(
                  <div key={t} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${TC[t].dot}`}/>
                    <span className="text-xs text-gray-500 font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 주간 뷰 */}
          {view==='주간'&&(
            <div className="p-4">
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <div className="w-12 shrink-0 border-r border-gray-200"/>
                  {weekDays.map((day,i)=>{const isTod=toKey(day)===TODAY_KEY;return(
                    <div key={i} className={`flex-1 py-2 text-center border-r border-gray-200 last:border-r-0 ${isTod?'bg-blue-50':''}`}>
                      <div className={`text-[10px] font-bold ${i===0?'text-red-400':i===6?'text-blue-400':'text-gray-400'}`}>{DOW[day.getDay()]}</div>
                      <div className={`mx-auto mt-1 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${isTod?'bg-blue-500 text-white':'text-gray-700'}`}>{day.getDate()}</div>
                    </div>
                  );})}
                </div>
                {HOURS.map(h=>(
                  <div key={h} className="flex border-b border-gray-100 last:border-b-0">
                    <div className="w-12 shrink-0 border-r border-gray-100 py-2 text-right pr-2 bg-gray-50"><span className="text-[10px] text-gray-400 font-medium">{String(h).padStart(2,'0')}:00</span></div>
                    {weekDays.map((day,di)=>{
                      const slots=forDate(day).filter(s=>parseInt(s.time.split(':')[0])===h);
                      return(
                        <div key={di} className="flex-1 border-r border-gray-100 last:border-r-0 p-1 min-h-[48px]">
                          {slots.map(s=>{const c=TC[s.type];return(
                            <div key={s.id} className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] mb-1 ${c.bg} ${c.text}`}>
                              <span className={`w-1 h-1 rounded-full shrink-0 ${c.dot}`}/><span className="font-bold">{s.time}</span><span className="truncate">{s.title}</span>
                            </div>
                          );})}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 일간 뷰 */}
          {view==='일간'&&(
            <div className="p-4">
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {HOURS.map(h=>{
                  const slots=forDate(dv).filter(s=>parseInt(s.time.split(':')[0])===h);
                  return(
                    <div key={h} className="flex border-b border-gray-100 last:border-b-0 min-h-[56px]">
                      <div className="w-16 shrink-0 border-r border-gray-100 py-3 pr-3 text-right bg-gray-50"><span className={`text-xs font-bold ${slots.length?'text-gray-600':'text-gray-300'}`}>{String(h).padStart(2,'0')}:00</span></div>
                      <div className="flex-1 p-2 space-y-1">
                        {slots.map(s=>{const c=TC[s.type];return(
                          <div key={s.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${c.bg} ${c.text}`}>
                            <div className={`w-1 h-7 rounded-full ${c.dot}`}/>
                            <div><span className="text-xs font-bold">{s.time}</span><p className="text-sm font-bold">{s.title}</p></div>
                            <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-full bg-white/70`}>{s.site}</span>
                          </div>
                        );})}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 하단 퀵메뉴 ── */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        {/* 계약/입금 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"/>
          <div className="flex">
            <div className="w-32 flex flex-col items-center justify-center gap-2 p-4 bg-blue-50/40 border-r border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center"><Ico.Doc c="w-6 h-6 text-blue-500"/></div>
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">계약 및 입금 내역을 확인하고 관리합니다.</p>
            </div>
            <div className="flex-1 p-3">
              <p className="text-xs font-bold text-gray-700 mb-2 px-1">계약 / 입금 현황</p>
              <div className="grid grid-cols-4 gap-2">
                {CONTRACT.map((b,i)=><QB key={i} {...b}/>)}
              </div>
            </div>
          </div>
        </div>
        {/* 비용/손익 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500"/>
          <div className="flex">
            <div className="w-32 flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50/40 border-r border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-center justify-center"><Ico.Pie c="w-6 h-6 text-emerald-500"/></div>
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">비용과 손익 내역을 확인하고 관리합니다.</p>
            </div>
            <div className="flex-1 p-3">
              <p className="text-xs font-bold text-gray-700 mb-2 px-1">비용 / 손익 현황</p>
              <div className="grid grid-cols-4 gap-2">
                {COST.map((b,i)=><QB key={i} {...b}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 일정 추가 모달 ── */}
      {showForm&&(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 text-lg mb-1">일정 등록</h3>
            <p className="text-xs text-gray-400 mb-5">{selDate}</p>
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 block mb-1.5 font-medium">제목 *</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} autoFocus className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="일정 제목 입력"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 block mb-1.5 font-medium">시간</label>
                  <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/></div>
                <div><label className="text-xs text-gray-500 block mb-1.5 font-medium">종류</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value as ScType})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {(Object.keys(TC) as ScType[]).map(t=><option key={t}>{t}</option>)}
                  </select></div>
              </div>
              <div><label className="text-xs text-gray-500 block mb-1.5 font-medium">현장명</label>
                <input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="현장명 입력"/></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 font-medium">취소</button>
              <button onClick={addSc} className="flex-1 py-2.5 text-sm bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold shadow-sm">등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
