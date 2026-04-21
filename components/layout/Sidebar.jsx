"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { LuUsers } from "react-icons/lu";
import { logout } from "@/features/store/authSlice"; 
import Link from "next/link";
import {
    LogOut,
    Settings,
    ChevronRight,
    ChevronDown,
    Building,
    User,
    Menu,
    X
} from "lucide-react";

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sidebarRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

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

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleLogout = () => {
        // ✅ UPDATED: Clear both token and user object
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        dispatch(logout());
        router.push("/login");
    };

    const menuItems = [
        { label: "Overview", icon: Building, href: "/admin/dashboard" },
        { label: "User Management", icon: LuUsers, href: "/register" },
    ];

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
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Admin Portal</p>
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
                            <p className="text-xs font-bold text-foreground truncate w-40">{user?.name || "Admin"}</p>
                            
                            {/* ✅ FIXED: Role is now dynamic instead of hardcoded "Superadmin" */}
                            <p className="text-[9px] font-black uppercase tracking-tighter text-primary">
                                {user?.role || "User"}
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