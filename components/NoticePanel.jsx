'use client'

import React from 'react';
import { LuMegaphone, LuSend, LuUsers, LuGraduationCap, LuGlobe } from 'react-icons/lu';

export default function NoticePanel() {
    return (
        <div className="bg-surface rounded-[2rem] p-8 border border-border/50 shadow-sm transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                    <LuMegaphone className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-headline">Publish Notice</h3>
            </div>

            <form className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Subject</label>
                    <input
                        className="w-full bg-background/50 dark:bg-muted/20 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground placeholder:text-muted-foreground/30"
                        placeholder="Notice heading..."
                        type="text"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Content</label>
                    <textarea
                        className="w-full bg-background/50 dark:bg-muted/20 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground placeholder:text-muted-foreground/30 min-h-[120px] resize-none"
                        placeholder="Detailed announcement details..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Audience</label>
                    <div className="grid grid-cols-3 gap-2">
                        <AudienceButton icon={<LuGlobe />} label="All" active />
                        <AudienceButton icon={<LuGraduationCap />} label="Faculty" />
                        <AudienceButton icon={<LuUsers />} label="Students" />
                    </div>
                </div>

                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0.5 transition-all">
                    <LuSend size={18} />
                    Post Notice
                </button>
            </form>
        </div>
    );
}

function AudienceButton({ icon, label, active }) {
    return (
        <button
            type="button"
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${active
                    ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
                    : 'bg-background/30 border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground'
                }`}
        >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-bold uppercase">{label}</span>
        </button>
    );
}