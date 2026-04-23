'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <main className="px-6 md:px-10 pb-12">
      {/* 1. Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
            Welcome back.
          </h1>
          <p className="text-muted-foreground font-body">
            Academic Progress: <span className="text-primary font-semibold">B.Tech • Semester VI</span>
          </p>
        </div>
        
        <div >
          {/* <span className="material-symbols-outlined fill-1">schedule</span> */}
          <div className="text-sm">
            {/* <p className="font-bold">Next Class</p>
            <p className="opacity-90">10:30 AM • NLP (Dr. Khadse)</p> */}
          </div>
        </div>
      </header>

      {/* 2. Stats Row - Forced 3 columns (No stacking) */}
      <section className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
        <StatCard 
          title="Subjects" 
          value="06" 
          subValue="Semester VI" 
          icon="menu_book"
          onClick={() => router.push('/student/subjects')} 
        />
        <StatCard 
          title="Exams" 
          value="03" 
          subValue="New Alerts" 
          icon="notifications_active"
          onClick={() => router.push('/student/notifications')} 
        />
        <StatCard 
          title="Standing" 
          value="Good" 
          subValue="3.82 CGPA" 
          icon="military_tech"
          onClick={() => router.push('/student/performance')} 
        />
      </section>

      {/* 3. New Weekly Timetable (Full Width) */}
      <section className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_view_week</span>
            New Weekly Time Table
          </h2>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">BATCH 2024-25</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-4 text-[10px] font-black text-muted-foreground uppercase border-r border-border/50 w-28 text-left">Time Slot</th>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                  <th key={day} className="p-4 text-[10px] font-black text-muted-foreground uppercase text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <TimeSlot 
                rowTime="09:00 - 10:00" 
                data={[
                  { sub: 'OS', prof: 'Prof. Sharma' },
                  { sub: 'DS', prof: 'Prof. Joshi' },
                  { sub: 'MATH', prof: 'Dr. Verma' },
                  { sub: 'NLP', prof: 'Dr. Khadse' },
                  { sub: 'OS', prof: 'Prof. Sharma' }
                ]} 
              />
              <TimeSlot 
                rowTime="10:00 - 11:00" 
                data={[
                  { sub: 'NLP', prof: 'Dr. Khadse' },
                  { sub: 'OS', prof: 'Prof. Sharma' },
                  { sub: 'DS', prof: 'Prof. Joshi' },
                  { sub: 'MATH', prof: 'Dr. Verma' },
                  { sub: 'NLP', prof: 'Dr. Khadse' }
                ]} 
              />
              <tr className="bg-muted/5">
                <td className="p-2 text-[9px] font-bold text-center border-r border-border/50 text-muted-foreground/40 italic">11:00 - 11:15</td>
                <td colSpan="5" className="p-2 text-center text-[9px] font-bold tracking-[0.3em] text-muted-foreground/30 uppercase">Short Break</td>
              </tr>
              <TimeSlot 
                rowTime="11:15 - 12:15" 
                data={[
                  { sub: 'LAB', prof: 'System Lab' },
                  { sub: 'LAB', prof: 'System Lab' },
                  { sub: 'NLP', prof: 'Dr. Khadse' },
                  { sub: 'OS', prof: 'Prof. Sharma' },
                  { sub: 'DS', prof: 'Prof. Joshi' }
                ]} 
              />
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

// Optimized Helper Components
function StatCard({ title, value, icon, subValue, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-surface p-4 md:p-6 rounded-2xl border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group active:scale-95 flex flex-col items-center text-center sm:items-start sm:text-left"
    >
      <div className="mb-3">
        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </span>
      </div>
      <h3 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 line-clamp-1 w-full">
        {title}
      </h3>
      <p className="text-lg md:text-2xl font-black">{value}</p>
      {subValue && (
        <p className="text-[8px] md:text-[10px] text-muted-foreground mt-1 font-medium line-clamp-1">
          {subValue}
        </p>
      )}
    </div>
  );
}

function TimeSlot({ rowTime, data }) {
  return (
    <tr className="hover:bg-muted/10 transition-colors">
      <td className="p-4 text-[10px] font-bold text-muted-foreground border-r border-border/50 bg-muted/5 font-mono">
        {rowTime}
      </td>
      {data.map((item, idx) => (
        <td key={idx} className="p-2">
          <div className={`p-3 rounded-xl text-center border border-transparent hover:border-border hover:shadow-sm
            ${item.sub === 'LAB' ? 'bg-amber-50 text-amber-700' : 
              item.sub === 'NLP' ? 'bg-primary/5 text-primary' : 
              'bg-muted/40 text-foreground'} `}>
            <p className="text-[11px] font-black leading-none mb-1">{item.sub}</p>
            <p className="text-[8px] font-medium opacity-70 truncate uppercase">{item.prof}</p>
          </div>
        </td>
      ))}
    </tr>
  );
}