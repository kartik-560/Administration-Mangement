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
            Welcome back, Manan.
          </h1>
          <p className="text-muted-foreground font-body">
            Academic Progress: <span className="text-primary font-semibold">B.Tech • Semester VI</span>
          </p>
        </div>
        <div className="flex gap-3">
          {/* <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">Current CGPA</p>
            <p className="text-2xl font-bold text-primary">3.82</p>
          </div> */}
          <div className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="material-symbols-outlined fill-1"></span>
            <div className="text-sm">
              <p className="font-bold">Next Class</p>
              <p className="opacity-90">10:30 AM • NLP (Dr. Khadse)</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Stats Grid - Added Library & Fine Logic */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* <StatCard 
          title="Attendance" value="85%"  badge="On Track" 
          onClick={() => router.push('/student/attendance')} 
        /> */}
        <StatCard 
          title="Fee Status" value="₹0.00" subValue="No Dues"  badge="Clear"
          onClick={() => router.push('/student/fee-status')} 
        />
        <StatCard 
          title="Upcoming Exams" value="2 Active" subValue="Math 101, NLP"
          onClick={() => router.push('/student/upcoming-exams')} 
        />
        <StatCard 
          title="Library Due" value="Mar 15" subValue="Natural Language Processing" 
          onClick={() => router.push('/student/library/due')} 
        />
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* 3. Left: Weekly Timetable (Teacher Name ke sath) */}
        <div className="col-span-12 lg:col-span-8">
          <section className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary"></span>
                Weekly Time Table
              </h2>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">SECTION A</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="p-4 text-[10px] font-black text-muted-foreground uppercase border-r border-border/50 w-28">Time Slot</th>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <th key={day} className="p-4 text-[10px] font-black text-muted-foreground uppercase text-center">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <TimeSlot 
                    rowTime="10:30 - 11:30" 
                    data={[
                      { sub: 'NLP', prof: 'Dr. Khadse' },
                      { sub: 'OS', prof: 'Prof. Sharma' },
                      { sub: 'MATH', prof: 'Dr. Verma' },
                      { sub: 'DS', prof: 'Prof. Joshi' },
                      { sub: 'NLP', prof: 'Dr. Khadse' },
                      { sub: 'LAB', prof: 'Staff' }
                    ]} 
                  />
                  <TimeSlot 
                    rowTime="11:30 - 12:30" 
                    data={[
                      { sub: 'MATH', prof: 'Dr. Verma' },
                      { sub: 'DS', prof: 'Prof. Joshi' },
                      { sub: 'NLP', prof: 'Dr. Khadse' },
                      { sub: 'OS', prof: 'Prof. Sharma' },
                      { sub: 'DS', prof: 'Prof. Joshi' },
                      { sub: 'LAB', prof: 'Staff' }
                    ]} 
                  />
                  <tr className="bg-muted/10">
                    <td className="p-2 text-[9px] font-bold text-center border-r border-border/50 text-muted-foreground/40 italic">12:30 - 01:15</td>
                    <td colSpan="6" className="p-2 text-center text-[10px] font-bold tracking-[0.5em] text-muted-foreground/30 uppercase italic">Lunch Break</td>
                  </tr>
                  <TimeSlot 
                    rowTime="01:15 - 02:15" 
                    data={[
                      { sub: 'OS', prof: 'Prof. Sharma' },
                      { sub: 'MATH', prof: 'Dr. Verma' },
                      { sub: 'LAB', prof: 'Staff' },
                      { sub: 'DS', prof: 'Prof. Joshi' },
                      { sub: 'NLP', prof: 'Dr. Khadse' },
                      { sub: 'OS', prof: 'Prof. Sharma' }
                    ]} 
                  />
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 4. Right: Results Section */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex justify-between items-center">
              Latest Results
              <span className="material-symbols-outlined text-primary">analytics</span>
            </h2>
            <div className="space-y-4">
              <ResultRow subject="Discrete Math" marks="88/100" grade="A" />
              <ResultRow subject="Data Structs" marks="92/100" grade="A+" />
              <ResultRow subject="OS Design" marks="74/100" grade="B" />
            </div>
            <button className="w-full mt-8 py-3 bg-muted rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
              View Full Marksheet
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

// Optimized Helper Components
function StatCard({ title, value, icon, subValue, badge, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-surface p-6 rounded-2xl border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group active:scale-95"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl group-hover:scale-110 transition-transform">{icon}</span>
        {badge && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-2xl font-black">{value}</p>
      {subValue && <p className="text-[10px] text-muted-foreground mt-1 font-medium">{subValue}</p>}
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

function ResultRow({ subject, marks, grade }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0 group cursor-default">
      <div>
        <p className="text-sm font-bold group-hover:text-primary transition-colors">{subject}</p>
        <p className="text-[10px] text-muted-foreground">{marks}</p>
      </div>
      <span className={`text-sm font-black ${grade.startsWith('A') ? 'text-green-600' : 'text-amber-600'}`}>
        {grade}
      </span>
    </div>
  );
}