import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle'; // Adjust this path if ThemeToggle is in a different folder

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex justify-between items-center px-8 h-16 transition-colors duration-300">
      
      {/* Left Side: Brand and Links */}
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-sky-900 dark:text-sky-100 font-headline">The Ethereal Academic</span>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors font-headline font-semibold tracking-tight">
            Dashboard
          </Link>
          <Link href="#" className="text-sky-700 dark:text-sky-300 border-b-2 border-sky-600 dark:border-sky-400 pb-1 font-headline font-semibold tracking-tight">
            Users
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors font-headline font-semibold tracking-tight">
            Departments
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors font-headline font-semibold tracking-tight">
            Analytics
          </Link>
        </div>
      </div>

      {/* Right Side: Actions and Profile */}
      <div className="flex items-center gap-4">
        
        {/* Dark Mode Toggle */}
        <ThemeToggle />
        
        {/* Notifications Button */}
        <button className="p-2 hover:bg-sky-50/50 dark:hover:bg-sky-900/30 rounded-lg transition-all text-sky-800 dark:text-sky-400 active:scale-95 duration-200 flex items-center justify-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        
        {/* Settings Button */}
        <button className="p-2 hover:bg-sky-50/50 dark:hover:bg-sky-900/30 rounded-lg transition-all text-sky-800 dark:text-sky-400 active:scale-95 duration-200 flex items-center justify-center">
          <span className="material-symbols-outlined">settings</span>
        </button>
        
        {/* User Avatar */}
        <img 
          alt="Administrator Profile" 
          className="w-8 h-8 rounded-full border-2 border-primary-container shadow-sm object-cover" 
          src="https://ui-avatars.com/api/?name=Admin&background=random" 
        />
      </div>

      {/* Bottom Gradient Border Effect */}
      <div className="bg-gradient-to-r from-sky-600/10 to-transparent h-[1px] w-full absolute bottom-0 left-0"></div>
    </nav>
  );
}