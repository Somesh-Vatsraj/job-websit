// frontend/src/admin/Posts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Star,
    StarOff,
    Flame,
    FlameOff,
    Filter,
    X,
    ArrowUpDown,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('created_at_desc');
    const { showToast } = useToast();
    const limit = 10;

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit,
                sort: sort.replace('_desc', '').replace('_asc', ''),
                order: sort.includes('desc') ? 'desc' : 'asc',
                search: search || undefined,
                type: typeFilter !== 'all' ? typeFilter : undefined,
                published: statusFilter !== 'all' ? statusFilter === 'published' : undefined,
            };
            const res = await api.posts.list(params);
            setPosts(res.data || []);
            setTotalPages(res.pagination?.totalPages || 1);
        } catch (err) {
            showToast(err.message || 'Failed to load posts', 'error');
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, search, typeFilter, statusFilter, sort, showToast]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (id, title) => {
        if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
        try {
            await api.posts.delete(id);
            showToast('Post deleted successfully', 'success');
            fetchPosts();
        } catch (err) {
            showToast(err.message || 'Failed to delete post', 'error');
        }
    };

    const handleTogglePublished = async (id, current) => {
        try {
            await api.posts.togglePublished(id);
            showToast(`Post ${current ? 'unpublished' : 'published'}`, 'success');
            fetchPosts();
        } catch (err) {
            showToast(err.message || 'Failed to update status', 'error');
        }
    };

    const handleToggleFeatured = async (id, current) => {
        try {
            await api.posts.toggleFeatured(id);
            showToast(`Post ${current ? 'unfeatured' : 'featured'}`, 'success');
            fetchPosts();
        } catch (err) {
            showToast(err.message || 'Failed to update featured status', 'error');
        }
    };

    const handleToggleTrending = async (id, current) => {
        try {
            await api.posts.toggleTrending(id);
            showToast(`Post ${current ? 'removed from' : 'added to'} trending`, 'success');
            fetchPosts();
        } catch (err) {
            showToast(err.message || 'Failed to update trending status', 'error');
        }
    };

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('all');
        setStatusFilter('all');
        setSort('created_at_desc');
        setCurrentPage(1);
    };

    const hasFilters = search || typeFilter !== 'all' || statusFilter !== 'all' || sort !== 'created_at_desc';

    const getTypeBadge = (type) => {
        const map = {
            job: 'badge-blue',
            work_from_home: 'badge-blue',
            news: 'badge-purple',
        };
        const label = type === 'job' || type === 'work_from_home' ? 'Job' : 'News';
        return <span className={`badge ${map[type] || 'badge-gray'} text-xs`}>{label}</span>;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark dark:text-white">Posts</h1>
                    <p className="text-sm text-muted">Manage all your content</p>
                </div>
                <Link to="/admin/posts/create" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search posts..."
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="input md:w-40"
                    >
                        <option value="all">All Types</option>
                        <option value="job">Jobs</option>
                        <option value="news">News</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input md:w-40"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="input md:w-44"
                    >
                        <option value="created_at_desc">Newest First</option>
                        <option value="created_at_asc">Oldest First</option>
                        <option value="title_asc">Title A-Z</option>
                        <option value="title_desc">Title Z-A</option>
                    </select>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors whitespace-nowrap"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Posts table */}
            <div className="card p-0 overflow-hidden">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton h-14 w-full rounded-xl" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-light dark:bg-[#2a1a4a] flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8 text-primary/40" />
                        </div>
                        <h3 className="font-semibold text-dark dark:text-white">No posts found</h3>
                        <p className="text-sm text-muted">Try adjusting your filters or create a new post.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-muted uppercase border-b border-[#f0f0f5] dark:border-[#2a2a3e] bg-primary-light/20 dark:bg-[#1a1a2e]">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium">Title</th>
                                    <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Type</th>
                                    <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Category</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Date</th>
                                    <th className="text-center py-3 px-4 font-medium">Featured</th>
                                    <th className="text-center py-3 px-4 font-medium">Trending</th>
                                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="border-b border-[#f0f0f5] dark:border-[#2a2a3e] hover:bg-primary-light/10 dark:hover:bg-[#1a1a2e] transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <span className="font-medium text-dark dark:text-white line-clamp-1 max-w-[180px] sm:max-w-none">
                                                {post.title}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell">{getTypeBadge(post.type)}</td>
                                        <td className="py-3 px-4 hidden md:table-cell text-muted text-xs">
                                            {post.category || '—'}
                                        </td>
                                        <td className="py-3 px-4">
                                            {post.published ? (
                                                <span className="badge badge-green text-xs">Published</span>
                                            ) : (
                                                <span className="badge badge-gray text-xs">Draft</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell text-muted text-xs">
                                            {formatDate(post.created_at)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleToggleFeatured(post.id, post.featured)}
                                                className="transition-colors hover:scale-110"
                                                aria-label={post.featured ? 'Unfeature' : 'Feature'}
                                            >
                                                {post.featured ? (
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                ) : (
                                                    <StarOff className="w-4 h-4 text-muted" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleToggleTrending(post.id, post.trending)}
                                                className="transition-colors hover:scale-110"
                                                aria-label={post.trending ? 'Remove from trending' : 'Add to trending'}
                                            >
                                                {post.trending ? (
                                                    <Flame className="w-4 h-4 text-orange-500" />
                                                ) : (
                                                    <FlameOff className="w-4 h-4 text-muted" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleTogglePublished(post.id, post.published)}
                                                    className="p-1.5 rounded-lg text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/30 dark:hover:bg-[#1a1a2e] transition-colors"
                                                    aria-label={post.published ? 'Unpublish' : 'Publish'}
                                                >
                                                    {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <Link
                                                    to={`/admin/posts/edit/${post.id}`}
                                                    className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-light/30 dark:hover:bg-[#1a1a2e] transition-colors"
                                                    aria-label="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0f0f5] dark:border-[#2a2a3e]">
                        <p className="text-xs text-muted">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/30 dark:hover:bg-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/30 dark:hover:bg-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}