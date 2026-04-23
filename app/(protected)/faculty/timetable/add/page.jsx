"use client";
import React, { useState, useCallback, useEffect } from "react";

/* ══════════════════════════════════════════════
   MASTER DATA
══════════════════════════════════════════════ */
const SEMESTERS = [
  { value: "SEM1", label: "Semester I" },
  { value: "SEM2", label: "Semester II" },
  { value: "SEM3", label: "Semester III" },
  { value: "SEM4", label: "Semester IV" },
  { value: "SEM5", label: "Semester V" },
  { value: "SEM6", label: "Semester VI" },
  { value: "SEM7", label: "Semester VII" },
  { value: "SEM8", label: "Semester VIII" },
];

const SUBJECTS_BY_SEM = {
  SEM1: ["Engineering Mathematics I", "Engineering Physics", "Basic Electronics", "C Programming"],
  SEM2: ["Engineering Mathematics II", "Engineering Chemistry", "Data Structures", "Digital Logic"],
  SEM3: ["Discrete Mathematics", "Computer Organization", "OOP with Java", "Operating Systems"],
  SEM4: ["Theory of Computation", "Database Management", "Computer Networks", "Software Engineering"],
  SEM5: ["Compiler Design", "Data Science", "EOII", "Open Elective - I"],
  SEM6: ["Machine Learning", "Compiler Design", "Data Science", "IPR", "Mini Project"],
  SEM7: ["Artificial Intelligence", "Cloud Computing", "Information Security", "Major Project"],
  SEM8: ["Deep Learning", "Big Data Analytics", "IoT Systems", "Major Project"],
};

const TEACHERS = [
  "Mr. D. B. Khadse",
  "Ms. P. L. Katore",
  "Ms. A. N. Tikle",
  "Ms. S. S. Despande",
  "Mr. K. N. Hande",
  "Ms. A. A. Nikose",
  "Dr. R. P. Sharma",
  "Prof. V. K. Mishra",
  "Ms. N. D. Patil",
  "Mr. S. T. Ingle",
];

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:15 AM", "10:30 AM", "11:00 AM",
  "11:15 AM", "11:30 AM", "12:00 PM", "12:15 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];


/* ══════════════════════════════════════════════
   CALENDAR COMPONENT (FIXED TAILWIND COLORS)
══════════════════════════════════════════════ */
function MiniCalendar({ markedDates = {}, onDateClick, activeType, selectedDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateKey = (d) => `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isExam = activeType === "Exam";

  return (
    <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 select-none shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <span className="font-bold text-sm text-gray-900 dark:text-white tracking-wide">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const key = dateKey(d);
          const hasSlots = markedDates[key]?.length > 0;
          const tod = isToday(d);
          const isSelected = key === selectedDate; // Detect clicked date
          
          let cellClasses = "aspect-square rounded-xl flex items-center justify-center text-xs transition-all relative font-bold cursor-pointer ";
          
          if (isSelected) {
            // Selected Date (Solid Blue or Pink/Rose)
            cellClasses += isExam 
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/20 " 
              : "bg-blue-500 text-white shadow-md shadow-blue-500/20 ";
          } else if (tod) {
            // Today's Date but not selected
            cellClasses += isExam
              ? "text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-500/30 "
              : "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border border-blue-500/30 ";
          } else if (hasSlots) {
            // Has slots but not selected
            cellClasses += isExam 
              ? "text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 dark:bg-rose-500/20 " 
              : "text-blue-500 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 dark:bg-blue-500/20 ";
          } else {
            // Normal Empty Day
            cellClasses += "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ";
          }

          return (
            <button
              key={key}
              onClick={() => onDateClick(key, d, viewMonth, viewYear)}
              className={cellClasses}
            >
              {d}
              {hasSlots && !isSelected && (
                <span className={`absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full ${isExam ? 'bg-rose-500' : 'bg-blue-500'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════
   SLOT CARD
══════════════════════════════════════════════ */
function SlotCard({ slot, isExam, onDelete }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-r-xl border border-outline-variant/30 border-l-4 bg-surface-container-lowest hover:bg-surface-container transition-colors relative group shadow-sm ${isExam ? 'border-l-error' : 'border-l-primary'}`}>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-bold mb-1 ${isExam ? 'text-error' : 'text-primary'}`}>{slot.startTime} – {slot.endTime}</p>
        <p className="text-sm font-bold text-on-surface truncate leading-tight">{slot.subject}</p>
        <p className="text-[11px] font-medium text-on-surface-variant mt-1">{slot.teacher}</p>
        <span className="inline-block mt-2 px-2 py-0.5 bg-surface-container border border-outline-variant/30 rounded-full text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
          {SEMESTERS.find(s => s.value === slot.semester)?.label}
        </span>
      </div>
      <button 
        onClick={onDelete} 
        className="p-1.5 rounded-lg text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD SLOT MODAL (Locked to 6th Semester)
══════════════════════════════════════════════ */
function AddSlotModal({ dateKey, dateLabel, type, onClose, onAdd }) {
  // ✅ FIX 1: Default semester ko "SEM6" set kar diya hai
  const [form, setForm] = useState({
    semester: "SEM6", subject: "", teacher: "", startTime: "", endTime: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  // Ab automatically sirf 6th sem ke subjects aayenge
  const subjects = form.semester ? (SUBJECTS_BY_SEM[form.semester] || []) : [];
  const isExam = type === "Exam";

  const validate = () => {
    const e = {};
    if (!form.semester)  e.semester  = "Required";
    if (!form.subject)   e.subject   = "Required";
    if (!form.teacher)   e.teacher   = "Required";
    if (!form.startTime) e.startTime = "Required";
    if (!form.endTime)   e.endTime   = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ ...form, id: Date.now() });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#13151e]">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${isExam ? 'bg-[#e64980]' : 'bg-[#4c6ef5]'}`}>
              {isExam ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
              )}
            </div>
            <div>
              <p className="m-0 text-sm font-bold text-gray-900 dark:text-white">Add {type} Slot</p>
              <p className="m-0 text-[11px] text-gray-500 dark:text-gray-400">{dateLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Semester</label>
            {/* ✅ FIX 2: Dropdown ko disabled kar diya jisse user change na kar paye */}
            <select 
              value={form.semester} 
              disabled
              className={`w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-500 text-sm outline-none cursor-not-allowed appearance-none`}
            >
              <option value="SEM6" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Semester VI</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Subject <span className="text-red-500">*</span></label>
            {/* ✅ Subject field directly enabled rahegi kyunki semester pehle se set hai */}
            <select 
              value={form.subject} 
              onChange={e => set("subject", e.target.value)}
              className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.subject ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 appearance-none`}
            >
              <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">— Select Subject —</option>
              {subjects.map(s => <option key={s} value={s} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Teacher / Invigilator <span className="text-red-500">*</span></label>
            <select 
              value={form.teacher} 
              onChange={e => set("teacher", e.target.value)}
              className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.teacher ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 appearance-none`}
            >
              <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">— Select Teacher —</option>
              {TEACHERS.map(t => <option key={t} value={t} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Start Time <span className="text-red-500">*</span></label>
              <select 
                value={form.startTime} 
                onChange={e => set("startTime", e.target.value)}
                className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.startTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 appearance-none`}
              >
                <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">—</option>
                {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">End Time <span className="text-red-500">*</span></label>
              <select 
                value={form.endTime} 
                onChange={e => set("endTime", e.target.value)}
                className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.endTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 appearance-none`}
              >
                <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">—</option>
                {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t}</option>)}
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-[#13151e]">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md active:scale-95 transition-transform ${isExam ? 'bg-[#e64980] hover:bg-[#c2255c]' : 'bg-[#4c6ef5] hover:bg-[#3b5bdb]'}`}>
            Add Slot
          </button>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════
   SLOTS PANEL (right side)
══════════════════════════════════════════════ */
function SlotsPanel({ selectedDate, timetable, type, onAddClick, onDelete }) {
  const isExam = type === "Exam";
  const slots  = selectedDate ? (timetable[selectedDate] || []) : [];

  const fmtDate = (key) => {
    if (!key) return "";
    const [y, m, d] = key.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 min-h-[420px] flex flex-col shadow-sm">
      {!selectedDate ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-60">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-on-surface-variant">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
          </svg>
          <p className="m-0 text-sm font-medium text-on-surface-variant text-center">Click a date on the<br/>calendar to view or add slots</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="m-0 text-base font-bold text-on-surface">{fmtDate(selectedDate)}</p>
              <p className="m-0 mt-0.5 text-xs font-medium text-on-surface-variant">
                {slots.length === 0 ? "No slots yet" : `${slots.length} slot${slots.length > 1 ? "s" : ""} scheduled`}
              </p>
            </div>
            <button onClick={onAddClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md active:scale-95 transition-transform ${isExam ? 'bg-error' : 'bg-primary'}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Slot
            </button>
          </div>

          <div className="h-px bg-outline-variant/20 mb-4" />

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
            {slots.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-outline-variant/30 rounded-xl p-6 opacity-70">
                <svg viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${isExam ? 'text-error' : 'text-primary'}`}>
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <p className="m-0 text-xs font-medium text-on-surface-variant text-center">No slots added for this day.<br/>Click "Add Slot" to begin.</p>
              </div>
            ) : (
              slots.map(slot => (
                <SlotCard key={slot.id} slot={slot} isExam={isExam} onDelete={() => onDelete(selectedDate, slot.id)} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function TimetablePage() {
  const [activeType, setActiveType] = useState(null);
  const [regularTimetable, setRegularTimetable] = useState({});
  const [examTimetable, setExamTimetable] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const reg = localStorage.getItem('regular_timetable');
    if(reg) setRegularTimetable(JSON.parse(reg));
    
    const exm = localStorage.getItem('exam_timetable');
    if(exm) setExamTimetable(JSON.parse(exm));
  }, []);

  const timetable = activeType === "Regular" ? regularTimetable : examTimetable;

  const setTimetableAndSave = useCallback((updater) => {
    if (activeType === "Regular") {
      setRegularTimetable((prev) => {
        const nextState = typeof updater === 'function' ? updater(prev) : updater;
        localStorage.setItem('regular_timetable', JSON.stringify(nextState));
        window.dispatchEvent(new Event('storage'));
        return nextState;
      });
    } else {
      setExamTimetable((prev) => {
        const nextState = typeof updater === 'function' ? updater(prev) : updater;
        localStorage.setItem('exam_timetable', JSON.stringify(nextState));
        window.dispatchEvent(new Event('storage'));
        return nextState;
      });
    }
  }, [activeType]);

  const handleDateClick = useCallback((key, d, m, y) => {
    setSelectedDate(key);
    setSelectedDateLabel(`${MONTHS[m]} ${d}, ${y}`);
  }, []);

  const handleAddSlot = useCallback((slot) => {
    setTimetableAndSave(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), slot],
    }));
    setShowModal(false);
  }, [selectedDate, setTimetableAndSave]);

  const handleDelete = useCallback((dateKey, slotId) => {
    setTimetableAndSave(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(s => s.id !== slotId),
    }));
  }, [setTimetableAndSave]);

  const totalSlots = Object.values(timetable).reduce((acc, arr) => acc + arr.length, 0);
  const totalDays  = Object.keys(timetable).filter(k => timetable[k].length > 0).length;

  return (
    <div className="font-body bg-background min-h-screen text-on-surface p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight m-0">Timetable Manager</h1>
          <p className="text-sm text-on-surface-variant mt-1.5 m-0">Create and manage Regular & Exam schedules day-by-day</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
  {/* Regular Timetable Button */}
  <button
    onClick={() => { setActiveType("Regular"); setSelectedDate(null); }}
    className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all min-w-[240px] text-left cursor-pointer shadow-sm ${
      activeType === "Regular" 
        ? "bg-[#4c6ef5] text-white border-transparent shadow-lg shadow-blue-500/20" 
        : "bg-white dark:bg-[#13151e] border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
      activeType === "Regular" 
        ? "bg-white/20 text-white" 
        : "bg-[#4c6ef5]/10 text-[#4c6ef5] dark:bg-[#4c6ef5]/20"
    }`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/></svg>
    </div>
    <div>
      <p className={`m-0 text-sm font-bold ${activeType === "Regular" ? "text-white" : "text-gray-900 dark:text-white"}`}>Regular Timetable</p>
      <p className={`m-0 mt-0.5 text-xs font-medium ${activeType === "Regular" ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>Weekly class schedule</p>
    </div>
  </button>

  {/* Exam Timetable Button */}
  <button
    onClick={() => { setActiveType("Exam"); setSelectedDate(null); }}
    className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all min-w-[240px] text-left cursor-pointer shadow-sm ${
      activeType === "Exam" 
        ? "bg-[#e75a3e] text-white border-transparent shadow-lg shadow-rose-500/20" 
        : "bg-white dark:bg-[#13151e] border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
      activeType === "Exam" 
        ? "bg-white/20 text-white" 
        : "bg-[#e64980]/10 text-[#d66c2f] dark:bg-[#e64980]/20"
    }`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>
    </div>
    <div>
      <p className={`m-0 text-sm font-bold ${activeType === "Exam" ? "text-white" : "text-gray-900 dark:text-white"}`}>Exam Timetable</p>
      <p className={`m-0 mt-0.5 text-xs font-medium ${activeType === "Exam" ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>End-semester schedule</p>
    </div>
  </button>
</div>

        {!activeType ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 border-2 border-dashed border-outline-variant/30 rounded-2xl opacity-70 bg-surface-container-lowest">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-on-surface-variant"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
            <p className="m-0 text-base font-bold text-on-surface-variant">Choose a timetable type to get started</p>
          </div>
        ) : (
          <>
            <div className={`flex items-center flex-wrap gap-5 px-5 py-3 rounded-xl border mb-6 ${activeType === "Exam" ? "bg-error/5 border-error/20" : "bg-primary/5 border-primary/20"}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${activeType === "Exam" ? "bg-error" : "bg-primary"}`} />
                <span className="text-sm font-bold text-on-surface">{activeType} Timetable</span>
              </div>
              <div className="w-px h-5 bg-outline-variant/30 hidden sm:block" />
              <div className="text-xs font-medium text-on-surface-variant flex gap-4">
                <span><b className="text-on-surface text-sm">{totalSlots}</b> total slots</span>
                <span>across <b className="text-on-surface text-sm">{totalDays}</b> day{totalDays !== 1 ? "s" : ""}</span>
              </div>
              {totalSlots > 0 && (
                <button
                  onClick={() => setTimetableAndSave({})}
                  className="ml-auto px-3 py-1.5 bg-error/10 border border-error/20 rounded-lg text-xs font-bold text-error hover:bg-error/20 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
              <div>
                <p className="m-0 mb-2.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Select a Date</p>
                <MiniCalendar markedDates={timetable} onDateClick={handleDateClick} isExam={activeType === "Exam"} />
              </div>

              <div>
                <p className="m-0 mb-2.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{selectedDate ? "Scheduled Slots" : "Day Preview"}</p>
                <SlotsPanel selectedDate={selectedDate} timetable={timetable} type={activeType} onAddClick={() => setShowModal(true)} onDelete={handleDelete} />
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && <AddSlotModal dateKey={selectedDate} dateLabel={selectedDateLabel} type={activeType} onClose={() => setShowModal(false)} onAdd={handleAddSlot} />}
    </div>
  );
}