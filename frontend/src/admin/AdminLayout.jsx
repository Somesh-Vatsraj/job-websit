// frontend/src/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/posts', label: 'Posts', icon: FileText },
    ];

    const handleLogout = async () => {
        try {
            await api.auth.logout();
        } catch (err) {
            // Ignore
        }
        localStorage.removeItem('adminSession');
        showToast('Logged out successfully', 'info');
        navigate('/admin/login');
    };

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMobileOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-primary-very-light dark:bg-[#12121a]">
            {/* Mobile menu toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-xl bg-white dark:bg-[#1e1e2f] shadow-soft border border-[#e4e4e7] dark:border-[#2a2a3e]"
                    aria-label="Toggle admin menu"
                >
                    {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white dark:bg-[#12121a] border-r border-[#e4e4e7] dark:border-[#2a2a3e] transition-all duration-300 z-40 ${isCollapsed ? 'w-[72px]' : 'w-[240px]'
                    } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className={`flex items-center h-16 border-b border-[#e4e4e7] dark:border-[#2a2a3e] px-4 ${isCollapsed ? 'justify-center' : ''}`}>
                        <Link to="/admin" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
                                R
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold text-dark dark:text-white">Admin</span>
                            )}
                        </Link>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setIsMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary-light dark:bg-[#2a1a4a] text-primary dark:text-[#c4a0ff]'
                                        : 'text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/30 dark:hover:bg-[#1a1a2e]'
                                    } ${isCollapsed ? 'justify-center' : ''}`
                                }
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>{label}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className={`border-t border-[#e4e4e7] dark:border-[#2a2a3e] p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>

                    {/* Collapse toggle - desktop */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex absolute -right-3 top-20 p-1 rounded-full bg-white dark:bg-[#1e1e2f] border border-[#e4e4e7] dark:border-[#2a2a3e] shadow-soft hover:shadow-md transition-shadow"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main
                className={`transition-all duration-300 ${isCollapsed ? 'md:ml-[72px]' : 'md:ml-[240px]'
                    } p-4 md:p-6`}
            >
                <div className="max-w-6xl">
                    <Outlet />
                </div>
            </main>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </div>
    );
}