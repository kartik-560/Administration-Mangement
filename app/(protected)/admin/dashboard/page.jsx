'use client'

import React from 'react';
import UserTable from "@/components/UserTable";
import NoticePanel from "@/components/NoticePanel";
import {
    LuPlus,
    LuUsers,
    LuBadgeCheck,
    LuBookOpen,
    LuClock,
    LuCircleCheck,
    LuTrendingUp,
    LuChartBar
} from 'react-icons/lu';

export default function Dashboard() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-10">

            {/* 1. Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight font-headline text-foreground">
                        Campus Overview
                    </h1>
                    <p className="text-muted-foreground mt-1 font-body">
                        Real-time institutional performance and administrative metrics.
                    </p>
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                    <LuPlus className="text-xl" />
                    New Enrollment
                </button>
            </div>

            {/* 2. KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Students"
                    value="2,450"
                    Icon={LuUsers}
                    trend="+4.2%"
                    trendIcon={<LuTrendingUp />}
                />
                <KPICard
                    title="Total Faculty"
                    value="120"
                    Icon={LuBadgeCheck}
                    trend="Steady"
                />
                <KPICard
                    title="Active Courses"
                    value="45"
                    Icon={LuBookOpen}
                    trend="+8"
                />
                <KPICard
                    title="Pending Requests"
                    value="12"
                    Icon={LuClock}
                    trend="Urgent"
                    isUrgent
                />
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-12 gap-8 pb-10">
                {/* Left Side: Charts & Tables */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <AnalyticsChart />
                    <UserTable />
                </div>

                {/* Right Side: Notices & Logs */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <NoticePanel />
                    <ActivityLogs />
                </div>
            </div>
        </div>
    );
}

// Internal Component: KPI Card (Refined for Softness)
function KPICard({ title, value, Icon, trend, trendIcon, isUrgent }) {
    return (
        <div className="group bg-surface p-7 rounded-[2rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
            <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon className="text-2xl" />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider ${isUrgent ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                    {trendIcon}
                    {trend}
                </div>
            </div>

            <div className="mt-6 relative z-10">
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
                <p className="text-3xl font-black text-foreground mt-1">{value}</p>
            </div>

            {/* Decorative background icon */}
            <div className="absolute -right-4 -bottom-4 text-primary/[0.03] dark:text-primary/[0.07] group-hover:text-primary/10 transition-colors duration-500">
                <Icon size={140} />
            </div>
        </div>
    );
}

// Internal Component: Analytics Placeholder (Fixed dashed border)
function AnalyticsChart() {
    return (
        <div className="bg-surface rounded-[2rem] p-8 border border-border/50 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-foreground font-headline">Enrollment & Attendance Trends</h3>
                <div className="flex gap-2 bg-muted/40 p-1.5 rounded-2xl">
                    <button className="px-5 py-2 text-xs font-bold bg-surface text-primary rounded-xl shadow-sm border border-border/20">Annual</button>
                    <button className="px-5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Monthly</button>
                </div>
            </div>

            {/* The Soft Dashed Box */}
            <div className="h-72 bg-background/30 rounded-[1.5rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="p-4 bg-surface rounded-full shadow-sm border border-border/30">
                    <LuChartBar className="text-3xl text-primary/40" />
                </div>
                <span className="text-sm font-medium italic font-body opacity-60">Visualizing Campus Growth...</span>
            </div>
        </div>
    )
}

// Internal Component: Activity Logs
function ActivityLogs() {
    return (
        <div className="bg-surface rounded-[2rem] p-8 border border-border/50 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-8 font-headline">Recent Activity</h3>
            <div className="space-y-8 relative after:absolute after:left-[11px] after:top-2 after:bottom-2 after:w-[1px] after:bg-border/50">
                <LogItem
                    icon={<LuCircleCheck className="text-emerald-500" />}
                    text="Updated student record"
                    subtext="Julian Dash (#SC-2024-001)"
                    time="2m ago"
                />
                <LogItem
                    icon={<LuPlus className="text-primary" />}
                    text="New enrollment processed"
                    subtext="Sarah Richardson - CS Dept"
                    time="15m ago"
                />
            </div>
        </div>
    )
}

function LogItem({ icon, text, subtext, time }) {
    return (
        <div className="flex gap-5 group cursor-default relative z-10">
            <div className="p-1.5 bg-surface rounded-full shadow-sm border border-border/50">
                <div className="text-lg">{icon}</div>
            </div>
            <div className="flex-1">
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-body">{text}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{subtext}</p>
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase mt-2 font-body tracking-widest">{time}</p>
            </div>
        </div>
    )
}