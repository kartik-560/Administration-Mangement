"use client";
import React, { useState } from 'react';
import Link from 'next/link';

/* ═══ INITIAL MOCK DATA ═══ */
const INITIAL_SUBJECTS = [
  { id: 'CS601', name: 'Machine Learning', code: 'ML', semester: 'SEM VI', progress: 65, totalUnits: 5, currentUnit: 3 },
  { id: 'CS602', name: 'Compiler Design', code: 'CD', semester: 'SEM VI', progress: 40, totalUnits: 4, currentUnit: 2 },
];

const INITIAL_TODAYS_SCHEDULE = [
  { id: 'S1', time: '10:15 AM - 11:15 AM', type: 'Lecture', subject: 'Machine Learning', class: '3rd Year B.Tech', room: 'Room 302', status: 'Completed' },
  { id: 'S2', time: '11:15 AM - 12:15 PM', type: 'Lecture', subject: 'Compiler Design', class: '3rd Year B.Tech', room: 'Room 304', status: 'Ongoing' },
  { id: 'S3', time: '01:00 PM - 03:00 PM', type: 'Lab', subject: 'ML Lab (Batch A)', class: '3rd Year B.Tech', room: 'Lab 2', status: 'Upcoming' },
];

const INITIAL_PENDING_TASKS = [
  { id: 1, title: 'Grade ML Assignment 2', subject: 'Machine Learning', deadline: 'Today', progress: '45/60', priority: 'High', done: false },
  { id: 2, title: 'Upload Unit 3 Notes', subject: 'Compiler Design', deadline: 'Tomorrow', progress: '0/1', priority: 'Medium', done: false },
  { id: 3, title: 'Review Mini Project Synopses', subject: 'Project', deadline: 'In 3 days', progress: '12/20', priority: 'Medium', done: false },
];

const INITIAL_STUDENT_QUERIES = [
  { id: 101, student: 'Amit Sharma', subject: 'ML', query: 'Doubt regarding SVM algorithm implementation.', time: '2 hours ago', status: 'Unread' },
  { id: 102, student: 'Neha Patel', subject: 'CD', query: 'Requesting extension for Assignment 1 due to medical reasons.', time: '5 hours ago', status: 'Unread' },
];

/* ═══ HELPER COMPONENTS ═══ */
const ProgressBar = ({ progress, colorClass = "bg-[#4c6ef5]" }) => (
  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
    <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
  </div>
);

const PriorityBadge = ({ priority }) => {
  const colors = {
    High: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
    Medium: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    Low: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20"
  };
  return <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border rounded-full ${colors[priority]}`}>{priority}</span>;
};

export default function TeachingDashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Dynamic States
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [schedule, setSchedule] = useState(INITIAL_TODAYS_SCHEDULE);
  const [tasks, setTasks] = useState(INITIAL_PENDING_TASKS);
  const [queries, setQueries] = useState(INITIAL_STUDENT_QUERIES);

  // Modals state
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({ title: '', subject: '', deadline: '', priority: 'Medium' });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Actions
  const handleIncreaseProgress = (id) => {
    setSubjects(subjects.map(s => {
      if (s.id === id && s.progress < 100) {
        const newProgress = Math.min(100, s.progress + 5);
        return { ...s, progress: newProgress, currentUnit: newProgress >= 100 ? s.totalUnits : Math.ceil((newProgress/100) * s.totalUnits) || 1 };
      }
      return s;
    }));
  };

  const handleUpdateScheduleStatus = (id) => {
     setSchedule(schedule.map(s => {
        if(s.id === id) {
             let nextStatus = s.status;
             if(s.status === 'Upcoming') nextStatus = 'Ongoing';
             else if (s.status === 'Ongoing') {
                nextStatus = 'Completed';
                showToast("Attendance Marked & Lecture Completed!");
             }
             return {...s, status: nextStatus};
        }
        return s;
     }))
  }

  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if(!newTaskForm.title || !newTaskForm.subject) return;
    const newTask = {
        id: Date.now(),
        title: newTaskForm.title,
        subject: newTaskForm.subject,
        deadline: newTaskForm.deadline || 'Today',
        progress: '0/0',
        priority: newTaskForm.priority,
        done: false
    };
    setTasks([newTask, ...tasks]);
    setShowAddAssignment(false);
    setNewTaskForm({ title: '', subject: '', deadline: '', priority: 'Medium' });
    showToast("New Assignment created successfully.");
  };

  const handleResolveQuery = (id) => {
      setQueries(queries.filter(q => q.id !== id));
      showToast("Query marked as resolved and removed from list.");
  }


  const sidebarItems = [
    { id: 'Overview', label: 'Overview', href: '/faculty/dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'Teaching', label: 'Teaching Dashboard', href: '/faculty/teaching', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6" /></svg> },
    { id: 'HOD', label: 'HOD Portal', href: '/faculty/hod', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { id: 'Non-Teaching', label: 'Non-Teaching Staff', href: '#', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
  ];

  return (
    <div className="flex h-full min-h-screen w-full bg-gray-50 dark:bg-[#0b0d14] text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
      
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}></div>
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
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)} 
                  className={`w-full text-left p-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center relative ${
                    item.id === 'Teaching' 
                      ? 'bg-[#4c6ef5]/10 text-[#4c6ef5] dark:bg-[#4c6ef5]/20 dark:text-[#4c6ef5]' 
                      : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">{item.icon}</div>
                  <span className="whitespace-nowrap ml-4 opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">{item.label}</span>
                  {item.id === 'Teaching' && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#4c6ef5] lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity"></div>}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto relative">
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#13151e] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <h2 className="font-bold text-base tracking-tight m-0">Teaching Staff</h2>
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 rounded-md border border-gray-300 dark:border-gray-700">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 18v-2h18v2H3zm0-5v-2h18v2H3zm0-5V6h18v2H3z"/></svg>
          </button>
        </div>

        <div className="px-6 md:px-8 py-8 w-full max-w-[1400px] mx-auto space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white m-0">
                My Classroom
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">
                Manage your subjects, track progress, and grade assignments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowAddAssignment(true)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-all active:scale-95">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                New Assignment
              </button>
              <button onClick={() => setShowUploadMaterial(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4c6ef5] text-white rounded-lg text-xs font-bold hover:bg-blue-600 shadow-md transition-all active:scale-95">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> 
                Upload Material
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT COLUMN: Subjects & Tasks */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Dynamic Subjects Progress */}
              <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Syllabus Coverage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 relative group">
                       {/* Advance Progress Button */}
                      <button 
                         onClick={() => handleIncreaseProgress(subject.id)}
                         className="absolute -top-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-xs hover:scale-110" title="Mark progress"
                      >
                         +
                      </button>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{subject.semester} · {subject.code}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{subject.name}</p>
                        </div>
                        <span className="text-xs font-bold text-[#4c6ef5] bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">{subject.progress}%</span>
                      </div>
                      <ProgressBar progress={subject.progress} colorClass={subject.progress >= 100 ? "bg-green-500" : "bg-[#4c6ef5]"} />
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">Currently teaching: <b>Unit {subject.currentUnit}</b> of {subject.totalUnits}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Pending Tasks & Grading */}
              <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Action Items ({tasks.filter(t=>!t.done).length} pending)</h3>
                  <span className="text-xs font-bold text-[#4c6ef5] cursor-pointer hover:underline">View All</span>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {tasks.sort((a,b) => a.done === b.done ? 0 : a.done ? 1 : -1).map((task) => (
                    <div key={task.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${task.done ? 'bg-gray-50 dark:bg-gray-900 border-transparent opacity-50' : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={task.done} onChange={() => handleToggleTask(task.id)} className="w-4 h-4 rounded border-gray-300 text-[#4c6ef5] focus:ring-[#4c6ef5] cursor-pointer" />
                        <div className={task.done ? 'line-through text-gray-500' : ''}>
                          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{task.title}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{task.subject} · Due: {task.deadline}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <PriorityBadge priority={task.priority} />
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-1">{task.progress} completed</p>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No action items.</p>}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Schedule & Queries */}
            <div className="space-y-6">
              
              {/* Dynamic Today's Schedule */}
              <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[350px]">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/20">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Today's Lectures</h3>
                  <span className="text-[10px] font-bold bg-[#4c6ef5] text-white px-2 py-0.5 rounded-full">{schedule.filter(s=>s.status !== 'Completed').length} Remaining</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {schedule.map((slot) => (
                    <div key={slot.id} className={`p-4 mb-2 rounded-xl border-l-4 transition-all ${slot.status === 'Ongoing' ? 'bg-blue-50 dark:bg-blue-500/5 border-l-[#4c6ef5]' : slot.status === 'Completed' ? 'bg-gray-50 dark:bg-gray-800/30 border-l-green-500 opacity-60' : 'bg-white dark:bg-[#13151e] border border-gray-100 dark:border-gray-800 border-l-amber-500 hover:shadow-md'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] font-bold text-gray-500">{slot.time}</p>
                        {slot.status === 'Ongoing' && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4c6ef5] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4c6ef5]"></span>
                          </span>
                        )}
                        {slot.status === 'Completed' && <span className="text-[9px] text-green-500 font-bold uppercase">Done</span>}
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{slot.subject}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{slot.class} · {slot.room}</p>
                      
                      {slot.status === 'Ongoing' && (
                        <button onClick={() => handleUpdateScheduleStatus(slot.id)} className="mt-3 w-full py-1.5 bg-[#4c6ef5] text-white text-[10px] font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                          Mark Attendance & Complete
                        </button>
                      )}
                      {slot.status === 'Upcoming' && (
                        <button onClick={() => handleUpdateScheduleStatus(slot.id)} className="mt-3 w-full py-1.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded-lg hover:bg-amber-500/20 transition-colors">
                          Start Lecture Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Student Queries */}
              <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Student Queries ({queries.length})</h3>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {queries.length > 0 ? queries.map((query) => (
                    <div key={query.id} className="p-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-900/30 rounded-xl relative group">
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <p className="text-[11px] font-bold text-gray-900 dark:text-white">{query.student} <span className="text-gray-400 font-normal">({query.subject})</span></p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 mb-2 line-clamp-2">{query.query}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-gray-400">{query.time}</span>
                        <button onClick={() => handleResolveQuery(query.id)} className="text-[10px] font-bold text-[#4c6ef5] hover:underline bg-[#4c6ef5]/10 px-2 py-1 rounded">Reply & Resolve</button>
                      </div>
                    </div>
                  )) : (
                      <p className="text-xs text-gray-500 text-center py-6">No pending student queries.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Modal: Add Assignment */}
      {showAddAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#13151e] rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
               <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                   <h3 className="font-bold text-gray-900 dark:text-white">New Assignment</h3>
                   <button onClick={() => setShowAddAssignment(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">✕</button>
               </div>
               <form onSubmit={handleAddTask} className="p-5 space-y-4">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                       <input autoFocus required value={newTaskForm.title} onChange={e=>setNewTaskForm({...newTaskForm, title: e.target.value})} className="w-full border dark:border-gray-700 bg-transparent rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]" placeholder="e.g. Lab Manual 4" />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Subject</label>
                       <select required value={newTaskForm.subject} onChange={e=>setNewTaskForm({...newTaskForm, subject: e.target.value})} className="w-full border dark:border-gray-700 bg-white dark:bg-[#13151e] rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]">
                           <option value="">Select subject...</option>
                           {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                       </select>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Deadline</label>
                           <input type="text" value={newTaskForm.deadline} onChange={e=>setNewTaskForm({...newTaskForm, deadline: e.target.value})} className="w-full border dark:border-gray-700 bg-transparent rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]" placeholder="e.g. Next Monday" />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Priority</label>
                           <select value={newTaskForm.priority} onChange={e=>setNewTaskForm({...newTaskForm, priority: e.target.value})} className="w-full border dark:border-gray-700 bg-white dark:bg-[#13151e] rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4c6ef5]">
                               <option>Low</option><option>Medium</option><option>High</option>
                           </select>
                       </div>
                   </div>
                   <div className="pt-2 flex justify-end gap-2">
                       <button type="button" onClick={() => setShowAddAssignment(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
                       <button type="submit" className="px-4 py-2 bg-[#4c6ef5] text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-600">Create Task</button>
                   </div>
               </form>
            </div>
        </div>
      )}

      {/* Modal: Upload Material Simulation */}
      {showUploadMaterial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#13151e] rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 text-center p-6">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4c6ef5]">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Upload Resource</h3>
                <p className="text-xs text-gray-500 mb-6">Select a PDF, DOCX, or Image file to share with your class.</p>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 mb-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => {
                    showToast("File uploaded successfully to cloud repository.");
                    setShowUploadMaterial(false);
                }}>
                    <p className="text-sm font-bold text-[#4c6ef5]">Click to Browse Files</p>
                    <p className="text-[10px] text-gray-400 mt-1">Supports PDF, JPG, PNG (Max 10MB)</p>
                </div>

                <button onClick={() => setShowUploadMaterial(false)} className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
            </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400 dark:text-green-600 shrink-0"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          {toast}
        </div>
      )}

    </div>
  );
}