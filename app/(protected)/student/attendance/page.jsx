import React from 'react';

export default function AttendancePage() {
  return (
    <main className=" px-6 md:px-10 pb-12">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
            Attendance Overview
          </h1>
          <p className="text-muted-foreground font-body">
            Track your presence across all enrolled subjects.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface p-4 rounded-xl border border-border shadow-sm text-center min-w-[120px]">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">Total Avg.</p>
            <p className="text-2xl font-bold text-primary">85%</p>
          </div>
        </div>
      </header>

      {/* Attendance Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface p-6 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Classes Attended</p>
            <p className="text-xl font-bold">142 / 168</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <span className="material-symbols-outlined">cancel</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Classes Missed</p>
            <p className="text-xl font-bold">26</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shortage Risk</p>
            <p className="text-xl font-bold text-green-500">Low</p>
          </div>
        </div>
      </section>

      {/* Subject-wise Detailed Breakdown */}
      <section className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-xl font-bold">Subject-wise Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase text-muted-foreground bg-muted/10">
                <th className="px-6 py-4 font-bold">Subject</th>
                <th className="px-6 py-4 font-bold">Total Classes</th>
                <th className="px-6 py-4 font-bold">Present</th>
                <th className="px-6 py-4 font-bold">Percentage</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AttendanceRow 
                subject="Advanced Algorithms" 
                total={42} 
                present={38} 
                color="bg-primary"
              />
              <AttendanceRow 
                subject="Deep Learning" 
                total={36} 
                present={30} 
                color="bg-blue-500"
              />
              <AttendanceRow 
                subject="Operating System Design" 
                total={40} 
                present={32} 
                color="bg-orange-500"
              />
              <AttendanceRow 
                subject="Human Computer Interaction" 
                total={30} 
                present={28} 
                color="bg-purple-500"
              />
              <AttendanceRow 
                subject="Natural Language Processing" 
                total={20} 
                present={14} 
                color="bg-red-500"
              />
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function AttendanceRow({ subject, total, present, color }) {
  const percentage = Math.round((present / total) * 100);
  const isWarning = percentage < 75;

  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-6 py-4">
        <p className="text-sm font-bold">{subject}</p>
        <p className="text-[10px] text-muted-foreground uppercase">Theory + Lab</p>
      </td>
      <td className="px-6 py-4 text-sm font-medium">{total}</td>
      <td className="px-6 py-4 text-sm font-medium">{present}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${color}`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-bold">{percentage}%</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {isWarning ? (
          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Low Attendance</span>
        ) : (
          <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded uppercase">On Track</span>
        )}
      </td>
    </tr>
  );
}