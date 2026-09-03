// frontend/src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import MediaThumbnail from './MediaThumbnail';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';

export default function JobCard({ post }) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const { showToast } = useToast();
    const bookmarked = isBookmarked(post.id);

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nowBookmarked = toggleBookmark(post.id);
        showToast(
            nowBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks',
            nowBookmarked ? 'success' : 'info'
        );
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const salaryDisplay = post.salary_min && post.salary_max
        ? `${post.currency || '₹'}${post.salary_min.toLocaleString()} - ${post.salary_max.toLocaleString()}`
        : post.salary_min
            ? `${post.currency || '₹'}${post.salary_min.toLocaleString()}+`
            : 'Salary not disclosed';

    return (
        <Link
            to={`/post/${post.id}/${post.slug || post.title?.toLowerCase().replace(/\s+/g, '-')}`}
            className="card group block overflow-hidden hover:border-primary/30 hover:shadow-soft-lg transition-all duration-300"
        >
            {/* Image */}
            <div className="relative overflow-hidden">
                <MediaThumbnail
                    src={post.image_url}
                    alt={post.title}
                    className="rounded-t-2xl"
                    aspectRatio="16/9"
                />
                {/* Badge overlay */}
                {post.featured && (
                    <span className="absolute top-3 left-3 badge badge-gold text-xs shadow-sm">
                        ⭐ Featured
                    </span>
                )}
                {post.trending && (
                    <span className="absolute top-3 left-3 badge badge-orange text-xs shadow-sm">
                        🔥 Trending
                    </span>
                )}
                <button
                    onClick={handleBookmark}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-[#12121a]/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-200"
                    aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                    {bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                        <Bookmark className="w-4 h-4 text-muted" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-dark dark:text-white text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-sm text-muted truncate">{post.company_name || 'Company'}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="badge badge-purple text-xs">
                        <Briefcase className="w-3 h-3" />
                        {post.category || 'General'}
                    </span>
                    <span className="badge badge-blue text-xs">
                        <MapPin className="w-3 h-3" />
                        {post.work_mode || 'Remote'}
                    </span>
                </div>

                <div className="flex items-center gap-3 mt-3 text-sm text-muted">
                    <span className="font-medium text-primary">{salaryDisplay}</span>
                    <span className="w-1 h-1 rounded-full bg-[#e4e4e7] dark:bg-[#2a2a3e]" />
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.created_at)}
                    </span>
                </div>

                <div className="flex items-center justify-end mt-4 pt-3 border-t border-[#f0f0f5] dark:border-[#2a2a3e]">
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Job
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}