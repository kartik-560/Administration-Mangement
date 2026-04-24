'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../ui/ThemeToggle';
// Import the icons from the Lu (Lucide) set
import { GraduationCap, User, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        // ✅ REMOVED: fixed, top-0, w-full, z-50
        // ADDED: flex-shrink-0 (ensures it doesn't squish when scrolling)
        <nav className="flex-shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-primary/20 px-8 h-16 flex justify-between items-center transition-all duration-500 ease-in-out">

            {/* 1. Logo Section */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                    {/* Replaced Material Symbol with LuGraduationCap */}
                    <GraduationCap className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold font-headline text-slate-900 dark:text-slate-50 tracking-tight">
                    The Ethereal Academic
                </span>
            </Link>

            {/* 2. Actions Section */}
            <div className="flex items-center gap-3">

                {/* Theme Toggle Button */}
                <ThemeToggle />

                {/* Vertical Divider */}
                <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

                {/* 3. Profile Dropdown Container */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center p-0.5 rounded-full border-2 border-transparent hover:border-primary/40 transition-all active:scale-95"
                    >
                        <img
                            alt="User profile"
                            className="w-9 h-9 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                            src="https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff"
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        // Kept absolute here because the dropdown menu SHOULD float over the page!
                        <div className="absolute right-0 mt-3 w-60 bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in zoom-in slide-in-from-top-2 duration-200 z-50">
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Kartik Admin</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">admin@university.edu</p>
                            </div>

                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <User className="text-lg" />
                                My Profile
                            </Link>

                            <Link
                                href="/settings"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <Settings className="text-lg" />
                                Settings
                            </Link>

                            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>

                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <LogOut className="text-lg" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}