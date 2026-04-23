"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════
   DEFAULT DATA
═══════════════════════════════════════ */
const DEFAULT_TICKETS = [
  { id: "T001", room: "Lab 2", issue: "Projector not working, bulb needs replacement.", reportedBy: "Mr. D. B. Khadse", status: "Pending", priority: "High", date: "Today" },
  { id: "T002", room: "Room 304", issue: "AC cooling is very low.", reportedBy: "Ms. P. L. Katore", status: "In Progress", priority: "Medium", date: "Yesterday" },
  { id: "T003", room: "Staff Room", issue: "Printer paper jam.", reportedBy: "Ms. S. S. Despande", status: "Resolved", priority: "Low", date: "Apr 20" },
];

const DEFAULT_NOTICES = [
  { id: 1, title: "NBA Documentation Deadline", date: "Apr 25, 2026", priority: "High", read: false },
  { id: 2, title: "Result Analysis Report Submission", date: "May 2, 2026", priority: "High", read: true },
];

/* ═══════════════════════════════════════
   UTILITIES
═══════════════════════════════════════ */
function saveShared(key, data) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }
}

function loadShared(key, fallback) {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }
  return fallback;
}

const Badge = ({ label }) => {
  const map = {
    High: "bg-red-500/10 text-red-600 border-red-500/25",
    Medium: "bg-amber-500/10 text-amber-600 border-amber-500/25",
    Low: "bg-green-500/10 text-green-600 border-green-500/25",
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/25",
    "In Progress": "bg-blue-500/10 text-blue-600 border-blue-500/25",
    Resolved: "bg-green-500/10 text-green-600 border-green-500/25",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[label] || "bg-gray-100 text-gray-600"}`}>{label}</span>;
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function NonTeachingDashboard() {
  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Synced States
  const [tickets, setTickets] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    setTickets(loadShared("shared_tickets", DEFAULT_TICKETS));
    setNotices(loadShared("shared_notices", DEFAULT_NOTICES));

    const handleStorageChange = () => {
      setTickets(loadShared("shared_tickets", DEFAULT_TICKETS));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateTicket = (id, newStatus) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTickets(updated);
    saveShared("shared_tickets", updated);
    showToast(`Ticket marked as ${newStatus}`);
  };

  const pendingTickets = tickets.filter(t => t.status !== "Resolved");
  const resolvedTickets = tickets.filter(t => t.status === "Resolved");

  return (
    <div className="flex h-full min-h-screen w-full bg-gray-50 dark:bg-[#0b0d14] text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      {mobile && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobile(false)}/>}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#13151e] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-[transform] duration-300 w-64 ${mobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:relative"}`}>
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 shrink-0 h-[73px]">
          {/* BACK BUTTON TO FACULTY DASHBOARD */}
          <Link href="/faculty/dashboard">
            <button title="Back to Faculty Dashboard" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-[#4c6ef5] hover:text-white transition-colors shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
          </Link>
          <div>
            <h2 className="font-bold text-sm m-0">Non-Teaching</h2>
            <p className="text-[10px] text-gray-500 m-0 font-semibold">Facilities & Support</p>
          </div>
        </div>
        <div className="px-4 py-6 flex-1 space-y-2">
          <button className="w-full text-left p-3 rounded-xl text-sm font-bold flex items-center relative bg-[#4c6ef5]/10 text-[#4c6ef5]">
            <div className="w-6 h-6 flex items-center justify-center shrink-0">🛠️</div>
            <span className="whitespace-nowrap ml-4">Maintenance Tickets</span>
            {pendingTickets.length > 0 && <span className="absolute right-4 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{pendingTickets.length}</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto relative">
        <div className="lg:hidden flex items-center px-6 py-4 bg-white dark:bg-[#13151e] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 gap-3">
          <Link href="/faculty/dashboard">
            <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
          </Link>
          <h2 className="font-bold text-base m-0">Non-Teaching Staff</h2>
          <button onClick={() => setMobile(true)} className="p-2 border rounded-md ml-auto">☰</button>
        </div>

        <div className="px-6 md:px-8 py-8 max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold">Maintenance Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage facility requests and inventory.</p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-[#13151e] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Open Tickets</p>
              <p className="text-3xl font-bold text-red-500">{pendingTickets.length}</p>
            </div>
            <div className="bg-white dark:bg-[#13151e] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Resolved Tickets</p>
              <p className="text-3xl font-bold text-green-500">{resolvedTickets.length}</p>
            </div>
            <div className="bg-white dark:bg-[#13151e] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Dept Notices</p>
              <p className="text-3xl font-bold text-[#4c6ef5]">{notices.length}</p>
            </div>
          </div>

          {/* TICKET LIST */}
          <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#13151e]">
              <h3 className="font-bold text-gray-900 dark:text-white">Active Requests ({pendingTickets.length})</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingTickets.map(t => (
                <div key={t.id} className="p-5 flex flex-wrap gap-4 items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={t.priority} />
                      <Badge label={t.status} />
                      <span className="text-xs text-gray-400">{t.date}</span>
                    </div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{t.issue}</p>
                    <p className="text-[11px] text-gray-500 mt-1">Location: <b>{t.room}</b> | Reported by: {t.reportedBy}</p>
                  </div>
                  
                  {/* Actions for Non-Teaching Staff */}
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    {t.status === "Pending" && (
                      <button onClick={() => handleUpdateTicket(t.id, "In Progress")} className="px-3 py-1.5 bg-[#4c6ef5]/10 text-[#4c6ef5] text-xs font-bold rounded-lg hover:bg-[#4c6ef5]/20">Mark In Progress</button>
                    )}
                    <button onClick={() => handleUpdateTicket(t.id, "Resolved")} className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 shadow-sm">Resolve ✓</button>
                  </div>
                </div>
              ))}
              {pendingTickets.length === 0 && <p className="p-8 text-center text-gray-500 text-sm">No pending maintenance requests!</p>}
            </div>
          </div>

        </div>
      </main>

      {/* GLOBAL TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          {toast}
        </div>
      )}
    </div>
  );
}