import React from 'react';


export default function LibraryPage() {
  return (
    <main className=" px-6 md:px-10 pb-12">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Digital Library</h1>
          <p className="text-muted-foreground font-body">
            Manage your borrowed books and explore the academic catalog.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
          <input 
            type="text" 
            placeholder="Search books, authors..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </header>

      {/* Library Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Books Issued </p>
          <p className="text-2xl font-bold">02</p>
          <p className="text-[10px] text-primary mt-2">Max Limit: 05</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Upcoming Due</p>
          <p className="text-2xl font-bold text-orange-500">Mar 15</p>
          <p className="text-[10px] text-muted-foreground mt-2">Natural Language Processing</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pending Fine</p>
          <p className="text-2xl font-bold">$0.00</p>
          <p className="text-[10px] text-green-500 mt-2">No overdues</p>
        </div>
      </section>

      {/* Currently Borrowed Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">Currently Borrowed</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BorrowedBookCard 
            title="Introduction to NLP" 
            author="Daniel Jurafsky" 
            dueDate="Mar 15, 2026" 
            accessionNo="LIB-8821" 
            progress={65} 
          />
          <BorrowedBookCard 
            title="Clean Code" 
            author="Robert C. Martin" 
            dueDate="Mar 22, 2026" 
            accessionNo="LIB-4402" 
            progress={20} 
          />
        </div>
      </section>

      {/* Recommended Books Grid */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recommended for your Semester</h2>
          <button className="text-primary text-sm font-bold">View Catalog</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {['Computer Networks', 'OS Concepts', 'Data Mining', 'IoT Systems', 'Cloud Computing'].map((book) => (
            <div key={book} className="bg-surface border border-border p-4 rounded-xl hover:border-primary transition-all cursor-pointer group">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center group-hover:bg-primary/5">
                <span className="material-symbols-outlined text-4xl text-muted-foreground group-hover:text-primary transition-colors">book</span>
              </div>
              <p className="text-sm font-bold truncate">{book}</p>
              <p className="text-[10px] text-muted-foreground">Available in Stack 4</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function BorrowedBookCard({ title, author, dueDate, accessionNo, progress }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-6 items-center">
      <div className="w-24 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-4xl text-muted-foreground">menu_book</span>
      </div>
      <div className="flex-1 space-y-2 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground">by {author}</p>
          </div>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded">ID: {accessionNo}</span>
        </div>
        <div className="pt-2">
          <div className="flex justify-between text-[10px] font-bold mb-1">
            <span className="text-muted-foreground">DUE IN 24 DAYS</span>
            <span className="text-primary">{dueDate}</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button className="flex-1 py-2 bg-muted text-[10px] font-bold rounded-lg hover:bg-border transition-colors">RENEW BOOK</button>
          <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <span className="material-symbols-outlined text-sm">qr_code_2</span>
          </button>
        </div>
      </div>
    </div>
  );
}