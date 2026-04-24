"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/features/store/authSlice"; 
import Link from "next/link";
import {
    Users,
    Bell,
    BookOpen,
    GraduationCap,
    Calendar,
    FileText,
    CreditCard,
    LogOut,
    Building,
    User,
    Menu,
    X,
    LayoutDashboard,
    ClipboardCheck, 
    CalendarClock, 
    BarChart,      
    CheckSquare    
} from "lucide-react";

// ✅ 1. DEFINE YOUR FIXED ROLE IDs HERE
const ROLE_IDS = {
    SUPERADMIN: 1,
    ADMIN: 2,
    FACULTY: 4,
    STUDENT: 5,
    LIBRARIAN: "replace_with_actual_librarian_role_id",
    OFFICE_STAFF: "replace_with_actual_office_staff_role_id",
};

// ✅ 2. DEFINE FACULTY RESPONSIBILITIES
const FACULTY_RESPONSIBILITIES = {
    HOD: "HOD",
    SCHEDULE_HEAD: "SCHEDULE_HEAD",
    TEACHING: "TEACHING" 
};

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false); // 👈 HYDRATION SAFEGUARD
    const sidebarRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleMouseEnter = () => {
        if (!isMobile) setSidebarOpen(true);
    };

    const handleMouseLeave = () => {
        if (!isMobile) setSidebarOpen(false);
    };

    const isRouteActive = (href) => {
        if (!href) return false;
        return pathname === href || pathname.startsWith(href + "/");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
        router.push("/login");
    };

    // ✅ 3. DYNAMIC MENU LOGIC FOR MULTIPLE RESPONSIBILITIES
    const getMenuItems = (currentUser) => {
        if (!currentUser) return []; // Safe return if user isn't loaded yet

        const roleId = currentUser?.roleId;

        switch (roleId) {
            case ROLE_IDS.SUPERADMIN:
                return [
                    { label: "Overview", icon: Building, href: "/superadmin/dashboard" },
                    { label: "User Management", icon: Users, href: "/register" },
                    { label: "All Users", icon: Bell, href: "/superadmin/users" },
                    { label: "Roles", icon: Users, href: "/superadmin/roles" },
                ];
            case ROLE_IDS.ADMIN:
                return [
                    { label: "Overview", icon: Building, href: "/admin/dashboard" },
                    { label: "User Management", icon: Users, href: "/register" },
                    { label: "Notices", icon: Bell, href: "/admin/notices" },
                    { label: "All Users", icon: Bell, href: "/admin/users" },
                    { label: "Departments", icon: Bell, href: "/admin/department" },
                ];
            
            case ROLE_IDS.FACULTY:
                let facultyMenu = [];
                
                // 👇 FIX: Deep Check! Finds the array even if backend nested it under .faculty or .facultyProfile
                const dbResps = currentUser?.responsibilities || 
                                currentUser?.responsibility ||
                                currentUser?.faculty?.responsibilities ||
                                currentUser?.facultyProfile?.responsibilities;
                
                // 1. Normalize responsibilities into an array
                let resps = [];
                if (Array.isArray(dbResps)) {
                    resps = dbResps.map(r => r.toUpperCase());
                } else if (typeof dbResps === 'string') {
                    resps = dbResps.split(',').map(r => r.trim().toUpperCase());
                }
                
                // Default to TEACHING if no responsibility is set
                if (resps.length === 0) resps = [FACULTY_RESPONSIBILITIES.TEACHING];

                // 2. Build the menu dynamically based on all their roles
                if (resps.includes(FACULTY_RESPONSIBILITIES.HOD)) {
                    facultyMenu.push(
                        { label: "HOD Dashboard", icon: BarChart, href: "/faculty/hod" },
                        { label: "Subjects", icon: Users, href: "/faculty/subject" },
                        // { label: "Meetings", icon: Calendar, href: "/hod/meetings" }
                    );
                } 
                
                if (resps.includes(FACULTY_RESPONSIBILITIES.SCHEDULE_HEAD)) {
                    facultyMenu.push(
                        { label: "Timetable Master", icon: CalendarClock, href: "/faculty/timetable-master" }
                    );
                } 
                
                if (resps.includes(FACULTY_RESPONSIBILITIES.TEACHING)) {
                    facultyMenu.push(
                        { label: "My Dashboard", icon: LayoutDashboard, href: "/faculty/dashboard" },
                        { label: "Exams & Marks", icon: FileText, href: "/faculty/exams" }
                    );
                }

                // 3. Add Shared links
                facultyMenu.push({ label: "Notices", icon: Bell, href: "/faculty/hod/notice" });

                // 4. Remove duplicates
                const uniqueFacultyMenu = Array.from(new Map(facultyMenu.map(item => [item.href, item])).values());
                
                return uniqueFacultyMenu;

            case ROLE_IDS.STUDENT:
                return [
                    { label: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
                    { label: "Fee Status", icon: GraduationCap, href: "/student/fee-status" },
                    { label: "Exam", icon: Calendar, href: "/student/upcoming-exams" },
                    { label: "Notices", icon: Bell, href: "/student/notices" },
                ];
            case ROLE_IDS.OFFICE_STAFF:
                return [
                    { label: "Dashboard", icon: LayoutDashboard, href: "/office/dashboard" },
                    { label: "Admissions", icon: FileText, href: "/office/admissions" },
                    { label: "Fee Collection", icon: CreditCard, href: "/office/fees" },
                    { label: "Notices", icon: Bell, href: "/office/notices" },
                ];
            default:
                return [
                    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
                ];
        }
    };

    // 👈 Don't render until client-side hydration is complete to prevent visual glitches
    if (!mounted) return <div className="w-20 h-full bg-sidebar border-r border-border/40 flex-shrink-0" />;

    const menuItems = getMenuItems(user);

    const displayRoleName = typeof user?.role === 'string' 
        ? user?.role 
        : user?.role?.name || "GUEST";

    const isFaculty = user?.roleId === ROLE_IDS.FACULTY;
    let displayResponsibility = "";
    
    // 👇 FIX: Also check deeply nested profiles here for the UI badge
    const userRespsForDisplay = user?.responsibilities || 
                                user?.responsibility ||
                                user?.faculty?.responsibilities ||
                                user?.facultyProfile?.responsibilities;
    
    if (isFaculty && userRespsForDisplay) {
        const respArray = Array.isArray(userRespsForDisplay) ? userRespsForDisplay : [userRespsForDisplay];
        displayResponsibility = `(${respArray.join(', ')})`;
    }

    return (
        <>
            {isMobile && (
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed top-4 left-4 z-[60] p-3 rounded-xl bg-primary text-white lg:hidden"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            )}

            <aside
                ref={sidebarRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`flex flex-col h-full bg-sidebar border-r border-border/40 shadow-xl transition-all duration-500 ease-in-out flex-shrink-0
                    ${sidebarOpen ? "w-72" : "w-20"}
                    ${isMobile 
                        ? `fixed left-0 top-0 h-screen z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}` 
                        : "relative z-40 translate-x-0"
                    }
                `}
            >
                <div className="h-20 flex items-center px-6 border-b border-border/40 overflow-hidden">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        <Building size={20} />
                    </div>
                    <div className={`ml-4 transition-all duration-300 ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary truncate w-40">
                            {displayRoleName} PORTAL
                        </p>
                        <p className="text-sm font-bold text-foreground">The Academic</p>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const active = isRouteActive(item.href);

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center h-12 rounded-2xl transition-all duration-300 group
                                    ${active
                                        ? "bg-primary/10 text-primary border border-primary/10"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                            >
                                <div className="w-14 flex-shrink-0 flex items-center justify-center">
                                    <Icon size={20} className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                                </div>
                                <span className={`whitespace-nowrap font-bold text-sm transition-all duration-500
                                    ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/40 space-y-3">
                    <div className="bg-surface/50 border border-border/50 rounded-[1.5rem] p-2 flex items-center overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white flex-shrink-0">
                            <User size={20} />
                        </div>
                        <div className={`ml-3 transition-all duration-300 ${sidebarOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                            <p className="text-xs font-bold text-foreground truncate w-40">{user?.firstName || user?.name || "User"}</p>
                            
                            <p className="text-[9px] font-black uppercase tracking-tighter text-primary truncate w-40">
                                {displayRoleName} {displayResponsibility}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center h-12 rounded-xl text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all overflow-hidden"
                    >
                        <div className="w-12 flex-shrink-0 flex items-center justify-center">
                            <LogOut size={18} />
                        </div>
                        <span className={`font-bold text-sm transition-all duration-500 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;