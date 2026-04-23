"use client";
import React, { useState } from 'react';

const ExamFormPage = () => {
  const [activeForm, setActiveForm] = useState('exam'); 
  const [studentType, setStudentType] = useState('regular');

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
        .fill-1 {
          font-variation-settings: 'FILL' 1 !important;
        }
      `}</style>

      <div className="min-h-screen bg-[#faf8ff] dark:bg-slate-950 font-['Inter',sans-serif] text-[#131b2e] dark:text-slate-100 transition-colors duration-300">
        <main className="w-full">
          {/* TopAppBar */}
          <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-[#faf8ff]/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-extrabold text-[#004ac6] dark:text-blue-400 tracking-tight font-['Manrope',sans-serif]">Examination Portal</h1>
              <div className="hidden lg:flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-[#004ac6] dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">info</span>
                Winter 2024 Session Now Open
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold">Exam Controller</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Administration</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-blue-600/10">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKnGQgWYkgEW0yz-Vn5oGQTaItOEIZWhr0U-rBAMyScYNcxAR6iyhoU1j-hT45_fVhMLCDrob_dth6ef-NDf-enPrRJQqSlS6lrfLRiHsMdphkIPl9ZjBhtrW1HLpkc5bub3R9hykihVkRI33cq2uh_AMwSGyr8kN4Sfti0yYFeJFDjSaNLELG-3WFgrAZv05YKkm9eCOcwdz6tW4zNVLQPDyBAW5TBFcJ5NFBQIt_of7GJM6MlDVti-eB8GeOcoTmhDgbXudyivM" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          <div className="p-8 max-w-5xl mx-auto space-y-8">
            
            {/* Primary Division Toggle */}
            <div className="flex p-1 bg-[#f2f3ff] dark:bg-slate-900 rounded-2xl w-fit mx-auto shadow-sm border border-slate-200/50 dark:border-slate-800">
              <button 
                onClick={() => setActiveForm('exam')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeForm === 'exam' ? 'bg-white dark:bg-slate-800 text-[#004ac6] dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400'}`}
              >
                1. Exam Form
              </button>
              <button 
                onClick={() => setActiveForm('rechecking')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeForm === 'rechecking' ? 'bg-white dark:bg-slate-800 text-[#004ac6] dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400'}`}
              >
                2. Rechecking Form
              </button>
            </div>

            {activeForm === 'exam' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-extrabold font-['Manrope',sans-serif]">Exam Registration</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Please select your candidacy type to continue</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Regular Card */}
                    <div 
                      onClick={() => setStudentType('regular')}
                      className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex items-start gap-4 ${studentType === 'regular' ? 'border-[#004ac6] dark:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'}`}
                    >
                      <div className={`p-3 rounded-lg ${studentType === 'regular' ? 'bg-[#004ac6] dark:bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">Regular Student</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Currently enrolled in the ongoing academic semester</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${studentType === 'regular' ? 'border-[#004ac6] dark:border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {studentType === 'regular' && <div className="w-3 h-3 bg-[#004ac6] dark:bg-blue-500 rounded-full" />}
                      </div>
                    </div>

                    {/* Ex-Student Card */}
                    <div 
                      onClick={() => setStudentType('ex')}
                      className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex items-start gap-4 ${studentType === 'ex' ? 'border-[#943700] dark:border-orange-500 bg-orange-50/30 dark:bg-orange-900/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'}`}
                    >
                      <div className={`p-3 rounded-lg ${studentType === 'ex' ? 'bg-[#943700] dark:bg-orange-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                        <span className="material-symbols-outlined">history</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">Ex-Student</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Students appearing for backlogs or previous sessions</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${studentType === 'ex' ? 'border-[#943700] dark:border-orange-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {studentType === 'ex' && <div className="w-3 h-3 bg-[#943700] dark:border-orange-500 rounded-full" />}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Form Area */}
                  <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Registration Number</label>
                        <input type="text" placeholder="e.g. REG-2024-001" className="w-full px-4 py-3 bg-[#f2f3ff] dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600/20 dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Semester</label>
                        <select className="w-full px-4 py-3 bg-[#f2f3ff] dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white">
                          <option>Semester 1</option>
                          <option>Semester 2</option>
                          <option>Semester 3</option>
                          <option>Semester 4</option>
                          <option>Semester 5</option>
                          <option>Semester 6</option>
                          <option>Semester 7</option>
                          <option>Semester 8</option>
                        </select>
                      </div>
                    </div>
                    
                    <button className={`w-full mt-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${studentType === 'regular' ? 'bg-[#004ac6] dark:bg-blue-600 shadow-blue-600/20' : 'bg-[#943700] dark:bg-orange-700 shadow-orange-900/20'}`}>
                      Generate {studentType === 'regular' ? 'Regular' : 'Ex-Student'} Exam Form
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Rechecking Form Content */
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-[#ffdbcd] dark:bg-orange-900/20 text-[#943700] dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">find_in_page</span>
                  </div>
                  <h2 className="text-xl font-bold">Paper Rechecking Request</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 text-sm">Application for re-evaluation of marks for the previous semester results.</p>
                </div>
                <div className="max-w-md mx-auto space-y-4">
                  <input type="text" placeholder="Enter Roll Number" className="w-full px-4 py-3 bg-[#f2f3ff] dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white" />
                  <button className="w-full bg-[#131b2e] dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors">
                    Check Eligibility
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ExamFormPage;