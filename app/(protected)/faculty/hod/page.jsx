"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════
   MASTER DATA (defaults)
═══════════════════════════════════════════ */
const DEFAULT_FACULTY = [
  { id: "F001", name: "Mr. D. B. Khadse",   designation: "Associate Professor", subjects: ["Machine Learning", "AI"], workload: 18, status: "Active",  leaveToday: false, experience: "12 yrs" },
  { id: "F002", name: "Ms. P. L. Katore",   designation: "Assistant Professor",  subjects: ["Compiler Design"],      workload: 14, status: "Active",  leaveToday: false, experience: "7 yrs"  },
  { id: "F003", name: "Ms. A. N. Tikle",    designation: "Assistant Professor",  subjects: ["Data Science"],         workload: 16, status: "Active",  leaveToday: false, experience: "9 yrs"  },
  { id: "F004", name: "Ms. S. S. Despande", designation: "Associate Professor",  subjects: ["EOII", "Networks"],     workload: 20, status: "Active",  leaveToday: true,  experience: "15 yrs" },
  { id: "F005", name: "Mr. K. N. Hande",    designation: "Professor",            subjects: ["Mini Project", "DBMS"], workload: 12, status: "Active",  leaveToday: false, experience: "22 yrs" },
  { id: "F006", name: "Ms. A. A. Nikose",   designation: "Assistant Professor",  subjects: ["IPR", "Ethics"],        workload: 10, status: "On Leave",leaveToday: true,  experience: "5 yrs"  },
];

const DEFAULT_LEAVE_REQUESTS = [
  { id: "LR001", faculty: "Ms. A. A. Nikose",   from: "Apr 21", to: "Apr 23", reason: "Medical Leave",     status: "Pending",  type: "Medical"  },
  { id: "LR002", faculty: "Ms. S. S. Despande", from: "Apr 22", to: "Apr 22", reason: "Personal Work",     status: "Pending",  type: "Personal" },
  { id: "LR003", faculty: "Mr. D. B. Khadse",   from: "Apr 28", to: "Apr 30", reason: "Conference Attend", status: "Approved", type: "Official" },
  { id: "LR004", faculty: "Ms. P. L. Katore",   from: "May 5",  to: "May 6",  reason: "Family Function",   status: "Rejected", type: "Personal" },
];

const DEFAULT_NOTICES = [
  { id: 1, title: "NBA Documentation Deadline",         date: "Apr 25, 2026", priority: "High",   category: "Accreditation", read: false },
  { id: 2, title: "Faculty Meeting – April End Review", date: "Apr 30, 2026", priority: "Medium", category: "Meeting",       read: false },
  { id: 3, title: "Result Analysis Report Submission",  date: "May 2, 2026",  priority: "High",   category: "Academic",      read: true  },
  { id: 4, title: "Anti-Ragging Committee Report",      date: "May 5, 2026",  priority: "Low",    category: "Compliance",    read: true  },
  { id: 5, title: "Research Paper Submission – IJCA",   date: "May 10, 2026", priority: "Medium", category: "Research",      read: false },
];

const DEFAULT_MEETINGS = [
  { id: 1, title: "Department Review Meeting",  date: "Apr 30, 2026", time: "11:00 AM", attendees: 8,  venue: "HOD Chamber"    },
  { id: 2, title: "NBA Preparation Session",    date: "May 3, 2026",  time: "10:00 AM", attendees: 12, venue: "Seminar Hall A" },
  { id: 3, title: "Research Committee Meeting", date: "May 8, 2026",  time: "02:00 PM", attendees: 6,  venue: "Conference Room"},
];

const DEPT_ATTENDANCE = [
  { month: "Jan", rate: 87 },
  { month: "Feb", rate: 82 },
  { month: "Mar", rate: 78 },
  { month: "Apr", rate: 84 }, // Latest month attendance
];

const STUDENT_PERFORMANCE = [
  { sem: "SEM I",   passRate: 88, avg: 71, backlog: 12 },
  { sem: "SEM II",  passRate: 82, avg: 68, backlog: 18 },
  { sem: "SEM III", passRate: 79, avg: 65, backlog: 21 },
  { sem: "SEM IV",  passRate: 85, avg: 70, backlog: 15 },
  { sem: "SEM V",   passRate: 90, avg: 74, backlog: 8  },
  { sem: "SEM VI",  passRate: 93, avg: 77, backlog: 5  },
];

const DEFAULT_RESEARCH = [
  { id: 1, title: "Federated Learning for Healthcare", faculty: "Mr. D. B. Khadse", journal: "IEEE Access",    status: "Published",    year: 2026 },
  { id: 2, title: "Compiler Optimization using ML",    faculty: "Ms. P. L. Katore", journal: "Springer LNCS",  status: "Under Review", year: 2026 },
  { id: 3, title: "NLP for Marathi Dialect Detection", faculty: "Ms. A. N. Tikle",  journal: "Elsevier NLP J", status: "Published",    year: 2025 },
  { id: 4, title: "Curriculum Design using OBE",       faculty: "Mr. K. N. Hande",  journal: "IJCA",           status: "Submitted",    year: 2026 },
];

/* ═══════════════════════════════════════════
   SHARED STORAGE UTILITY
═══════════════════════════════════════════ */
function saveShared(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch (_) {}
}

function loadShared(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

/* ═══════════════════════════════════════════
   HELPER COMPONENTS
═══════════════════════════════════════════ */
const BADGE_MAP = {
  High:           "bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400",
  Medium:         "bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400",
  Low:            "bg-green-500/10 text-green-600 border-green-500/25 dark:text-green-400",
  Approved:       "bg-green-500/10 text-green-600 border-green-500/25 dark:text-green-400",
  Pending:        "bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400",
  Rejected:       "bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400",
  Published:      "bg-blue-500/10 text-blue-600 border-blue-500/25 dark:text-blue-400",
  Submitted:      "bg-purple-500/10 text-purple-600 border-purple-500/25 dark:text-purple-400",
  "Under Review": "bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400",
  Active:         "bg-green-500/10 text-green-600 border-green-500/25 dark:text-green-400",
  "On Leave":     "bg-gray-500/10 text-gray-600 border-gray-500/25 dark:text-gray-400",
  Medical:        "bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400",
  Personal:       "bg-purple-500/10 text-purple-600 border-purple-500/25 dark:text-purple-400",
  Official:       "bg-blue-500/10 text-blue-600 border-blue-500/25 dark:text-blue-400",
};

const Badge = ({ label }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${BADGE_MAP[label] || ""}`}>
    {label}
  </span>
);

function MiniBar({ value, max = 100, color = "bg-[#4c6ef5]" }) {
  return (
    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function StatCard({ icon, label, value, sub, subColor = "text-gray-500", accent = "bg-[#4c6ef5]/10 text-[#4c6ef5]" }) {
  return (
    <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-200 shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none m-0">{value}</p>
        {sub && <p className={`text-[11px] font-semibold mt-1 ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: OVERVIEW
═══════════════════════════════════════════ */
// ✅ DYNAMIC: Added 'faculty' prop so it syncs instantly when new faculty is added
function OverviewSection({ faculty, leaveRequests, notices, onLeaveAction, onAddNotice }) {
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: "", date: "", priority: "Medium", category: "" });

  const pendingCount = leaveRequests.filter(lr => lr.status === "Pending").length;
  
  // ✅ DYNAMIC: Uses real state array
  const totalFaculty = faculty.length; 
  const activeToday  = faculty.filter(f => !f.leaveToday).length;
  // ✅ DYNAMIC: Gets latest attendance rate
  const latestAttendance = DEPT_ATTENDANCE[DEPT_ATTENDANCE.length - 1].rate;

  const handleAddNotice = () => {
    if (!noticeForm.title || !noticeForm.date) return;
    onAddNotice({ ...noticeForm, id: Date.now(), read: false });
    setNoticeForm({ title: "", date: "", priority: "Medium", category: "" });
    setShowNoticeForm(false);
  };

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          accent="bg-[#4c6ef5]/10 text-[#4c6ef5]"
          label="Total Faculty"
          value={totalFaculty} 
          sub={`${activeToday} active today`}
          subColor="text-[#4c6ef5]"
          icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>}
        />
        <StatCard
          accent="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          label="Total Students" value="248" sub="SEM I–VIII enrolled"
          subColor="text-purple-600 dark:text-purple-400"
          icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>}
        />
        <StatCard
          accent="bg-green-500/10 text-green-600 dark:text-green-400"
          label="Avg Attendance" 
          value={`${latestAttendance}%`} 
          sub="Latest Month Average"
          subColor="text-green-600 dark:text-green-400"
          icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M9 11.75c-2.34 0-7 1.17-7 3.5V19h14v-3.75c0-2.33-4.66-3.5-7-3.5zM9 10c1.66 0 3-1.34 3-3S10.66 4 9 4 6 5.34 6 8s1.34 2 3 2zm11.5 1-1.4-1.4L15 13.7l-2.1-2.1-1.4 1.4 3.5 3.5z"/></svg>}
        />
        <StatCard
          accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          label="Pending Approvals"
          value={pendingCount}
          sub={pendingCount > 0 ? "Leave requests waiting" : "All requests processed ✓"}
          subColor={pendingCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}
          icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 m-0">Attendance Trend</h3>
          <p className="text-[11px] text-gray-500 mb-4 m-0">Monthly department average</p>
          <div className="space-y-4">
            {DEPT_ATTENDANCE.map(({ month, rate }) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 w-8">{month}</span>
                <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-[#4c6ef5] rounded-lg flex items-center transition-all duration-700" style={{ width: `${rate}%` }}>
                    <span className="text-[10px] font-bold text-white ml-2">{rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="lg:col-span-3 bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white m-0">Leave Requests</h3>
            {pendingCount > 0
              ? <Badge label={`${pendingCount} Pending`} color="Pending" />
              : <span className="text-[10px] font-bold text-green-600 dark:text-green-400">All Clear ✓</span>
            }
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50 flex-1 overflow-y-auto">
            {leaveRequests.map((lr) => (
              <div key={lr.id} className="px-5 py-3.5 flex flex-wrap items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="flex-1 min-w-[160px]">
                  <p className="text-xs font-bold text-gray-900 dark:text-white m-0">{lr.faculty}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 m-0">{lr.from} → {lr.to} · {lr.reason}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label={lr.type} />
                  <Badge label={lr.status} />
                  {lr.status === "Pending" && (
                    <div className="flex gap-1.5">
                      <button onClick={() => onLeaveAction(lr.id, "Approved")} className="px-3 py-1 bg-green-500 text-white rounded-lg text-[10px] font-bold hover:bg-green-600 active:scale-95 transition-all">✓ Approve</button>
                      <button onClick={() => onLeaveAction(lr.id, "Rejected")} className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600 active:scale-95 transition-all">✗ Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white m-0">Department Notices</h3>
            {notices.filter(n => !n.read).length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#4c6ef5] text-white text-[9px] font-bold flex items-center justify-center">
                {notices.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button onClick={() => setShowNoticeForm(s => !s)} className="text-[11px] font-bold text-[#4c6ef5] hover:underline">
            + New Notice
          </button>
        </div>

        {showNoticeForm && (
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Notice Title *</label>
              <input value={noticeForm.title} onChange={e => setNoticeForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. NBA Documentation Deadline" className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5] transition-colors placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Date *</label>
              <input value={noticeForm.date} onChange={e => setNoticeForm(f => ({ ...f, date: e.target.value }))} placeholder="e.g. May 15, 2026" className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5] transition-colors placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Priority</label>
              <select value={noticeForm.priority} onChange={e => setNoticeForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button onClick={() => setShowNoticeForm(false)} className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleAddNotice} className="px-4 py-1.5 bg-[#4c6ef5] text-white rounded-lg text-xs font-bold hover:bg-blue-600 active:scale-95 transition-all">Publish Notice</button>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {notices.map((n) => (
            <div key={n.id} className={`px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!n.read ? "bg-blue-50/30 dark:bg-blue-900/5" : ""}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-[#4c6ef5]" : ""}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white m-0 truncate">{n.title}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 m-0">{n.date}</p>
              </div>
              <Badge label={n.priority} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: FACULTY MANAGEMENT
═══════════════════════════════════════════ */
function FacultySection({ faculty, onUpdateFaculty, onRequestLeave, onShowToast }) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: "", designation: "", subjects: "", experience: "", workload: 10
  });

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  // ✅ DYNAMIC: Add new faculty to main state (Syncs to Overview)
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.designation) return;

    const newEntry = {
      id: `F00${faculty.length + 1}`,
      name: newFaculty.name,
      designation: newFaculty.designation,
      subjects: newFaculty.subjects.split(",").map(s => s.trim()).filter(s => s),
      workload: Number(newFaculty.workload),
      status: "Active",
      leaveToday: false,
      experience: newFaculty.experience || "0 yrs"
    };

    onUpdateFaculty([newEntry, ...faculty]);
    setShowAddModal(false);
    setNewFaculty({ name: "", designation: "", subjects: "", experience: "", workload: 10 });
  };

  return (
    <div className="space-y-5">
      {/* Search & Add Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty or subject..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#4c6ef5] transition-colors text-gray-900 dark:text-white placeholder-gray-400" />
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4c6ef5] text-white rounded-xl text-xs font-bold hover:bg-blue-600 shadow-md active:scale-95 transition-all">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Add Faculty
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#13151e]">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white m-0">Add New Faculty</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                <input required value={newFaculty.name} onChange={e => setNewFaculty({...newFaculty, name: e.target.value})} placeholder="e.g. Dr. Ramesh Kumar" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Designation *</label>
                <select required value={newFaculty.designation} onChange={e => setNewFaculty({...newFaculty, designation: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]">
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Subjects (Comma separated)</label>
                <input value={newFaculty.subjects} onChange={e => setNewFaculty({...newFaculty, subjects: e.target.value})} placeholder="e.g. OS, DBMS, Networks" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Experience</label>
                  <input value={newFaculty.experience} onChange={e => setNewFaculty({...newFaculty, experience: e.target.value})} placeholder="e.g. 5 yrs" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]" />
                </div>
                 <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Workload (hrs)</label>
                  <input type="number" min="0" max="40" value={newFaculty.workload} onChange={e => setNewFaculty({...newFaculty, workload: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#4c6ef5] text-white rounded-lg text-xs font-bold hover:bg-blue-600 shadow-md active:scale-95 transition-all">Save Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:-translate-y-1 transition-transform duration-200 flex flex-col h-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#4c6ef5]/10 text-[#4c6ef5] flex items-center justify-center shrink-0 text-sm font-bold">
                {f.name.split(" ").slice(-1)[0][0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-gray-900 dark:text-white m-0 truncate">{f.name}</p>
                  {f.leaveToday && <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/25 px-1.5 py-0.5 rounded-full">On Leave</span>}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 m-0">{f.designation}</p>
              </div>
              <Badge label={f.status} />
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-4">
              {f.subjects.length > 0 ? f.subjects.map(s => (
                <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-[10px] font-semibold text-gray-600 dark:text-gray-300">{s}</span>
              )) : <span className="text-[10px] text-gray-400 italic">No subjects assigned</span>}
            </div>

            <div className="space-y-1.5 mt-auto">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Weekly Workload</span>
                <span className={`text-[10px] font-bold ${f.workload > 18 ? "text-red-500" : "text-green-600"}`}>{f.workload} hrs</span>
              </div>
              <MiniBar value={f.workload} max={24} color={f.workload > 18 ? "bg-red-500" : "bg-[#4c6ef5]"} />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
               <div className="flex flex-wrap gap-2 justify-between">
                 {/* ✅ DYNAMIC ACTIONS */}
                 <button onClick={() => onShowToast(`Loading profile for ${f.name}...`)} className="flex-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[10px] font-bold text-gray-700 dark:text-gray-300 transition-colors text-center border border-gray-200 dark:border-gray-700 active:scale-95">
                   View Profile
                 </button>
                 <button onClick={() => onShowToast(`Task assigned to ${f.name}.`)} className="flex-1 px-2 py-1.5 bg-[#4c6ef5]/5 hover:bg-[#4c6ef5]/10 rounded-lg text-[10px] font-bold text-[#4c6ef5] transition-colors text-center border border-[#4c6ef5]/20 active:scale-95">
                   Assignment
                 </button>
                 {/* ✅ LEAVE APPLICATION SYNC: Creates a new pending request */}
                 <button onClick={() => onRequestLeave(f.name)} className="flex-1 px-2 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 rounded-lg text-[10px] font-bold text-amber-600 transition-colors text-center border border-amber-500/20 active:scale-95">
                   Leave App.
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: STUDENT PERFORMANCE
═══════════════════════════════════════════ */
function PerformanceSection() {
  const best = [...STUDENT_PERFORMANCE].sort((a, b) => b.passRate - a.passRate)[0];
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-[#4c6ef5] to-[#748ffc] rounded-2xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider m-0">Best Performing Semester</p>
          <h2 className="text-2xl font-bold m-0 mt-1">{best.sem}</h2>
          <p className="text-sm opacity-90 m-0 mt-0.5">Pass Rate: <b>{best.passRate}%</b> · Avg Marks: <b>{best.avg}%</b></p>
        </div>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 opacity-20"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V17H9v2h6v-2h-2v-1.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.86 10.4 5 9.3 5 8zm14 0c0 1.3-.86 2.4-2 2.82V7h2v1z"/></svg>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {STUDENT_PERFORMANCE.map((sp) => (
          <div key={sp.sem} className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white m-0">{sp.sem}</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sp.passRate >= 90 ? "bg-green-500/10 text-green-600" : sp.passRate >= 80 ? "bg-blue-500/10 text-[#4c6ef5]" : "bg-red-500/10 text-red-500"}`}>{sp.passRate}% Pass</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-gray-500 uppercase">Pass Rate</span><span className="text-[10px] font-bold text-gray-900 dark:text-white">{sp.passRate}%</span></div>
                <MiniBar value={sp.passRate} color={sp.passRate >= 90 ? "bg-green-500" : sp.passRate >= 80 ? "bg-[#4c6ef5]" : "bg-red-500"} />
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-gray-500 uppercase">Avg Marks</span><span className="text-[10px] font-bold text-gray-900 dark:text-white">{sp.avg}%</span></div>
                <MiniBar value={sp.avg} color="bg-purple-500" />
              </div>
              <div className="flex justify-between pt-1"><span className="text-[10px] text-gray-500 font-medium">Students with Backlog</span><span className={`text-[10px] font-bold ${sp.backlog > 15 ? "text-red-500" : "text-green-600"}`}>{sp.backlog}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: MEETINGS
═══════════════════════════════════════════ */
function MeetingsSection({ meetings, onMeetingsChange }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", venue: "", attendees: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    const updated = [...meetings, { ...form, id: Date.now(), attendees: parseInt(form.attendees) || 0 }];
    onMeetingsChange(updated);
    setForm({ title: "", date: "", time: "", venue: "", attendees: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    onMeetingsChange(meetings.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white m-0">Upcoming Meetings</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 m-0">{meetings.length} scheduled this month</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 px-4 py-2 bg-[#4c6ef5] text-white rounded-xl text-xs font-bold hover:bg-blue-600 shadow-md active:scale-95 transition-all">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Schedule Meeting
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h4 className="col-span-full text-sm font-bold text-gray-900 dark:text-white m-0">New Meeting</h4>
          {[
            { key: "title",     label: "Meeting Title",     placeholder: "e.g. Department Review", span: true },
            { key: "date",      label: "Date",              placeholder: "e.g. May 15, 2026" },
            { key: "time",      label: "Time",              placeholder: "e.g. 10:00 AM" },
            { key: "venue",     label: "Venue",             placeholder: "e.g. HOD Chamber" },
            { key: "attendees", label: "No. of Attendees",  placeholder: "e.g. 8" },
          ].map(({ key, label, placeholder, span }) => (
            <div key={key} className={span ? "col-span-full" : ""}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
              <input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5] transition-colors placeholder-gray-400" />
            </div>
          ))}
          <div className="col-span-full flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-[#4c6ef5] text-white rounded-xl text-xs font-bold hover:bg-blue-600 active:scale-95 transition-all">Add Meeting</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {meetings.map((m) => (
          <div key={m.id} className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:-translate-y-1 transition-transform duration-200 group relative">
            <button onClick={() => handleDelete(m.id)} className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
            <div className="flex items-start justify-between mb-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-[#4c6ef5]/10 flex items-center justify-center text-[#4c6ef5]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#4c6ef5] m-0">{m.date}</p>
                <p className="text-[10px] text-gray-500 m-0">{m.time}</p>
              </div>
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white m-0 mb-2">{m.title}</h4>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {m.venue}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                {m.attendees} Attendees
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: RESEARCH
═══════════════════════════════════════════ */
function ResearchSection({ research }) {
  const total     = research.length;
  const published = research.filter(r => r.status === "Published").length;
  const inReview  = research.filter(r => r.status === "Under Review").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Papers", value: total,    color: "text-[#4c6ef5]" },
          { label: "Published",    value: published, color: "text-green-600 dark:text-green-400" },
          { label: "Under Review", value: inReview,  color: "text-amber-600 dark:text-amber-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold m-0 ${color}`}>{value}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1 m-0">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white m-0">Research Publications — 2025–26</h3>
          <button className="text-xs font-bold text-[#4c6ef5] hover:underline">+ Add Paper</button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {research.map((r) => (
            <div key={r.id} className="px-5 py-4 flex flex-wrap items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#4c6ef5]/10 text-[#4c6ef5] flex items-center justify-center text-sm font-bold shrink-0">{r.id}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white m-0 leading-snug">{r.title}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 m-0">{r.faculty} · {r.journal} · {r.year}</p>
              </div>
              <Badge label={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN HOD DASHBOARD
═══════════════════════════════════════════ */
export default function HODDashboard() {
  const [activeTab, setActiveTab]           = useState("Overview");
  const [isMobileSidebarOpen, setMobile]    = useState(false);
  const [toast, setToast]                   = useState(null);

  const [leaveRequests, setLeaveRequests]   = useState(DEFAULT_LEAVE_REQUESTS);
  const [notices, setNotices]               = useState(DEFAULT_NOTICES);
  const [meetings, setMeetings]             = useState(DEFAULT_MEETINGS);
  const [faculty, setFaculty]               = useState(DEFAULT_FACULTY);
  const [research]                          = useState(DEFAULT_RESEARCH);

  useEffect(() => {
    const loadOrInit = (key, defaultVal, setter) => {
      const existing = loadShared(key, null);
      if (existing) { setter(existing); }
      else          { saveShared(key, defaultVal); }
    };

    loadOrInit("shared_leave_requests", DEFAULT_LEAVE_REQUESTS, setLeaveRequests);
    loadOrInit("shared_notices",        DEFAULT_NOTICES,        setNotices);
    loadOrInit("shared_meetings",       DEFAULT_MEETINGS,       setMeetings);
    loadOrInit("shared_faculty",        DEFAULT_FACULTY,        setFaculty);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLeaveAction = useCallback((id, action) => {
    setLeaveRequests(prev => {
      const updated = prev.map(lr => lr.id === id ? { ...lr, status: action } : lr);
      saveShared("shared_leave_requests", updated);
      return updated;
    });
    showToast(`Leave request ${action.toLowerCase()} successfully.`);
  }, []);

  const handleAddNotice = useCallback((notice) => {
    setNotices(prev => {
      const updated = [notice, ...prev];
      saveShared("shared_notices", updated);
      return updated;
    });
    showToast("Notice published.");
  }, []);

  const handleMeetingsChange = useCallback((updated) => {
    setMeetings(updated);
    saveShared("shared_meetings", updated);
    showToast(updated.length > meetings.length ? "Meeting scheduled." : "Meeting removed.");
  }, [meetings.length]);

  const handleUpdateFaculty = useCallback((updated) => {
    setFaculty(updated);
    saveShared("shared_faculty", updated);
    showToast("Faculty list updated.");
  }, []);

  // ✅ DYNAMIC: Request leave generated from Faculty Tab -> Syncs to Overview Tab
  const handleRequestLeave = useCallback((facultyName) => {
    setLeaveRequests(prev => {
      const newReq = {
        id: `LR00${prev.length + 1}`,
        faculty: facultyName,
        from: "Today",
        to: "Tomorrow",
        reason: "System Generated Leave App",
        status: "Pending", // This makes it show up in Overview Pending Approvals
        type: "Personal"
      };
      const updated = [newReq, ...prev];
      saveShared("shared_leave_requests", updated);
      return updated;
    });
    showToast(`Leave application submitted for ${facultyName}`);
  }, []);

  const TABS = [
    { id: "Overview",    label: "Overview",    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: "Faculty",     label: "Faculty",     icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
    { id: "Performance", label: "Performance", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg> },
    { id: "Meetings",    label: "Meetings",    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg> },
    { id: "Research",    label: "Research",    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":    return <OverviewSection faculty={faculty} leaveRequests={leaveRequests} notices={notices} onLeaveAction={handleLeaveAction} onAddNotice={handleAddNotice} />;
      case "Faculty":     return <FacultySection faculty={faculty} onUpdateFaculty={handleUpdateFaculty} onRequestLeave={handleRequestLeave} onShowToast={showToast} />;
      case "Performance": return <PerformanceSection />;
      case "Meetings":    return <MeetingsSection meetings={meetings} onMeetingsChange={handleMeetingsChange} />;
      case "Research":    return <ResearchSection research={research} />;
      default:            return null;
    }
  };

  const pendingLeaves = leaveRequests.filter(lr => lr.status === "Pending").length;
  const unreadNotices = notices.filter(n => !n.read).length;

  return (
    <div className="flex h-full min-h-screen w-full bg-gray-50 dark:bg-[#0b0d14] text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobile(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#13151e] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-[width,transform] duration-300 ease-in-out overflow-hidden group/sidebar lg:relative ${isMobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0 lg:w-20 lg:hover:w-64"}`}>
{/* Yahan naya Back Button wala code paste karein 👇 */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 shrink-0 h-[73px]">
          
          {/* ✅ BACK BUTTON TO DASHBOARD */}
          <Link href="/faculty/dashboard" className="shrink-0">
            <button title="Back to Faculty Dashboard" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-[#4c6ef5] hover:text-white transition-colors duration-200 shadow-sm cursor-pointer">
              {/* Back Arrow Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </Link>

          {/* PORTAL TITLE (Sidebar expand hone par dikhega) */}
          <div className="opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            <h2 className="font-bold text-sm tracking-tight m-0 text-gray-900 dark:text-white">PBCOE Portal</h2>
            <p className="text-[10px] text-[#4c6ef5] font-bold uppercase tracking-wider m-0">HOD Dashboard</p>
          </div>
        </div>
        <div className="px-4 py-6 flex-1 overflow-y-auto overflow-x-hidden space-y-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobile(false); }}
              className={`w-full text-left p-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center relative ${activeTab === tab.id ? "bg-[#4c6ef5]/10 text-[#4c6ef5] dark:bg-[#4c6ef5]/20" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"}`}>
              <div className="w-6 h-6 flex items-center justify-center shrink-0 relative">
                {tab.icon}
                {tab.id === "Overview" && (pendingLeaves + unreadNotices) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {pendingLeaves + unreadNotices}
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap ml-4 opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">{tab.label}</span>
              {activeTab === tab.id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#4c6ef5] lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity" />}
            </button>
          ))}
        </div>
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[#4c6ef5] text-white flex items-center justify-center shrink-0 text-sm font-bold">H</div>
          <div className="whitespace-nowrap opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300 overflow-hidden">
            <p className="text-xs font-bold text-gray-900 dark:text-white m-0 truncate">Dr. Hande K. N.</p>
            <p className="text-[10px] text-gray-500 m-0">Head of Department</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto relative">
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#13151e] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <h2 className="font-bold text-sm m-0">HOD Portal</h2>
          <button onClick={() => setMobile(true)} className="p-2 rounded-md border border-gray-300 dark:border-gray-700">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 18v-2h18v2H3zm0-5v-2h18v2H3zm0-5V6h18v2H3z"/></svg>
          </button>
        </div>

        <div className="px-6 md:px-8 py-8 w-full max-w-[1600px] mx-auto space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white m-0">HOD Portal</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 m-0">Computer Science & Engineering · Academic Year 2025–26</p>
            </div>
            
          </div>

          <div className="flex gap-1 flex-wrap bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 p-1.5 rounded-2xl w-fit shadow-sm">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 relative ${activeTab === tab.id ? "bg-[#4c6ef5] text-white shadow-md shadow-[#4c6ef5]/20" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                <div className="w-4 h-4">{tab.icon}</div>
                <span className="hidden sm:block">{tab.label}</span>
                {tab.id === "Overview" && (pendingLeaves + unreadNotices) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {pendingLeaves + unreadNotices}
                  </span>
                )}
              </button>
            ))}
          </div>

          {renderContent()}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400 dark:text-green-600 shrink-0"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          {toast}
        </div>
      )}
    </div>
  );
}