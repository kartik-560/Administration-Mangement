import React from 'react';

export default function IssuedBooksPage() {
  return (
    <main className=" px-6 md:px-10 pb-12">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Issued Books</h1>
          <p className="text-muted-foreground font-body">
            You currently have <span className="text-primary font-bold">2 books</span> in your possession.
          </p>
        </div>
        <div className="flex gap-3">
            <div className="bg-surface px-4 py-2 rounded-xl border border-border flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="text-xs font-semibold">Limit: 2/5 Books</p>
            </div>
        </div>
      </header>

      {/* Grid for Books */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Book 1: NLP */}
        <BookCard 
          title="Natural Language Processing"
          author="Daniel Jurafsky & James H. Martin"
          issuedDate="Oct 05, 2026"
          dueDate="Oct 20, 2026"
          accessionNo="CS-LIB-442"
          image="https://m.media-amazon.com/images/I/61y06EStmML._AC_UF1000,1000_QL80_.jpg" 
          daysLeft={4}
          isOverdue={false}
        />

        {/* Book 2: Clean Code */}
        <BookCard 
          title="Clean Code: A Handbook of Agile Software Craftsmanship"
          author="Robert C. Martin"
          issuedDate="Oct 10, 2026"
          dueDate="Oct 25, 2026"
          accessionNo="CS-LIB-109"
          image="https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg"
          daysLeft={9}
          isOverdue={false}
        />

      </section>

      {/* Fine & Instructions Section */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-border flex gap-4 items-start">
            <span className="material-symbols-outlined text-amber-500 text-3xl">warning</span>
            <div>
                <h3 className="font-bold mb-1">Library Instructions</h3>
                <ul className="text-sm text-muted-foreground list-disc ml-4 space-y-1">
                    <li>Books must be returned or renewed on or before the due date.</li>
                    <li>Fine of <span className="font-bold text-foreground">$0.50/day</span> will be charged for overdue books.</li>
                    <li>Maximum renewal limit is 2 times per book.</li>
                </ul>
            </div>
        </div>
        <div className="bg-primary/5 border-2 border-dashed border-primary/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Total Fine Due</p>
            <p className="text-3xl font-black text-primary">$0.00</p>
            <button className="mt-4 text-xs font-bold text-primary underline">View History</button>
        </div>
      </section>
    </main>
  );
}

function BookCard({ title, author, issuedDate, dueDate, accessionNo, daysLeft, isOverdue }) {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
      <div className="flex flex-col md:flex-row">
        {/* Book Visual Side */}
        <div className="w-full md:w-48 bg-muted flex items-center justify-center p-6 group-hover:bg-primary/5 transition-colors">
          <div className="w-32 h-44 bg-surface shadow-lg rounded-md border border-border flex flex-col items-center justify-center p-4 text-center">
             <span className="material-symbols-outlined text-4xl text-primary/40 mb-2">book</span>
             <p className="text-[8px] font-bold text-muted-foreground uppercase leading-tight">{title}</p>
          </div>
        </div>

        {/* Content Side */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded tracking-wider uppercase">
                {accessionNo}
              </span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {isOverdue ? 'OVERDUE' : 'IN POSSESSION'}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
            <p className="text-xs text-muted-foreground mb-4">by {author}</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-3 rounded-xl border border-border/50">
                <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Issued On</p>
                    <p className="text-xs font-semibold">{issuedDate}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Due Date</p>
                    <p className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-foreground'}`}>{dueDate}</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                    <p className="text-xs font-bold">{daysLeft} Days Remaining</p>
                </div>
                <button className="bg-foreground text-surface px-4 py-2 rounded-lg text-[10px] font-bold hover:bg-primary transition-colors">
                    RENEW NOW
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}