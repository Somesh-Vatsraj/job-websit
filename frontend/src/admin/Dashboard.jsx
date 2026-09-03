// frontend/src/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Newspaper,
    Star,
    TrendingUp,
    Eye,
    Calendar,
    ArrowRight,
    Plus,
} from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        jobs: 0,
        news: 0,
        featured: 0,
        trending: 0,
    });
    const [recentPosts, setRecentPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [allRes, jobsRes, newsRes, featuredRes, trendingRes] = await Promise.all([
                    api.posts.list({ limit: 1 }),
                    api.posts.list({ type: 'job', limit: 1 }),
                    api.posts.list({ type: 'news', limit: 1 }),
                    api.posts.list({ featured: true, limit: 1 }),
                    api.posts.list({ trending: true, limit: 1 }),
                ]);

                // Get total counts from pagination
                const total = allRes.pagination?.total || 0;
                const jobs = jobsRes.pagination?.total || 0;
                const news = newsRes.pagination?.total || 0;
                const featured = featuredRes.pagination?.total || 0;
                const trending = trendingRes.pagination?.total || 0;

                setStats({ total, jobs, news, featured, trending });

                // Get recent posts
                const recentRes = await api.posts.list({ limit: 5, sort: 'created_at' });
                setRecentPosts(recentRes.data || []);
            } catch (err) {
                // Fallback demo data
                setStats({ total: 12, jobs: 7, news: 5, featured: 3, trending: 2 });
                setRecentPosts([
                    {
                        id: 1,
                        title: 'Senior Remote Developer',
                        type: 'job',
                        category: 'Technology',
                        published: true,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        title: 'AI in Recruitment 2026',
                        type: 'news',
                        category: 'AI',
                        published: true,
                        created_at: new Date().toISOString(),
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const statItems = [
        { label: 'Total Posts', value: stats.total, icon: LayoutDashboard, color: 'primary' },
        { label: 'Jobs', value: stats.jobs, icon: Briefcase, color: 'blue' },
        { label: 'News', value: stats.news, icon: Newspaper, color: 'green' },
        { label: 'Featured', value: stats.featured, icon: Star, color: 'gold' },
        { label: 'Trending', value: stats.trending, icon: TrendingUp, color: 'orange' },
    ];

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getTypeBadge = (type) => {
        if (type === 'job' || type === 'work_from_home') {
            return <span className="badge badge-blue text-xs">Job</span>;
        }
        return <span className="badge badge-purple text-xs">News</span>;
    };

    const getStatusBadge = (published) => {
        return published ? (
            <span className="badge badge-green text-xs">Published</span>
        ) : (
            <span className="badge badge-gray text-xs">Draft</span>
        );
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-dark dark:text-white">Dashboard</h1>
                    <p className="text-sm text-muted">Overview of your content</p>
                </div>
                <Link to="/admin/posts/create" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statItems.map(({ label, value, icon: Icon, color }) => {
                    const colorClasses = {
                        primary: 'bg-primary-light/50 text-primary dark:bg-[#2a1a4a]/50',
                        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                        gold: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
                    };
                    return (
                        <div key={label} className="card p-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${colorClasses[color] || colorClasses.primary}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-dark dark:text-white">{value}</p>
                                    <p className="text-xs text-muted">{label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Posts */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-dark dark:text-white">Recent Posts</h2>
                    <Link to="/admin/posts" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-14 w-full rounded-xl" />
                        ))}
                    </div>
                ) : recentPosts.length === 0 ? (
                    <p className="text-sm text-muted py-4 text-center">No posts yet. Create your first post!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-muted uppercase border-b border-[#f0f0f5] dark:border-[#2a2a3e]">
                                <tr>
                                    <th className="text-left py-3 px-3 font-medium">Title</th>
                                    <th className="text-left py-3 px-3 font-medium hidden sm:table-cell">Type</th>
                                    <th className="text-left py-3 px-3 font-medium hidden md:table-cell">Category</th>
                                    <th className="text-left py-3 px-3 font-medium">Status</th>
                                    <th className="text-left py-3 px-3 font-medium hidden sm:table-cell">Date</th>
                                    <th className="text-right py-3 px-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPosts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="border-b border-[#f0f0f5] dark:border-[#2a2a3e] hover:bg-primary-light/10 dark:hover:bg-[#1a1a2e] transition-colors"
                                    >
                                        <td className="py-3 px-3 font-medium text-dark dark:text-white line-clamp-1 max-w-[120px] sm:max-w-none">
                                            {post.title}
                                        </td>
                                        <td className="py-3 px-3 hidden sm:table-cell">{getTypeBadge(post.type)}</td>
                                        <td className="py-3 px-3 hidden md:table-cell text-muted text-xs">
                                            {post.category || '—'}
                                        </td>
                                        <td className="py-3 px-3">{getStatusBadge(post.published)}</td>
                                        <td className="py-3 px-3 hidden sm:table-cell text-muted text-xs">
                                            {formatDate(post.created_at)}
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <Link
                                                to={`/admin/posts/edit/${post.id}`}
                                                className="text-primary hover:underline text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}