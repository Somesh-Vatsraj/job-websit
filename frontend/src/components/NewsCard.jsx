// frontend/src/components/NewsCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import MediaThumbnail from './MediaThumbnail';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';

export default function NewsCard({ post }) {
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

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const truncateText = (text, max = 120) => {
        if (!text) return '';
        if (text.length <= max) return text;
        return text.slice(0, max) + '...';
    };

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
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={handleBookmark}
                        className="p-2 rounded-full bg-white/90 dark:bg-[#12121a]/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-200"
                        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                        {bookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-primary" />
                        ) : (
                            <Bookmark className="w-4 h-4 text-muted" />
                        )}
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-white/90 dark:bg-[#12121a]/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-200"
                        aria-label="Share"
                    >
                        <Share2 className="w-4 h-4 text-muted" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-purple text-xs">{post.category || 'News'}</span>
                    {post.source_name && (
                        <span className="text-xs text-muted">• {post.source_name}</span>
                    )}
                </div>

                <h3 className="font-semibold text-dark dark:text-white text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                </h3>

                {post.description && (
                    <p className="text-sm text-muted mt-2 line-clamp-2">{truncateText(post.description, 100)}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0f0f5] dark:border-[#2a2a3e]">
                    <span className="text-xs text-muted flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.created_at)}
                    </span>
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}