'use client';
import React from 'react';

export default function ExamsPage() {
  const exams = [
    { id: 1, date: "24", month: "OCT", year: "2026", time: "10:00 AM", subject: "Discrete Mathematics", code: "CS-401", location: "Hall 4, Block A", status: "Urgent", type: "Mid-Term" },
    { id: 2, date: "27", month: "OCT", year: "2026", time: "02:00 PM", subject: "Modern History", code: "HS-202", location: "Online Lab 2", status: "Upcoming", type: "Assessment" },
    { id: 3, date: "30", month: "OCT", year: "2026", time: "09:30 AM", subject: "Operating Systems", code: "CS-403", location: "Hall 1, Block B", status: "Upcoming", type: "Theory" },
  ];

  return (
    <main className="px-6 md:px-12 py-10 bg-surface text-on-surface">
      {/* Dynamic Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tight leading-tight">My <span className="text-primary">Exams</span></h1>
          <p className="text-on-surface-variant mt-2 font-medium">Semester VII • Winter Session 2026</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-high p-2 rounded-2xl border border-outline-variant/30">
           <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
             <span className="material-symbols-outlined text-lg"></span> Hall Ticket
           </button>
           <button className="p-3 hover:bg-surface-container-highest rounded-xl transition-colors">
             <span className="material-symbols-outlined"></span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Side: Visual Exam Cards */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span> Active Schedule
            </h2>
          </div>

          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}

          {/* Past/Completed Section */}
          <div className="pt-8 opacity-50">
             <h2 className="text-lg font-bold mb-4">Past Assessments</h2>
             <div className="bg-surface-container-low border border-dashed border-outline-variant p-6 rounded-3xl flex justify-between items-center">
                <div className="flex gap-4 items-center">
                   <span className="material-symbols-outlined text-success"></span>    
                   <div>
                      <p className="font-bold">Technical Communication</p>
                      <p className="text-xs">Completed on Oct 21</p>
                   </div>
                </div>
                <span className="text-xs font-black uppercase text-success tracking-widest">Final Grade Pending</span>
             </div>
          </div>
        </div>

        {/* Right Side: Quick Info & Rules */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Exam Prep Status */}
          {/* <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary/30 relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Prep Progress</p>
                <h3 className="text-3xl font-bold mb-6">Keep it up!</h3>
                <div className="space-y-4">
                   <div className="flex justify-between text-sm font-bold">
                      <span>Coursework Done</span>
                      <span>85%</span>
                   </div>
                   <div className="w-full bg-white/20 h-2 rounded-full">
                      <div className="bg-white h-full w-[85%] rounded-full shadow-[0_0_10px_white]"></div>
                   </div>
                </div>
             </div>
             <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10">trending_up</span>
          </div> */}

          {/* Quick Guidelines */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-[2rem] shadow-sm">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary"></span> Important Rules
             </h3>
             <ul className="space-y-4">
                <GuidelineItem  text="Report 30 mins before the start time." />
                <GuidelineItem  text="ID Card & Hall Ticket is mandatory." />
                <GuidelineItem  text="Smartwatches/Mobiles are prohibited." />
             </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

// Components
function ExamCard({ exam }) {
  const isUrgent = exam.status === "Urgent";
  
  return (
    <div className={`group flex flex-col md:flex-row bg-surface-container-lowest border-2 rounded-[2rem] overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 
      ${isUrgent ? 'border-primary/20 shadow-lg shadow-primary/5' : 'border-transparent shadow-sm'}`}>
      
      {/* Date Block */}
      <div className={`p-6 md:w-32 flex flex-col items-center justify-center text-center transition-colors 
        ${isUrgent ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface'}`}>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{exam.month}</span>
        <span className="text-4xl font-black">{exam.date}</span>
        <span className="text-[10px] font-bold opacity-80">{exam.year}</span>
      </div>

      {/* Details Block */}
      <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-black bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded uppercase tracking-tighter">
                {exam.type}
             </span>
             <span className="text-xs text-on-surface-variant font-bold">{exam.code}</span>
          </div>
          <h3 className="text-xl font-black group-hover:text-primary transition-colors">{exam.subject}</h3>
          <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
             <span className="flex items-center gap-1 text-xs font-medium">
                <span className="material-symbols-outlined text-sm">schedule</span> {exam.time}
             </span>
             <span className="flex items-center gap-1 text-xs font-medium">
                <span className="material-symbols-outlined text-sm"></span> {exam.location}
             </span>
          </div>
        </div>

        <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all
          ${isUrgent ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container-highest text-on-surface-variant'}`}>
          {isUrgent ? 'Prepare Now' : 'Details'}
        </button>
      </div>
    </div>
  );
}

function GuidelineItem({ icon, text }) {
  return (
    <li className="flex gap-3 items-start group">
      <span className="material-symbols-outlined text-primary text-lg group-hover:rotate-12 transition-transform">{icon}</span>
      <p className="text-xs font-medium leading-relaxed text-on-surface-variant">{text}</p>
    </li>
  );
}