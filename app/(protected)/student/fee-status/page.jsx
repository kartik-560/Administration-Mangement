'use client';
import React, { useState } from 'react';

export default function FeesPage() {
  // 1. Sabhi branches ka data define kiya hai
  const branchData = {
    'Computer Science (CSE)': { total: '12,500', tuition: '10,000', lab: '1,500', activity: '1,000' },
    'Information Tech (IT)': { total: '12,000', tuition: '9,500', lab: '1,500', activity: '1,000' },
    'Mechanical (MECH)': { total: '11,500', tuition: '8,500', lab: '2,000', activity: '1,000' },
    'Electronics (ETC)': { total: '11,800', tuition: '9,000', lab: '1,800', activity: '1,000' },
    'Civil Engineering': { total: '11,000', tuition: '8,000', lab: '2,000', activity: '1,000' },
    'Data Science': { total: '13,000', tuition: '10,500', lab: '1,500', activity: '1,000' },
  };

  // 2. State management: Default CSE selected rahega
  const [selectedBranch, setSelectedBranch] = useState('Computer Science (CSE)');
  const currentDetails = branchData[selectedBranch];

  return (
    <main className="px-6 md:px-10 pb-12 text-on-surface">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Fee Statement</h1>
          <p className="text-on-surface-variant font-body">
            View your payment history and upcoming installments.
          </p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
          <span className="material-symbols-outlined">payments</span>
          Pay Online
        </button>
      </header>

      {/* Financial Summary Bento - Dynamic based on selection */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Total Course Fee ({selectedBranch.split(' ')[0]})</p>
          <p className="text-3xl font-extrabold">₹{currentDetails.total}.00</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <p className="text-xs font-bold text-success uppercase mb-1">Total Paid</p>
          <p className="text-3xl font-extrabold text-success">₹12,500.00</p>
        </div>
        <div className="bg-tertiary-container/10 p-6 rounded-2xl border border-tertiary/20 shadow-sm">
          <p className="text-xs font-bold text-tertiary uppercase mb-1">Balance Due</p>
          <p className="text-3xl font-extrabold text-tertiary">
            {/* Logic to show balance if branch fee is higher than what is paid */}
            ₹{parseInt(currentDetails.total.replace(',', '')) > 12500 ? (parseInt(currentDetails.total.replace(',', '')) - 12500).toLocaleString() : '0'}.00
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* 1. Transaction History (Static) */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Transaction History</h2>
              <button className="text-primary text-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">download</span> Receipt
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    <th className="px-6 py-4">Receipt No</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <FeeRow id="#RCP-9921" date="Oct 15, 2025" type="Tuition Fee" amount="4,500" status="Paid" />
                  <FeeRow id="#RCP-8842" date="Aug 02, 2025" type="Library Deposit" amount="500" status="Paid" />
                  <FeeRow id="#RCP-7710" date="Jan 12, 2025" type="Exam Fee" amount="200" status="Paid" />
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. Branch-wise Fee Structure - Interactive */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary"></span>
                Institutional Branch-wise Fees
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">Click a branch to view detailed breakdown.</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(branchData).map((branchName) => (
                <BranchCard 
                  key={branchName}
                  branch={branchName} 
                  fee={branchData[branchName].total} 
                  isActive={selectedBranch === branchName}
                  isUserBranch={branchName === 'Computer Science (CSE)'}
                  onClick={() => setSelectedBranch(branchName)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Dynamic Breakdown Sidebar */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-high p-6 rounded-2xl border-2 border-primary/10 shadow-sm sticky top-8">
            <h3 className="font-bold mb-4 flex justify-between items-center">
              <span>Fee Breakdown</span>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">{selectedBranch.split('(')[1]?.replace(')', '') || 'GEN'}</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Tuition Fee</span>
                <span className="font-semibold">₹{currentDetails.tuition}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Lab & Resources</span>
                <span className="font-semibold">₹{currentDetails.lab}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Student Activities</span>
                <span className="font-semibold">₹{currentDetails.activity}</span>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex justify-between font-bold">
                <span>Total</span><br /><br />
                <span className="text-primary text-lg">₹{currentDetails.total}</span>
              </div>
            </div>
            
            <p className="text-[10px] text-on-surface-variant mt-6 italic">
              * Breakdown for {selectedBranch} academic session 2025-26.
            </p>
             <div className="p-5 bg-tertiary-fixed text-on-tertiary-fixed rounded-xl border border-tertiary-container/20 flex gap-3">
            <span className="material-symbols-outlined text-tertiary"></span>
            <p className="text-xs leading-relaxed">
              <strong>Note:</strong> Next semester fees will be updated on the portal by <br /><strong>Dec 01, 2026</strong>.
            </p>
          </div>
          </div>

         
        </section>
      </div>
    </main>
  );
}

// Helper for Branch Comparison Cards
function BranchCard({ branch, fee, isActive, isUserBranch, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md active:scale-95 
      ${isActive ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant/20 bg-surface-container-low'}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <h4 className={`text-[11px] font-bold uppercase truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>{branch}</h4>
      </div>
      <div className="flex justify-between items-end">
        <p className="text-lg font-black text-on-surface">₹{fee}</p>
        {isUserBranch && <span className="text-[8px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase mb-1">Your Branch</span>}
      </div>
    </div>
  );
}

// Existing FeeRow Helper
function FeeRow({ id, date, type, amount, status }) {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="px-6 py-4 text-sm font-medium">{id}</td>
      <td className="px-6 py-4 text-xs text-on-surface-variant">{date}</td>
      <td className="px-6 py-4 text-sm">{type}</td>
      <td className="px-6 py-4 text-sm font-bold text-right">₹{amount}.00</td>
      <td className="px-6 py-4 text-center">
        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
          {status}
        </span>
      </td>
    </tr>
  );
}