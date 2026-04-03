'use client'

import React from 'react';
import { 
    LuInfo, 
    LuChevronDown, 
    LuSchool, 
    LuShieldCheck, 
    LuActivity, 
    LuChartBar,
    LuUserPlus 
} from 'react-icons/lu';

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-start py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. Page Header */}
      <header className="w-full max-w-[550px] mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
            <LuUserPlus className="text-3xl" />
        </div>
        <h1 className="text-4xl font-extrabold font-headline text-foreground tracking-tight mb-3">
          Create New User
        </h1>
        <p className="text-muted-foreground font-body text-lg">
          Provision a secure account for college personnel
        </p>
      </header>

      {/* 2. The Form Card */}
      <div className="w-full max-w-[550px] bg-surface rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
        
        {/* Soft Info Banner */}
        <div className="bg-primary/[0.03] dark:bg-primary/[0.07] px-8 py-5 flex items-center gap-4 border-b border-border/50">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LuInfo className="text-primary text-xl" />
          </div>
          <p className="text-sm text-foreground/80 font-medium leading-relaxed">
            New users will receive an automated invitation to set their secure password.
          </p>
        </div>

        <form className="p-10 space-y-7">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] ml-1">First Name</label>
              <input 
                className="w-full px-5 py-3.5 bg-background/50 dark:bg-muted/20 rounded-2xl border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5 text-foreground transition-all placeholder:text-muted-foreground/30 outline-none font-body" 
                placeholder="Julian" 
                type="text" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] ml-1">Last Name</label>
              <input 
                className="w-full px-5 py-3.5 bg-background/50 dark:bg-muted/20 rounded-2xl border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5 text-foreground transition-all placeholder:text-muted-foreground/30 outline-none font-body" 
                placeholder="Vance" 
                type="text" 
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] ml-1">Email Address</label>
            <input 
              className="w-full px-5 py-3.5 bg-background/50 dark:bg-muted/20 rounded-2xl border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5 text-foreground transition-all placeholder:text-muted-foreground/30 outline-none font-body" 
              placeholder="julian.vance@university.edu" 
              type="email" 
            />
          </div>

          {/* Phone & Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] ml-1">Role</label>
                <div className="relative group">
                    <select className="w-full pl-5 pr-10 py-3.5 bg-background/50 dark:bg-muted/20 rounded-2xl border border-border/50 focus:border-primary appearance-none transition-all outline-none text-foreground font-medium">
                        <option value="">Select Role</option>
                        <option>Admin</option>
                        <option>Faculty</option>
                        <option>Staff</option>
                    </select>
                    <LuChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] ml-1">Institution</label>
                <div className="relative group">
                    <select className="w-full pl-5 pr-10 py-3.5 bg-background/50 dark:bg-muted/20 rounded-2xl border border-border/50 focus:border-primary appearance-none transition-all outline-none text-foreground font-medium">
                        <option value="">Select College</option>
                        <option>St. Andrews College</option>
                        <option>Metropolitan Poly</option>
                    </select>
                    <LuSchool className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                </div>
            </div>
          </div>

          {/* Custom Switch Component */}
          <div className="flex items-center justify-between p-5 bg-background/30 dark:bg-muted/10 rounded-2xl border border-border/30">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-foreground">Email Invitation</span>
              <p className="text-xs text-muted-foreground">Notify user immediately</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-12 h-6 bg-muted-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primary shadow-sm"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-4">
            <button className="w-full py-4.5 bg-primary text-white rounded-2xl font-headline font-bold text-lg shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-300" type="submit">
              Create Account
            </button>
            <button className="w-full py-3 text-muted-foreground hover:text-foreground font-bold transition-colors text-sm" type="button">
              Discard Changes
            </button>
          </div>
        </form>
      </div>

      {/* 3. Footer Decoration */}
      <footer className="mt-16 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 opacity-40">
        <div className="flex items-center gap-3">
          <LuShieldCheck className="text-3xl text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Secure Infrastructure</span>
        </div>
        <div className="flex items-center gap-3">
          <LuActivity className="text-3xl text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Real-time Sync</span>
        </div>
        <div className="flex items-center gap-3">
          <LuChartBar className="text-3xl text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Full Audit Logs</span>
        </div>
      </footer>
    </div>
  );
}