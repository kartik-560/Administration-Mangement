import React from 'react';

export default function UpcomingDuePage() {
  return (
    <main className=" px-6 md:px-10 pb-12">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Return Deadlines</h1>
        <p className="text-muted-foreground font-body">
          List of books that need to be returned or renewed soon to avoid penalties.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {/* Urgent Due Card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 text-white p-3 rounded-xl shadow-lg shadow-red-200">
              <span className="material-symbols-outlined">priority_high</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Natural Language Processing</h3>
              <p className="text-sm text-red-700">Due Date: <span className="font-black">March 15, 2026</span> (In 2 days)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-all">
              Renew Now
            </button>
            <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg">
              Check Fine
            </button>
          </div>
        </div>

        {/* Standard Due List */}
        <section className="bg-surface rounded-2xl border border-border overflow-hidden mt-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Accession No</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <DueRow 
                title="Clean Code" 
                author="Robert C. Martin" 
                id="LIB-4402" 
                date="March 22, 2026" 
                urgent={false} 
              />
              <DueRow 
                title="Deep Learning" 
                author="Ian Goodfellow" 
                id="LIB-1109" 
                date="April 05, 2026" 
                urgent={false} 
              />
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

function DueRow({ title, author, id, date, urgent }) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-6 py-5">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] text-muted-foreground">{author}</p>
      </td>
      <td className="px-6 py-5">
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{id}</span>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-semibold">{date}</p>
      </td>
      <td className="px-6 py-5 text-right">
        <button className="text-primary text-xs font-bold hover:underline">RENEW</button>
      </td>
    </tr>
  );
}