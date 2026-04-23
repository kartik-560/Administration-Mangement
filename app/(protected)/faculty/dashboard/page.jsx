"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/* ═══ TIMETABLE DATA ═══ */
const INITIAL_REGULAR_TIMETABLE = {
  MON: [
    { id: 1, time: '10:15 AM - 11:15 AM', subject: 'Machine Learning (ML)', teacher: 'Mr. D. B. Khadse' },
    { id: 2, time: '11:15 AM - 12:15 PM', subject: 'Compiler Design (CD)', teacher: 'Ms. P. L. Katore' },
    { id: 3, time: '12:15 PM - 01:15 PM', subject: 'Data Science (DS)', teacher: 'Ms. A. N. Tikle' },
  ],
  TUE: [
    { id: 5, time: '10:15 AM - 11:15 AM', subject: 'EOII', teacher: 'Ms. S. S. Despande' },
    { id: 6, time: '11:15 AM - 12:15 PM', subject: 'Machine Learning (ML)', teacher: 'Mr. D. B. Khadse' },
    { id: 8, time: '03:00 PM - 05:00 PM', subject: 'CD / PSL / H/W Labs', teacher: 'Respective Lab Assistants' },
  ],
  WED: [
    { id: 9,  time: '10:15 AM - 12:15 PM', subject: 'CD / PSL / H/W Labs', teacher: 'Respective Lab Assistants' },
    { id: 11, time: '03:00 PM - 05:00 PM', subject: 'Mini Project (A1)', teacher: 'Mr. K. N. Hande & Team' },
  ],
  THU: [
    { id: 12, time: '12:15 PM - 01:15 PM', subject: 'Data Science (DS)', teacher: 'Ms. A. N. Tikle' },
    { id: 14, time: '03:00 PM - 04:00 PM', subject: 'IPR', teacher: 'Ms. A. A. Nikose' },
  ],
  FRI: [
    { id: 15, time: '10:15 AM - 11:15 AM', subject: 'Compiler Design (CD)', teacher: 'Ms. P. L. Katore' },
    { id: 17, time: '02:00 PM - 03:00 PM', subject: 'IPR', teacher: 'Ms. A. A. Nikose' },
  ],
  SAT: [
    { id: 18, time: '10:15 AM - 12:15 PM', subject: 'Mini Project (A2/A3)', teacher: 'Mr. K. N. Hande & Team' },
  ],
};

const INITIAL_EXAM_TIMETABLE = { MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [] };

const ATTENDANCE = [
  { name: 'Alice Johnson', id: 'STU001', status: 'Present' },
  { name: 'Brian Tran',    id: 'STU002', status: 'Present' },
  { name: 'Carla Mendez',  id: 'STU003', status: 'Absent'  },
  { name: 'David Park',    id: 'STU004', status: 'Present' },
];

const FOLDERS = [
  { name: 'Calculus I Notes', items: 12, colorClass: 'text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400', iconColor: 'text-blue-600 dark:text-blue-400' },
  { name: 'Lab Manuals',      items: 4,  colorClass: 'text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400', iconColor: 'text-purple-600 dark:text-purple-400' },
  { name: 'Assignments',      items: 8,  colorClass: 'text-green-600 bg-green-500/10 border-green-500/20 dark:text-green-400', iconColor: 'text-green-600 dark:text-green-400' },
];

/* ═══ PRIORITY COLORS ═══ */
const PRIORITY_COLOR = {
  High:   "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  Low:    "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
};

/* ═══ HELPERS ═══ */
const getStatusClasses = (status) => {
  switch (status) {
    case 'Present': return 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400';
    case 'Absent':  return 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400';
    case 'Late':    return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
    default:        return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400';
  }
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusClasses(status)}`}>
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════
   DEPT NOTICES PANEL (reads from HOD)
═══════════════════════════════════════════ */
function DeptNoticesPanel({ notices }) {
  if (!notices || notices.length === 0) return null;
  const recent = notices.slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#4c6ef5]"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></svg>
          <h3 className="text-base font-bold text-gray-900 dark:text-white m-0">Department Notices</h3>
          {notices.filter(n => !n.read).length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#4c6ef5] text-white text-[9px] font-bold">
              {notices.filter(n => !n.read).length} new
            </span>
          )}
        </div>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Synced from HOD</span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
        {recent.map((n) => (
          <div key={n.id} className={`px-6 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!n.read ? "bg-blue-50/40 dark:bg-blue-900/5" : ""}`}>
            {!n.read
              ? <div className="w-2 h-2 rounded-full bg-[#4c6ef5] shrink-0" />
              : <div className="w-2 h-2 shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white m-0 truncate">{n.title}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 m-0">{n.date}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${PRIORITY_COLOR[n.priority] || ""}`}>
              {n.priority}
            </span>
            {n.category && <span className="text-[10px] text-gray-400 hidden sm:block font-medium">{n.category}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NEXT MEETING PILL
═══════════════════════════════════════════ */
function NextMeetingBanner({ meeting }) {
  if (!meeting) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#4c6ef5]/5 border border-[#4c6ef5]/20 rounded-xl text-xs">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#4c6ef5] shrink-0"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
      <span className="font-bold text-gray-700 dark:text-gray-300">Next Meeting:</span>
      <span className="text-gray-600 dark:text-gray-400 truncate">{meeting.title}</span>
      <span className="text-[#4c6ef5] font-bold shrink-0">{meeting.date} · {meeting.time}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN FACULTY DASHBOARD
═══════════════════════════════════════════ */
export default function FacultyDashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [regularTimetable, setRegularTimetable]       = useState(INITIAL_REGULAR_TIMETABLE);
  const [examTimetable, setExamTimetable]             = useState(INITIAL_EXAM_TIMETABLE);
  const [timetableView, setTimetableView]             = useState('Regular');

  /* ══ SHARED STATE FROM HOD DASHBOARD ══ */
  const [deptNotices, setDeptNotices]     = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [nextMeeting, setNextMeeting]     = useState(null);
  const [onLeaveCount, setOnLeaveCount]   = useState(0);
  // New notice notification flash
  const [noticeFlash, setNoticeFlash]     = useState(false);

  /* ══ LOAD SHARED HOD DATA ══ */
  useEffect(() => {
    const loadHODData = () => {
      try {
        // Notices from HOD
        const rawNotices = localStorage.getItem("shared_notices");
        if (rawNotices) {
          const parsed = JSON.parse(rawNotices);
          setDeptNotices(parsed);
          const unread = parsed.filter(n => !n.read).length;
          if (unread > 0) {
            setNoticeFlash(true);
            setTimeout(() => setNoticeFlash(false), 4000);
          }
        }

        // Pending leave count from HOD
        const rawLeaves = localStorage.getItem("shared_leave_requests");
        if (rawLeaves) {
          const parsed = JSON.parse(rawLeaves);
          setPendingLeaves(parsed.filter(lr => lr.status === "Pending").length);
        }

        // Next meeting from HOD
        const rawMeetings = localStorage.getItem("shared_meetings");
        if (rawMeetings) {
          const parsed = JSON.parse(rawMeetings);
          setNextMeeting(parsed.length > 0 ? parsed[0] : null);
        }

        // Faculty on-leave count from HOD
        const rawFaculty = localStorage.getItem("shared_faculty");
        if (rawFaculty) {
          const parsed = JSON.parse(rawFaculty);
          setOnLeaveCount(parsed.filter(f => f.leaveToday).length);
        }
      } catch (_) {}
    };

    loadHODData();
    window.addEventListener("storage", loadHODData);
    return () => window.removeEventListener("storage", loadHODData);
  }, []);

  /* ══ TIMETABLE SYNC (existing logic) ══ */
  useEffect(() => {
    const loadMergedTimetable = () => {
      const savedRegular = localStorage.getItem('regular_timetable');
      const savedExam    = localStorage.getItem('exam_timetable');

      const processData = (savedData, initialData) => {
        const mergedData = JSON.parse(JSON.stringify(initialData));
        const daysMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        if (savedData) {
          const parsed = JSON.parse(savedData);
          Object.keys(parsed).forEach(dateStr => {
            const dayKey = daysMap[new Date(dateStr).getDay()];
            if (mergedData[dayKey] !== undefined) {
              parsed[dateStr].forEach(slot => {
                mergedData[dayKey].push({
                  id: slot.id,
                  time: `${slot.startTime} - ${slot.endTime}`,
                  subject: slot.subject,
                  teacher: slot.teacher,
                });
              });
            }
          });
        }
        return mergedData;
      };

      setRegularTimetable(processData(savedRegular, INITIAL_REGULAR_TIMETABLE));
      setExamTimetable(processData(savedExam, INITIAL_EXAM_TIMETABLE));
    };

    loadMergedTimetable();
    window.addEventListener('storage', loadMergedTimetable);
    return () => window.removeEventListener('storage', loadMergedTimetable);
  }, []);

  const currentTimetable = timetableView === 'Regular' ? regularTimetable : examTimetable;
  const unreadNotices    = deptNotices.filter(n => !n.read).length;

  const sidebarItems = [
    { id: 'Overview',      label: 'Overview',           href: '/faculty/dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'Teaching',      label: 'Teaching Dashboard', href: '/faculty/teaching',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg> },
    { id: 'HOD',           label: 'HOD Portal',         href: '/faculty/hod',       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { id: 'Non-Teaching',  label: 'Non-Teaching Staff', href: '/faculty/non_teaching',                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="flex h-full min-h-screen w-full bg-gray-50 dark:bg-[#0b0d14] text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#13151e] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-[width,transform] duration-300 ease-in-out overflow-hidden group/sidebar lg:relative ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20 lg:hover:w-64'}`}>
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center shrink-0 h-[73px]">
          <div className="w-8 h-8 rounded-lg bg-[#4c6ef5] text-white flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z"/></svg>
          </div>
          <h2 className="font-bold text-base tracking-tight m-0 ml-4 whitespace-nowrap opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">PBCOE Portal</h2>
        </div>

        <div className="px-4 py-6 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-2">
            {sidebarItems.map(item => (
              <Link key={item.id} href={item.href} className="block w-full">
                <button onClick={() => setIsMobileSidebarOpen(false)}
                  className={`w-full text-left p-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center relative ${item.id === 'Overview' ? 'bg-[#4c6ef5]/10 text-[#4c6ef5] dark:bg-[#4c6ef5]/20 dark:text-[#4c6ef5]' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 relative">
                    {item.icon}
                    {/* ✅ HOD badge on HOD Portal link */}
                    {item.id === 'HOD' && (pendingLeaves + unreadNotices) > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                        {pendingLeaves + unreadNotices}
                      </span>
                    )}
                  </div>
                  <span className="whitespace-nowrap ml-4 opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">{item.label}</span>
                  {item.id === 'Overview' && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#4c6ef5] lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity" />}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto relative">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#13151e] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <h2 className="font-bold text-base tracking-tight m-0">Dashboard</h2>
          <div className="flex items-center gap-3">
            {/* ✅ Bell icon shows unread notice count */}
            {unreadNotices > 0 && (
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${noticeFlash ? "animate-bounce" : ""}`}>
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">{unreadNotices}</span>
              </div>
            )}
            <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 rounded-md border border-gray-300 dark:border-gray-700">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 18v-2h18v2H3zm0-5v-2h18v2H3zm0-5V6h18v2H3z"/></svg>
            </button>
          </div>
        </div>

        <div className="px-6 md:px-8 py-8 w-full max-w-[1600px] mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white m-0">Faculty Overview</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">
                Good morning, Dr. Smith. Here's your schedule for today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/faculty/timetable/add">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-all active:scale-95">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Manage Schedule
                </button>
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#4c6ef5] text-white rounded-lg text-xs font-bold hover:bg-blue-600 shadow-md transition-all active:scale-95">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                New Announcement
              </button>
            </div>
          </div>

          {/* ✅ NEW NOTICE FLASH BANNER */}
          {noticeFlash && unreadNotices > 0 && (
            <div className="flex items-center gap-3 px-5 py-3 bg-[#4c6ef5]/10 border border-[#4c6ef5]/30 rounded-xl text-sm font-semibold text-[#4c6ef5] animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
              {unreadNotices} new department notice{unreadNotices > 1 ? "s" : ""} from HOD — scroll down to view
            </div>
          )}

          {/* ✅ NEXT MEETING BANNER (from HOD Meetings) */}
          {nextMeeting && <NextMeetingBanner meeting={nextMeeting} />}

          {/* ✅ STAT CARDS — 4th card is dynamic from HOD */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              {
                label: 'Classes Today', value: '4 Classes', sub: 'Next: 10:30 AM',
                subClass: 'text-blue-600',
                iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>,
              },
              {
                label: 'Pending Attendance', value: '2 Sections', sub: 'Action required',
                subClass: 'text-purple-600',
                iconClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M9 11.75c-2.34 0-7 1.17-7 3.5V19h14v-3.75c0-2.33-4.66-3.5-7-3.5zM9 10c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm11.5 1-1.4-1.4L15 13.7l-2.1-2.1-1.4 1.4 3.5 3.5z"/></svg>,
              },
              {
                label: 'Materials', value: '15 Files', sub: '+3 New',
                subClass: 'text-gray-600',
                iconClass: 'bg-gray-100 dark:bg-gray-800 text-gray-600',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>,
              },
            ].map((c, i) => (
              <div key={i} className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-center justify-between gap-3 hover:-translate-y-1 transition-transform">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{c.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white m-0 leading-none">{c.value}</p>
                  <p className={`text-[11px] font-semibold mt-1.5 ${c.subClass}`}>{c.sub}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.iconClass}`}>{c.icon}</div>
              </div>
            ))}

            {/* ✅ 4th CARD: Dynamic — HOD Pending Approvals or Notices */}
            <div className={`bg-white dark:bg-[#13151e] border p-6 rounded-2xl shadow-sm flex items-center justify-between gap-3 hover:-translate-y-1 transition-transform ${unreadNotices > 0 ? "border-[#4c6ef5]/30 dark:border-[#4c6ef5]/30" : "border-gray-200 dark:border-gray-800"}`}>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  {unreadNotices > 0 ? "Dept Notices" : pendingLeaves > 0 ? "HOD Pending" : "Dept Status"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white m-0 leading-none">
                  {unreadNotices > 0 ? unreadNotices : pendingLeaves > 0 ? pendingLeaves : "✓"}
                </p>
                <p className={`text-[11px] font-semibold mt-1.5 ${unreadNotices > 0 ? "text-[#4c6ef5]" : pendingLeaves > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {unreadNotices > 0
                    ? `${unreadNotices} unread notice${unreadNotices > 1 ? "s" : ""}`
                    : pendingLeaves > 0
                    ? `${pendingLeaves} leave${pendingLeaves > 1 ? "s" : ""} awaiting`
                    : "All clear today"
                  }
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative ${unreadNotices > 0 ? "bg-[#4c6ef5]/10 text-[#4c6ef5]" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                {noticeFlash && (
                  <span className="absolute inset-0 rounded-xl bg-[#4c6ef5]/20 animate-ping" />
                )}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ✅ FACULTY ON LEAVE ALERT (from HOD Faculty tab) */}
          {onLeaveCount > 0 && (
            <div className="flex items-center gap-3 px-5 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500 shrink-0"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 m-0">
                {onLeaveCount} faculty member{onLeaveCount > 1 ? "s are" : " is"} on leave today — schedule may be affected
              </p>
              <Link href="/faculty/hod" className="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0">
                View in HOD Portal →
              </Link>
            </div>
          )}

          {/* SCHEDULE GRID */}
          <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 w-full overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">Weekly Schedule</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Class: Sixth semester B.Tech (CSE)</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/faculty/timetable/add" className="text-xs font-bold text-[#4c6ef5] hover:underline">Edit Timetable</Link>
                <select value={timetableView} onChange={(e) => setTimetableView(e.target.value)} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-semibold rounded-lg px-3 py-2 outline-none">
                  <option value="Regular">Regular Timetable</option>
                  <option value="Exam">Exam Timetable</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[1000px]">
                {Object.keys(currentTimetable).map((day) => (
                  <div key={day} className="flex-1 min-w-[160px] flex flex-col">
                    <h4 className="text-center font-bold text-sm text-gray-900 dark:text-white mb-4 uppercase tracking-wider">{day}</h4>
                    <div className="space-y-3 flex-1">
                      {currentTimetable[day].length > 0 ? (
                        [...currentTimetable[day]]
                          .sort((a, b) => new Date('1970/01/01 ' + a.time.split(' - ')[0]) - new Date('1970/01/01 ' + b.time.split(' - ')[0]))
                          .map((slot) => (
                            <div key={slot.id} className={`relative bg-gray-50 dark:bg-[#0b0d14] border border-gray-200 dark:border-gray-800 border-l-4 rounded-r-xl p-3 shadow-sm ${timetableView === 'Exam' ? 'border-l-red-500' : 'border-l-[#4c6ef5]'}`}>
                              <p className={`text-[10px] font-bold mb-1 ${timetableView === 'Exam' ? 'text-red-500' : 'text-[#4c6ef5]'}`}>{slot.time}</p>
                              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{slot.subject}</p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 font-medium">{slot.teacher}</p>
                            </div>
                          ))
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center h-24 flex items-center justify-center">
                          <p className="text-xs font-medium text-gray-400">No Classes</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ATTENDANCE + FOLDERS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4 flex-wrap">
                <h3 className="text-base font-bold text-gray-900 dark:text-white m-0">Attendance: Class 10A</h3>
                <button className="px-4 py-2 bg-[#4c6ef5] text-white rounded-lg text-xs font-bold hover:bg-blue-600 shadow-sm transition-all active:scale-95">Submit Record</button>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                      {['Student', 'ID', 'Status'].map((h, i) => (
                        <th key={i} className="px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                    {ATTENDANCE.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-3 text-xs font-bold text-gray-900 dark:text-white">{row.name}</td>
                        <td className="px-6 py-3 text-xs text-gray-500 font-mono">{row.id}</td>
                        <td className="px-6 py-3"><StatusBadge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white m-0">My Folders</h3>
                <button className="bg-transparent text-[#4c6ef5] text-xl font-bold hover:scale-110">+</button>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {FOLDERS.map((folder, idx) => (
                  <div key={idx} className={`p-3 border rounded-xl cursor-pointer transition-all hover:shadow-sm ${folder.colorClass}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 mb-2 ${folder.iconColor}`}><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                    <p className="text-[11px] font-bold m-0 truncate">{folder.name}</p>
                    <p className="text-[9px] font-medium m-0 mt-0.5 opacity-80">{folder.items} items</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ DEPT NOTICES PANEL — live from HOD */}
          <DeptNoticesPanel notices={deptNotices} />

        </div>
      </main>
    </div>
  );
}