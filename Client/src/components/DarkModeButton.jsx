import React, { useState, useEffect } from 'react';
import { Button } from './ui';

// A helper function to apply the theme
const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('color-theme', theme);
};

function DarkModeButton() {
    // Initialize state from localStorage or system preference
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('color-theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Effect to apply the theme whenever the state changes
    useEffect(() => {
        applyTheme(isDark ? 'dark' : 'light');
    }, [isDark]);
    
    // Effect to listen for changes in system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Only change if no theme is manually set in localStorage
            if (!localStorage.getItem('color-theme')) {
                setIsDark(e.matches);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const SunIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
    );

    const MoonIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 008.307-4.498z" />
        </svg>
    );

    return (
        <Button
            onClick={toggleTheme}
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 text-gray-400 hover:bg-slate-700 hover:text-white"
        >
            {isDark ? SunIcon : MoonIcon}
        </Button>
    );
}

export default DarkModeButton;
