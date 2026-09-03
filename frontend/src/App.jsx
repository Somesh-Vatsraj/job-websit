// frontend/src/App.jsx
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarksProvider } from './context/BookmarkContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Jobs = lazy(() => import('./pages/Jobs'));
const News = lazy(() => import('./pages/News'));
const PostDetails = lazy(() => import('./pages/PostDetails'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const AdminPosts = lazy(() => import('./admin/Posts'));
const PostEditor = lazy(() => import('./admin/PostEditor'));

function App() {
    useEffect(() => {
        // Apply dark mode class from localStorage
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (saved === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    return (
        <ThemeProvider>
            <BookmarksProvider>
                <ToastProvider>
                    <div className="min-h-screen flex flex-col bg-primary-very-light dark:bg-[#12121a] transition-colors duration-300">
                        <Navbar />
                        <main className="flex-1">
                            <Suspense fallback={<Loading />}>
                                <Routes>
                                    {/* Public routes */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/jobs" element={<Jobs />} />
                                    <Route path="/news" element={<News />} />
                                    <Route path="/post/:id/:slug?" element={<PostDetails />} />
                                    <Route path="/bookmarks" element={<Bookmarks />} />

                                    {/* Admin routes */}
                                    <Route path="/admin/login" element={<AdminLogin />} />
                                    <Route
                                        path="/admin"
                                        element={
                                            <ProtectedRoute>
                                                <AdminLayout />
                                            </ProtectedRoute>
                                        }
                                    >
                                        <Route index element={<Dashboard />} />
                                        <Route path="posts" element={<AdminPosts />} />
                                        <Route path="posts/create" element={<PostEditor />} />
                                        <Route path="posts/edit/:id" element={<PostEditor />} />
                                    </Route>

                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <Footer />
                    </div>
                </ToastProvider>
            </BookmarksProvider>
        </ThemeProvider>
    );
}

export default App;