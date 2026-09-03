// frontend/src/pages/PostDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    Calendar,
    DollarSign,
    Share2,
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    Building,
    Users,
    Award,
    Clock,
    Tag,
} from 'lucide-react';
import MediaThumbnail from '../components/MediaThumbnail';
import Loading from '../components/Loading';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await api.posts.get(id);
                if (res.data) {
                    setPost(res.data);
                } else {
                    setError('Post not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load post');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleBookmark = () => {
        if (!post) return;
        const nowBookmarked = toggleBookmark(post.id);
        showToast(
            nowBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks',
            nowBookmarked ? 'success' : 'info'
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="container-custom py-12">
                <Loading />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container-custom py-12 text-center">
                <div className="card p-8 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
                        {error || 'Post not found'}
                    </h2>
                    <p className="text-muted text-sm mb-4">
                        The post you're looking for doesn't exist or has been removed.
                    </p>
                    <Link to="/" className="btn btn-primary">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const isJob = post.type === 'job' || post.type === 'work_from_home';

    return (
        <div className="container-custom py-8">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted hover:text-dark dark:hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    <div className="card overflow-hidden">
                        <MediaThumbnail
                            src={post.image_url}
                            alt={post.title}
                            className="w-full"
                            aspectRatio="16/9"
                        />
                    </div>

                    {/* Title & meta */}
                    <div className="card p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                {post.featured && (
                                    <span className="badge badge-gold text-xs mb-2">⭐ Featured</span>
                                )}
                                {post.trending && (
                                    <span className="badge badge-orange text-xs mb-2 ml-2">🔥 Trending</span>
                                )}
                                <h1 className="text-2xl md:text-3xl font-bold text-dark dark:text-white">
                                    {post.title}
                                </h1>
                                {isJob && post.company_name && (
                                    <p className="text-lg text-muted mt-1">{post.company_name}</p>
                                )}
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={handleBookmark}
                                    className="p-3 rounded-xl bg-primary-light dark:bg-[#2a1a4a] hover:bg-primary/20 transition-colors"
                                    aria-label={isBookmarked(post.id) ? 'Remove bookmark' : 'Add bookmark'}
                                >
                                    {isBookmarked(post.id) ? (
                                        <BookmarkCheck className="w-5 h-5 text-primary" />
                                    ) : (
                                        <Bookmark className="w-5 h-5 text-muted" />
                                    )}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-3 rounded-xl bg-primary-light dark:bg-[#2a1a4a] hover:bg-primary/20 transition-colors"
                                    aria-label="Share"
                                >
                                    <Share2 className="w-5 h-5 text-muted" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[#f0f0f5] dark:border-[#2a2a3e]">
                            <span className="badge badge-purple">
                                {post.category || 'General'}
                            </span>
                            {isJob && post.work_mode && (
                                <span className="badge badge-blue">
                                    <MapPin className="w-3 h-3" />
                                    {post.work_mode}
                                </span>
                            )}
                            <span className="text-sm text-muted flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.created_at)}
                            </span>
                            {post.source_name && (
                                <span className="text-sm text-muted">• Source: {post.source_name}</span>
                            )}
                        </div>
                    </div>

                    {/* Job details */}
                    {isJob && (
                        <div className="card p-6">
                            <h2 className="font-semibold text-dark dark:text-white text-lg mb-4">Job Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {post.salary_min && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-light/30 dark:bg-[#2a1a4a]/30">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted">Salary</p>
                                            <p className="font-medium text-dark dark:text-white">
                                                {post.currency || '$'}
                                                {post.salary_min.toLocaleString()}
                                                {post.salary_max && ` - ${post.salary_max.toLocaleString()}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {post.work_mode && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-light/30 dark:bg-[#2a1a4a]/30">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted">Work Mode</p>
                                            <p className="font-medium text-dark dark:text-white">{post.work_mode}</p>
                                        </div>
                                    </div>
                                )}
                                {post.location && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-light/30 dark:bg-[#2a1a4a]/30">
                                        <Building className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted">Location</p>
                                            <p className="font-medium text-dark dark:text-white">{post.location}</p>
                                        </div>
                                    </div>
                                )}
                                {post.experience && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-light/30 dark:bg-[#2a1a4a]/30">
                                        <Award className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted">Experience</p>
                                            <p className="font-medium text-dark dark:text-white">{post.experience}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-dark dark:text-white text-lg mb-3">
                            {isJob ? 'Job Description' : 'Article'}
                        </h2>
                        <div className="prose prose-purple dark:prose-invert max-w-none">
                            {post.description && <p className="text-muted mb-4">{post.description}</p>}
                            {post.content && (
                                <div
                                    className="text-dark dark:text-white whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            )}
                            {isJob && !post.content && post.description && (
                                <p className="text-dark dark:text-white">{post.description}</p>
                            )}
                        </div>

                        {isJob && post.apply_url && (
                            <div className="mt-6 pt-6 border-t border-[#f0f0f5] dark:border-[#2a2a3e]">
                                <a
                                    href={post.apply_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary inline-flex items-center gap-2"
                                >
                                    Apply Now
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                {post.application_instructions && (
                                    <p className="text-sm text-muted mt-3">{post.application_instructions}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="card p-6">
                            <h2 className="font-semibold text-dark dark:text-white text-lg mb-3">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.split(',').map((tag, i) => (
                                    <span
                                        key={i}
                                        className="badge badge-gray text-xs"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {isJob && post.company_name && (
                        <div className="card p-5">
                            <h3 className="font-semibold text-dark dark:text-white text-sm mb-3">Company</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-light dark:bg-[#2a1a4a] flex items-center justify-center text-primary font-bold text-lg">
                                    {post.company_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-dark dark:text-white">{post.company_name}</p>
                                    {post.location && <p className="text-xs text-muted">{post.location}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card p-5">
                        <h3 className="font-semibold text-dark dark:text-white text-sm mb-3">Information</h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between py-1.5 border-b border-[#f0f0f5] dark:border-[#2a2a3e]">
                                <dt className="text-muted">Posted</dt>
                                <dd className="text-dark dark:text-white">{formatDate(post.created_at)}</dd>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-[#f0f0f5] dark:border-[#2a2a3e]">
                                <dt className="text-muted">Category</dt>
                                <dd className="text-dark dark:text-white">{post.category || 'General'}</dd>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <dt className="text-muted">Type</dt>
                                <dd className="text-dark dark:text-white">
                                    {isJob ? '💼 Job' : '📰 News'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {isJob && (
                        <div className="card p-5 bg-primary-light/20 dark:bg-[#2a1a4a]/20 border-primary/20">
                            <h3 className="font-semibold text-dark dark:text-white text-sm mb-2">
                                💡 Quick Apply Tip
                            </h3>
                            <p className="text-sm text-muted">
                                Tailor your resume to highlight remote work experience and relevant skills.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}