import React from 'react';

export default function FinePage() {
  return (
    <main className=" px-6 md:px-10 pb-12">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Library Fines</h1>
          <p className="text-muted-foreground font-body">
            Review and pay outstanding penalties for late book returns.
          </p>
        </div>
      </header>

      {/* Fine Summary Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Outstanding</p>
          <p className="text-4xl font-black text-foreground">$0.00</p>
          <div className="mt-4 flex items-center gap-2 text-green-600">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span className="text-xs font-bold uppercase">All Clear</span>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">No Pending Payments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You don't have any unpaid fines at the moment. Good job returning books on time!
              </p>
            </div>
          </div>
          <button disabled className="px-8 py-3 bg-muted text-muted-foreground rounded-xl font-bold cursor-not-allowed">
            Pay Fine Now
          </button>
        </div>
      </section>

      {/* History Table */}
      <section className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Fine History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Days Overdue</th>
                <th className="px-6 py-4">Paid On</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <FineRow 
                id="#FN-8812" 
                book="Discrete Mathematics" 
                days="3 Days" 
                date="Jan 12, 2026" 
                amount="1.50" 
              />
              <FineRow 
                id="#FN-7740" 
                book="Data Structures" 
                days="1 Day" 
                date="Dec 05, 2025" 
                amount="0.50" 
              />
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function FineRow({ id, book, days, date, amount }) {
  return (
    <tr className="hover:bg-muted/10 transition-colors">
      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{id}</td>
      <td className="px-6 py-4">
        <p className="text-sm font-bold">{book}</p>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-orange-600">{days}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{date}</td>
      <td className="px-6 py-4 text-right text-sm font-bold">${amount}</td>
    </tr>
  );
}