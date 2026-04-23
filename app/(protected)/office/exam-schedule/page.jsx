"use client";
import React, { useState } from 'react';

const ExamSchedulePage = () => {
  const [selectedSemester, setSelectedSemester] = useState('Sem 4');

  const scheduleData = [
    { id: 1, subject: "Advanced Data Structures", code: "CS401", date: "May 15, 2026", time: "10:00 AM - 01:00 PM", venue: "Block A - Hall 2", type: "Theory" },
    { id: 2, subject: "Operating Systems", code: "CS402", date: "May 17, 2026", time: "10:00 AM - 01:00 PM", venue: "Block A - Hall 2", type: "Theory" },
    { id: 3, subject: "Database Management", code: "CS403", date: "May 19, 2026", time: "02:00 PM - 05:00 PM", venue: "Lab 4 (Computer Center)", type: "Practical" },
    { id: 4, subject: "Software Engineering", code: "CS404", date: "May 21, 2026", time: "10:00 AM - 01:00 PM", venue: "Block B - Room 104", type: "Theory" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
      `}</style>

      <div className="min-h-screen bg-[#faf8ff] dark:bg-slate-950 font-['Inter',sans-serif] text-[#131b2e] dark:text-slate-100 transition-colors duration-300">
        <main className="w-full">
          {/* Header matching office.html style */}
          <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-[#faf8ff]/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-extrabold text-[#004ac6] dark:text-blue-400 tracking-tight font-['Manrope',sans-serif]">Exam Timetable</h1>
              <div className="hidden lg:flex items-center gap-2 bg-[#dbe1ff] dark:bg-blue-900/30 text-[#004ac6] dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                Finalized Schedule: Winter 2026
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm">download</span>
                Download PDF
              </button>
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-blue-600/10">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKnGQgWYkgEW0yz-Vn5oGQTaItOEIZWhr0U-rBAMyScYNcxAR6iyhoU1j-hT45_fVhMLCDrob_dth6ef-NDf-enPrRJQqSlS6lrfLRiHsMdphkIPl9ZjBhtrW1HLpkc5bub3R9hykihVkRI33cq2uh_AMwSGyr8kN4Sfti0yYFeJFDjSaNLELG-3WFgrAZv05YKkm9eCOcwdz6tW4zNVLQPDyBAW5TBFcJ5NFBQIt_of7GJM6MlDVti-eB8GeOcoTmhDgbXudyivM" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#f2f3ff] dark:bg-slate-800 text-[#004ac6] dark:text-blue-400 rounded-xl">
                  <span className="material-symbols-outlined">filter_list</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold font-['Manrope',sans-serif]">Schedule Filter</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View timetable by specific semester</p>
                </div>
              </div>
              <div className="flex gap-2 p-1 bg-[#f2f3ff] dark:bg-slate-800 rounded-xl">
                {['Sem 2', 'Sem 4', 'Sem 6', 'Sem 8'].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${selectedSemester === sem ? 'bg-[#004ac6] dark:bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Cards */}
            <div className="grid grid-cols-1 gap-4">
              {scheduleData.map((exam) => (
                <div key={exam.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-[#004ac6] dark:border-l-blue-500">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 min-w-[250px]">
                      <div className="text-center">
                        <p className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-widest">{exam.date.split(',')[1]}</p>
                        <p className="text-2xl font-black text-[#004ac6] dark:text-blue-400 font-['Manrope',sans-serif]">{exam.date.split(' ')[1].replace(',', '')}</p>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{exam.date.split(' ')[0]}</p>
                      </div>
                      <div className="h-12 w-[1px] bg-slate-100 dark:bg-slate-800 hidden lg:block"></div>
                      <div>
                        <div className="flex items-center gap-1 text-[#004ac6] dark:text-blue-400 mb-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span className="text-sm font-bold">{exam.time}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${exam.type === 'Theory' ? 'bg-blue-50 dark:bg-blue-900/30 text-[#004ac6] dark:text-blue-300' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                          {exam.type.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">{exam.code}</p>
                      <h3 className="text-lg font-bold text-[#131b2e] dark:text-slate-100 font-['Manrope',sans-serif]">{exam.subject}</h3>
                    </div>

                    <div className="flex items-center gap-3 bg-[#f2f3ff] dark:bg-slate-800/50 px-6 py-4 rounded-xl min-w-[220px]">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-[#004ac6] dark:text-blue-400 shadow-sm">
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-tighter">Venue</p>
                        <p className="text-sm font-bold dark:text-slate-200">{exam.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ExamSchedulePage;