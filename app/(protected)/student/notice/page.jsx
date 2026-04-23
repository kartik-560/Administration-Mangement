'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function NoticePage() {
  const router = useRouter();

  const notices = [
    {
      id: 1,
      title: "End Semester Examination Schedule - June 2026",
      date: "Oct 24, 2026",
      category: "Exams",
      description: "The tentative timetable for the upcoming B.Tech Semester VI examinations has been released. Please check the portal for details.",
      isUrgent: true
    },
    {
      id: 2,
      title: "Workshop on Natural Language Processing",
      date: "Oct 22, 2026",
      category: "Academic",
      description: "Dr. Khadse will be conducting a hands-on workshop on Transformers and LLMs this Saturday in Lab 4.",
      isUrgent: false
    },
    {
      id: 3,
      title: "Campus Recruitment Drive: TechCorp Solutions",
      date: "Oct 20, 2026",
      category: "Placement",
      description: "Registration is now open for the TechCorp recruitment drive. Eligible students must apply by Oct 25.",
      isUrgent: false
    },
    {
      id: 4,
      title: "Annual Sports Meet 'Khel-2026'",
      date: "Oct 18, 2026",
      category: "Events",
      description: "Registrations for track and field events are now open at the physical education department.",
      isUrgent: false
    }
  ];

  return (
    <main className="px-6 md:px-10 pb-12">
      {/* 1. Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
            Notice Board
          </h1>
          <p className="text-muted-foreground font-body">
            Stay updated with the latest <span className="text-primary font-semibold">Campus Announcements</span>
          </p>
        </div>
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Dashboard
        </button>
      </header>

      {/* 2. Notices List Section */}
      <section className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
          <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">campaign</span>
            Recent Announcements
          </h2>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {notices.length} TOTAL
          </span>
        </div>

        <div className="divide-y divide-border">
          {notices.map((notice) => (
            <NoticeRow key={notice.id} notice={notice} />
          ))}
        </div>
      </section>
    </main>
  );
}

// Helper Component for Notice List Rows
function NoticeRow({ notice }) {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Exams': return 'bg-red-100 text-red-600';
      case 'Academic': return 'bg-blue-100 text-blue-600';
      case 'Placement': return 'bg-purple-100 text-purple-600';
      case 'Events': return 'bg-green-100 text-green-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 hover:bg-muted/10 transition-colors group cursor-pointer">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        {/* Date Section */}
        <div className="w-24 flex-shrink-0">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
            {notice.date.split(',')[1]?.trim()}
          </p>
          <p className="text-sm font-bold text-foreground">
            {notice.date.split(',')[0]}
          </p>
        </div>

        {/* Content Section */}
        <div className="flex-grow space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${getCategoryColor(notice.category)}`}>
              {notice.category}
            </span>
            {notice.isUrgent && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[9px] font-bold text-red-500 uppercase">High Priority</span>
              </div>
            )}
          </div>
          <h4 className="text-base font-bold group-hover:text-primary transition-colors">
            {notice.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {notice.description}
          </p>
        </div>

        {/* View Arrow */}
        <div className="flex-shrink-0 hidden md:block">
          <span className="material-symbols-outlined text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all">
            chevron_right
          </span>
        </div>
      </div>
    </div>
  );
}