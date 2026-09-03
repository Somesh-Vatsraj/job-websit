// frontend/src/pages/Bookmarks.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark as BookmarkIcon, BookmarkX, Grid3x3, LayoutList } from 'lucide-react';
import CardGrid from '../components/CardGrid';
import { useBookmarks } from '../context/BookmarkContext';
import { api } from '../services/api';

export default function Bookmarks() {
    const { bookmarks, removeBookmark } = useBookmarks();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarked = async () => {
            if (bookmarks.length === 0) {
                setPosts([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch all posts and filter by bookmarked IDs
                const res = await api.posts.list({ limit: 100 });
                const allPosts = res.data || [];
                const filtered = allPosts.filter((p) => bookmarks.includes(p.id));
                setPosts(filtered);
            } catch (err) {
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookmarked();
    }, [bookmarks]);

    const handleRemove = (postId) => {
        removeBookmark(postId);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    if (bookmarks.length === 0) {
        return (
            <div className="container-custom py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-20 h-20 rounded-full bg-primary-light dark:bg-[#2a1a4a] flex items-center justify-center mx-auto mb-6">
                        <BookmarkIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-dark dark:text-white mb-3">No Bookmarks Yet</h1>
                    <p className="text-muted text-sm mb-6">
                        Save jobs and news articles you're interested in by tapping the bookmark icon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/jobs" className="btn btn-primary">
                            Browse Jobs
                        </Link>
                        <Link to="/news" className="btn btn-secondary">
                            Read News
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
                        <BookmarkIcon className="w-7 h-7 text-primary" />
                        Bookmarks
                    </h1>
                    <p className="text-sm text-muted">
                        {posts.length} saved item{posts.length > 1 ? 's' : ''}
                    </p>
                </div>
                {posts.length > 0 && (
                    <button
                        onClick={() => {
                            if (confirm('Remove all bookmarks?')) {
                                bookmarks.forEach((id) => removeBookmark(id));
                                setPosts([]);
                            }
                        }}
                        className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                        <BookmarkX className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            <CardGrid
                posts={posts}
                isLoading={isLoading}
                emptyMessage="No bookmarked posts found."
                columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            />

            {!isLoading && posts.length > 0 && (
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted">
                        💡 Bookmarks are stored locally in your browser.
                    </p>
                </div>
            )}
        </div>
    );
}