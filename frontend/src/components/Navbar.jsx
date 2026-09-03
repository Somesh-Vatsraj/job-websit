// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    Briefcase,
    Newspaper,
    Bookmark,
    Search,
    Menu,
    X,
    Moon,
    Sun,
    LogIn,
    Settings,
    LogOut,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../context/BookmarkContext';
import { siteConfig } from '../config/site';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { bookmarks } = useBookmarks();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Check admin session
        const session = localStorage.getItem('adminSession');
        setIsAdmin(!!session);
    }, []);

    const navLinks = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/jobs', label: 'Jobs', icon: Briefcase },
        { to: '/news', label: 'News', icon: Newspaper },
        { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminSession');
        setIsAdmin(false);
        navigate('/');
    };

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 dark:bg-[#12121a]/90 backdrop-blur-md shadow-soft'
                    : 'bg-white dark:bg-[#12121a]'
                } border-b border-[#e4e4e7] dark:border-[#2a2a3e]`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                            R
                        </div>
                        <span className="text-xl font-bold text-dark dark:text-white tracking-tight">
                            {siteConfig.siteName}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-primary-light dark:bg-[#2a1a4a] text-primary dark:text-[#c4a0ff]'
                                        : 'text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e]'
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {label === 'Bookmarks' && bookmarks.length > 0 && (
                                    <span className="ml-1 text-[10px] bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        {bookmarks.length}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/search')}
                            className="p-2 rounded-xl text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isAdmin ? (
                            <div className="hidden md:flex items-center gap-1">
                                <Link
                                    to="/admin"
                                    className="p-2 rounded-xl text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] transition-colors"
                                    aria-label="Admin"
                                >
                                    <Settings className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    aria-label="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary-light/50 dark:hover:bg-[#2a1a4a] transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Admin
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-xl text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] transition-colors"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="border-t border-[#e4e4e7] dark:border-[#2a2a3e] px-4 py-4 space-y-1 bg-white dark:bg-[#12121a]">
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary-light dark:bg-[#2a1a4a] text-primary dark:text-[#c4a0ff]'
                                    : 'text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e]'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                            {label === 'Bookmarks' && bookmarks.length > 0 && (
                                <span className="ml-auto text-[10px] bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                                    {bookmarks.length}
                                </span>
                            )}
                        </NavLink>
                    ))}

                    <div className="border-t border-[#e4e4e7] dark:border-[#2a2a3e] pt-3 mt-2">
                        {isAdmin ? (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] transition-colors"
                                >
                                    <Settings className="w-5 h-5" />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary-light/50 dark:hover:bg-[#2a1a4a] transition-colors"
                            >
                                <LogIn className="w-5 h-5" />
                                Admin Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}