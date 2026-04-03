"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    // Define which pages SHOULD NOT have the sidebar/header
    const hideLayoutFor = ["/", "/login"]; // Added register just in case based on your earlier code!
    const shouldHideLayout = hideLayoutFor.includes(pathname);

    // If it's a public page, just render the content without the dashboard wrapper
    if (shouldHideLayout) {
        return <>{children}</>;
    }

    return (
        // 1. The outermost container: Full screen, prevents scrolling on the body, flex row
        <div className="flex h-screen w-full overflow-hidden bg-background">
            
            {/* 2. Sidebar goes here. It will naturally take up the left side and full height. */}
            <Sidebar />

            {/* 3. The right-hand wrapper: Flex column that takes up the remaining space */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                
                {/* Navbar sits at the top of the right-hand column */}
                <Navbar />

                {/* 4. The main scrollable content area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 transition-all bg-transparent  dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
                
            </div>
        </div>
    );
}