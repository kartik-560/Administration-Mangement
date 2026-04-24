'use client'

import React, { useState, useEffect } from 'react';
import UserTable from "@/components/UserTable";
import NoticePanel from "@/components/NoticePanel";
import { getDashboardKpis,getActivityLogs } from "@/features/admin/dashboard/dashboard.api"; 


import {
    Plus,
    Users,
    BadgeCheck,
    BookOpen,
    Clock,
    CircleCheck,
    TrendingUp,
    BarChart3
} from 'lucide-react';

export default function Dashboard() {
    // State for backend data
    const [kpis, setKpis] = useState(null);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const [collegeId, setCollegeId] = useState(null);
    useEffect(() => {
        // Run only on client side to prevent hydration errors
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCollegeId(parsedUser.collegeId);
        }
    }, []);
    // ==========================================

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [kpiRes, activityLogsArray] = await Promise.all([
                    getDashboardKpis(collegeId),
                    getActivityLogs(5) // Returns the array directly!
                ]);

                if (kpiRes.success) setKpis(kpiRes.data);
                
                // FIX 1: Just set the array directly! No need to check .success
                if (activityLogsArray) setActivities(activityLogsArray); 

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if the collegeId has been successfully retrieved
        if (collegeId) {
            fetchDashboardData();
        }
    }, [collegeId]);

    // Show a loading skeleton or blank state while determining the user's collegeId
    if (!collegeId) {
        return <div className="mt-20 text-center text-muted-foreground animate-pulse">Loading dashboard environment...</div>;
    }

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
                    <Plus className="text-xl" />
                    New Enrollment
                </button>
            </div>

            {/* 2. KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Students"
                    value={isLoading ? "..." : kpis?.totalStudents || 0}
                    Icon={Users}
                    trend="+4.2%"
                    trendIcon={<TrendingUp />}
                />
                <KPICard
                    title="Total Faculty"
                    value={isLoading ? "..." : kpis?.totalFaculty || 0}
                    Icon={BadgeCheck}
                    trend="Steady"
                />
                <KPICard
                    title="Total Departments"
                    value={isLoading ? "..." : kpis?.totalDepartments || 0}
                    Icon={BookOpen}
                    trend="Steady"
                />
                <KPICard
                    title="Pending Requests"
                    // UPDATED: Now uses dynamic backend data for pending queries!
                    value={isLoading ? "..." : kpis?.pendingRequests || 0} 
                    Icon={Clock}
                    trend={kpis?.pendingRequests > 0 ? "Urgent" : "All Clear"}
                    isUrgent={kpis?.pendingRequests > 0}
                />
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-12 gap-8 pb-10">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <AnalyticsChart />
                    {/* <UserTable /> */}
                    <ActivityLogs logs={activities} isLoading={isLoading} />
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <NoticePanel />
                    
                </div>
            </div>
        </div>
    );
}

// Internal Component: KPI Card
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

            <div className="absolute -right-4 -bottom-4 text-primary/[0.03] dark:text-primary/[0.07] group-hover:text-primary/10 transition-colors duration-500">
                <Icon size={140} />
            </div>
        </div>
    );
}

// Internal Component: Analytics Placeholder
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

            <div className="h-72 bg-background/30 rounded-[1.5rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="p-4 bg-surface rounded-full shadow-sm border border-border/30">
                    <BarChart3 className="text-3xl text-primary/40" />
                </div>
                <span className="text-sm font-medium italic font-body opacity-60">Visualizing Campus Growth...</span>
            </div>
        </div>
    )
}

// Internal Component: Activity Logs
// Internal Component: Activity Logs
function ActivityLogs({ logs, isLoading }) {
    return (
        <div className="bg-surface rounded-[2rem] p-8 border border-border/50 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-8 font-headline">Recent Activity</h3>
            
            {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading activities...</p>
            ) : logs?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity found.</p>
            ) : (
                <div className="space-y-8 relative after:absolute after:left-[11px] after:top-2 after:bottom-2 after:w-[1px] after:bg-border/50">
                    {logs.map((log) => (
                        <LogItem
                            key={log.id}
                            icon={<CircleCheck className="text-primary" />} 
                            // FIX 2: Use the exact keys your database returns!
                            text={log.action} 
                            subtext={`By ${log.user?.firstName} ${log.user?.lastName} in ${log.module}`}
                            time={new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        />
                    ))}
                </div>
            )}
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