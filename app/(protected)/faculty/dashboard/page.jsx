"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

import {
  getSchedulesApi,
  getDepartmentNoticesApi,
  getTodayStatsApi
} from '@/features/faculty/faculty.api'; // Adjust path if you moved it

/* ═══ TIMETABLE DATA (Fallbacks while loading) ═══ */
const INITIAL_REGULAR_TIMETABLE = { MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [] };
const INITIAL_EXAM_TIMETABLE = { MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [] };

/* ═══ DAY MAPPING (Backend to Frontend) ═══ */
const DAY_MAP = {
  "Monday": "MON",
  "Tuesday": "TUE",
  "Wednesday": "WED",
  "Thursday": "THU",
  "Friday": "FRI",
  "Saturday": "SAT"
};

/* ═══ PRIORITY COLORS ═══ */
const PRIORITY_COLOR = {
  High: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  Low: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
};

/* ═══ COMPONENTS ═══ */
function DeptNoticesPanel({ notices }) {
  if (!notices || notices.length === 0) return null;
  const recent = notices.slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#4c6ef5]"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" /></svg>
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
          <div key={n.id || n._id} className={`px-6 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!n.read ? "bg-blue-50/40 dark:bg-blue-900/5" : ""}`}>
            {!n.read
              ? <div className="w-2 h-2 rounded-full bg-[#4c6ef5] shrink-0" />
              : <div className="w-2 h-2 shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white m-0 truncate">{n.subject || n.title}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 m-0">
                {n.publishDate ? new Date(n.publishDate).toLocaleDateString() : n.date}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${PRIORITY_COLOR[n.priority] || ""}`}>
              {n.priority || "Normal"}
            </span>
            {n.category && <span className="text-[10px] text-gray-400 hidden sm:block font-medium">{n.category}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Helper to convert 24h time ("14:30") to 12h time ("02:30 PM") for the UI
const formatTime12h = (time24) => {
  if (!time24) return "";
  let [hours, minutes] = time24.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

export default function FacultyDashboard() {
  const currentUser = useSelector((state) => state.auth.user);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  const [todayCount, setTodayCount] = useState(0);
const [nextClassTime, setNextClassTime] = useState("No classes left today");


  // Timetable State
  const [regularTimetable, setRegularTimetable] = useState(INITIAL_REGULAR_TIMETABLE);
  const [examTimetable, setExamTimetable] = useState(INITIAL_EXAM_TIMETABLE);
  const [timetableView, setTimetableView] = useState('Regular');

  // Shared Data State
  const [deptNotices, setDeptNotices] = useState([]);
  const [noticeFlash, setNoticeFlash] = useState(false);

  /* ══ REAL API DATA FETCHING ══ */

 useEffect(() => {
  if (!currentUser) return;

  // Safely extract department ID
  const currentDeptId = currentUser?.departmentId || currentUser?.facultyProfile?.departmentId;
  if (!currentDeptId) return;

  const fetchDashboardData = async () => {
    setIsDashboardLoading(true);
    try {
      // 1. Fetch all data in parallel
      const [schedulesRes, noticesRes, statsRes] = await Promise.all([
        getSchedulesApi(),
        getDepartmentNoticesApi(currentDeptId),
        getTodayStatsApi() // 👈 Added stats API call
      ]);

      // 2. Set Today's Class Count
      if (statsRes?.success) {
        setTodayCount(statsRes.data.todayClassesCount || 0);
      }

      // 3. Process Timetable & Determine "Next Class"
      if (schedulesRes?.data) {
        const reg = { MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [] };
        const exm = { MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [] };
        
        // --- Calculate "Next Class" Logic ---
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayName = daysArray[now.getDay()];

        let upcomingClasses = [];

        schedulesRes.data.forEach(slot => {
          const shortDay = DAY_MAP[slot.dayOfWeek];
          if (!shortDay) return;

          const teacherName = slot.faculty?.user?.firstName
            ? `${slot.faculty.user.firstName} ${slot.faculty.user.lastName || ""}`
            : slot.faculty?.name || "Teacher";

          const formattedSlot = {
            id: slot._id || slot.id,
            time: `${formatTime12h(slot.startTime)} - ${formatTime12h(slot.endTime)}`,
            subject: slot.subject?.name || "Subject",
            teacher: teacherName,
            // Hidden helper for sorting/calculating next class
            rawStart: slot.startTime 
          };

          // Group by isExam boolean
          if (slot.isExam) {
            exm[shortDay].push(formattedSlot);
          } else {
            reg[shortDay].push(formattedSlot);
          }

          // Check if this class is today and still upcoming
          if (slot.dayOfWeek === todayName) {
            const [h, m] = slot.startTime.split(':');
            const startMins = parseInt(h) * 60 + parseInt(m);
            if (startMins > currentMinutes) {
              upcomingClasses.push({ time: formatTime12h(slot.startTime), mins: startMins });
            }
          }
        });

        // Update states
        setRegularTimetable(reg);
        setExamTimetable(exm);

        // Set Next Class text
        if (upcomingClasses.length > 0) {
          const next = upcomingClasses.sort((a, b) => a.mins - b.mins)[0];
          setNextClassTime(`Next: ${next.time}`);
        } else {
          setNextClassTime("No classes left today");
        }
      }

      // 4. Process Notices
      if (noticesRes?.data) {
        const notices = noticesRes.data;
        setDeptNotices(notices);
        const unread = notices.filter(n => !n.read).length;
        // setUnreadNotices(unread); // Make sure you have this state!

        if (unread > 0) {
          setNoticeFlash(true);
          setTimeout(() => setNoticeFlash(false), 4000);
        }
      }

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  fetchDashboardData();
}, [currentUser]);

  const currentTimetable = timetableView === 'Regular' ? regularTimetable : examTimetable;
  const unreadNotices = deptNotices.filter(n => !n.read).length;

  if (isDashboardLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0b0d14]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#4c6ef5]" />
          <p className="text-sm font-bold text-gray-500 animate-pulse">Syncing Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen w-full bg-gray-50 dark:bg-[#0b0d14] text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      {/* <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#13151e] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-[width,transform] duration-300 ease-in-out overflow-hidden group/sidebar lg:relative ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20 lg:hover:w-64'}`}>
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center shrink-0 h-[73px]">
          <div className="w-8 h-8 rounded-lg bg-[#4c6ef5] text-white flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z" /></svg>
          </div>
          <h2 className="font-bold text-base tracking-tight m-0 ml-4 whitespace-nowrap opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">PBCOE Portal</h2>
        </div>
      </aside> */}

      {/* MAIN */}
      <main className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto relative">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#13151e] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <h2 className="font-bold text-base tracking-tight m-0">Dashboard</h2>
          <div className="flex items-center gap-3">
            {unreadNotices > 0 && (
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${noticeFlash ? "animate-bounce" : ""}`}>
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">{unreadNotices}</span>
              </div>
            )}
            <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 rounded-md border border-gray-300 dark:border-gray-700">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 18v-2h18v2H3zm0-5v-2h18v2H3zm0-5V6h18v2H3z" /></svg>
            </button>
          </div>
        </div>

        <div className="px-6 md:px-8 py-8 w-full max-w-[1600px] mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white m-0">Faculty Overview</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">
                Good morning, {currentUser?.firstName || 'Faculty'}. Here's your schedule for today.
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
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                New Announcement
              </button>
            </div>
          </div>

          {/* NEW NOTICE FLASH BANNER */}
          {noticeFlash && unreadNotices > 0 && (
            <div className="flex items-center gap-3 px-5 py-3 bg-[#4c6ef5]/10 border border-[#4c6ef5]/30 rounded-xl text-sm font-semibold text-[#4c6ef5] animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
              {unreadNotices} new department notice{unreadNotices > 1 ? "s" : ""} from HOD — scroll down to view
            </div>
          )}

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
  {/* Classes Today Card */}
  <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-center justify-between gap-3 hover:-translate-y-1 transition-transform">
    <div>
      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Classes Today</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white m-0 leading-none">
        {todayCount} {todayCount === 1 ? 'Class' : 'Classes'}
      </p>
      <p className="text-[11px] font-semibold mt-1.5 text-blue-600">
        {nextClassTime}
      </p>
    </div>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    </div>
  </div>

  {/* Dept Notices Card */}
  <div className={`bg-white dark:bg-[#13151e] border p-6 rounded-2xl shadow-sm flex items-center justify-between gap-3 hover:-translate-y-1 transition-transform ${unreadNotices > 0 ? "border-[#4c6ef5]/30 dark:border-[#4c6ef5]/30" : "border-gray-200 dark:border-gray-800"}`}>
    <div>
      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
        {unreadNotices > 0 ? "Dept Notices" : "Dept Status"}
      </p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white m-0 leading-none">
        {unreadNotices > 0 ? unreadNotices : "✓"}
      </p>
      <p className={`text-[11px] font-semibold mt-1.5 ${unreadNotices > 0 ? "text-[#4c6ef5]" : "text-green-600"}`}>
        {unreadNotices > 0
          ? `${unreadNotices} unread notice${unreadNotices > 1 ? "s" : ""}`
          : "All clear today"
        }
      </p>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative ${unreadNotices > 0 ? "bg-[#4c6ef5]/10 text-[#4c6ef5]" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
      {noticeFlash && (
        <span className="absolute inset-0 rounded-xl bg-[#4c6ef5]/20 animate-ping" />
      )}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      </svg>
    </div>
  </div>
</div>

          {/* SCHEDULE GRID */}
          <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 w-full overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">Weekly Schedule</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Your assigned classes</p>
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
                      {currentTimetable[day]?.length > 0 ? (
                        [...currentTimetable[day]]
                          // Sort slots sequentially
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

          <DeptNoticesPanel notices={deptNotices} />

        </div>
      </main>
    </div>
  );
}