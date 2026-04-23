"use client";
import React from 'react';

const FeeManagementDashboard = () => {
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

      <div className="min-h-screen bg-[#faf8ff] dark:bg-slate-950 font-['Inter',sans-serif] transition-colors duration-300">
        <main className="w-full">
          {/* TopAppBar - Fixed transparency issue causing scroll overlap */}
          <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-[#faf8ff] dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-extrabold text-[#004ac6] dark:text-blue-400 tracking-tight font-['Manrope',sans-serif]">Fee Management</h1>
              <div className="hidden lg:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                Daily target reached: $45,000 collected today
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#131b2e] dark:text-slate-100">Finance Officer</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Sr. Accountant</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-blue-600/10">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKnGQgWYkgEW0yz-Vn5oGQTaItOEIZWhr0U-rBAMyScYNcxAR6iyhoU1j-hT45_fVhMLCDrob_dth6ef-NDf-enPrRJQqSlS6lrfLRiHsMdphkIPl9ZjBhtrW1HLpkc5bub3R9hykihVkRI33cq2uh_AMwSGyr8kN4Sfti0yYFeJFDjSaNLELG-3WFgrAZv05YKkm9eCOcwdz6tW4zNVLQPDyBAW5TBFcJ5NFBQIt_of7GJM6MlDVti-eB8GeOcoTmhDgbXudyivM" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard 
                icon="account_balance_wallet" 
                color="bg-[#dbe1ff] dark:bg-blue-900/40 text-[#004ac6] dark:text-blue-300" 
                label="Total Collected (YTD)" 
                value="$1,240,000" 
                trend="+12.5%" 
                trendColor="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" 
              />
              <KPICard 
                icon="pending_actions" 
                color="bg-[#ffdbcd] dark:bg-orange-900/40 text-[#943700] dark:text-orange-300" 
                label="Pending Dues" 
                value="$150,000" 
                trend="Action Needed" 
                trendColor="text-[#ba1a1a] dark:text-red-400 bg-red-50 dark:bg-red-900/20" 
              />
              <KPICard 
                icon="payments" 
                color="bg-[#dbe1ff] dark:bg-blue-900/40 text-[#495c95] dark:text-blue-200" 
                label="Transactions Today" 
                value="$45,000" 
                trend="Updated Just Now" 
                trendColor="text-[#004ac6] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Payment Input */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#131b2e] dark:text-slate-100 font-['Manrope',sans-serif]">Record Offline Payment</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Search student and process manual fee payment</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase">Student Search</label>
                    <input type="text" placeholder="ID or Name..." className="w-full px-4 py-3 bg-[#f2f3ff] dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600/20 text-[#131b2e] dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase">Method</label>
                    <select className="w-full px-4 py-3 bg-[#f2f3ff] dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white">
                      <option>Bank Transfer</option>
                      <option>Cash</option>
                    </select>
                  </div>
                </div>
                <div className="bg-[#f2f3ff] dark:bg-slate-800 p-6 rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#004ac6] dark:text-blue-400 text-3xl">person_search</span>
                    <p className="text-sm font-medium dark:text-slate-200">No Student Selected</p>
                  </div>
                  <button disabled className="bg-[#004ac6] dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold opacity-50">Confirm</button>
                </div>
              </div>

              {/* Reminders - Theme Compatible Version Fixed */}
              <div className="lg:col-span-4 bg-[#fff8f6] dark:bg-slate-900 p-8 rounded-xl border border-[#ffdad6] dark:border-slate-800 transition-colors duration-300">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-[#943700] dark:bg-[#bc4800]/20 rounded-xl flex items-center justify-center text-white dark:text-orange-400 mb-4">
                    <span className="material-symbols-outlined">campaign</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#360f00] dark:text-slate-100 mb-1 font-['Manrope',sans-serif]">Reminders</h2>
                  <p className="text-sm text-[#943700]/70 dark:text-slate-400">Found 142 students with overdue balances.</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#943700] dark:text-orange-400">mail</span>
                      <span className="text-sm font-medium dark:text-slate-200">Email Reminders</span>
                    </div>
                    {/* Toggle Switch */}
                    <div className="w-10 h-6 bg-[#bc4800] dark:bg-orange-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">sms</span>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">SMS Notifications</span>
                    </div>
                    <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-slate-500 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#943700] dark:bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#7d2d00] dark:hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/10 active:scale-[0.98]">
                  <span className="material-symbols-outlined">send</span>
                  Send Bulk Reminders
                </button>
              </div>
            </div>
          </div>

          <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#004ac6] dark:bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </main>
      </div>
    </>
  );
};

const KPICard = ({ icon, color, label, value, trend, trendColor }) => (
  <div className="bg-white dark:bg-slate-900 p-7 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <span className="material-symbols-outlined fill-1">{icon}</span>
      </div>
      <span className={`text-[10px] font-extrabold px-2 py-1 rounded ${trendColor}`}>{trend}</span>
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-[#131b2e] dark:text-slate-100 font-['Manrope',sans-serif]">{value}</h3>
    </div>
  </div>
);

export default FeeManagementDashboard;