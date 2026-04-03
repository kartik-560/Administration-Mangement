'use client'

import { useTheme } from '../../features/theme/ThemeProvider';
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react' // Modern SVG icons

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-muted/50 animate-pulse" />
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className="group relative p-2.5 rounded-xl transition-all duration-300 
                       hover:bg-primary/10 active:scale-90
                       flex items-center justify-center border border-transparent 
                       hover:border-primary/20"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                {/* Sun Icon */}
                <Sun
                    className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform
                        ${theme === 'dark'
                            ? 'text-yellow-400 rotate-0 scale-100'
                            : 'text-slate-400 rotate-90 scale-0'
                        }`}
                />

                {/* Moon Icon */}
                <Moon
                    className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform
                        ${theme === 'dark'
                            ? 'text-slate-500 -rotate-90 scale-0'
                            : 'text-primary rotate-0 scale-100'
                        }`}
                />
            </div>

            {/* Subtle glow effect for dark mode */}
            {theme === 'dark' && (
                <span className="absolute inset-0 rounded-xl bg-yellow-400/10 blur-md -z-10 animate-pulse" />
            )}
        </button>
    )
}