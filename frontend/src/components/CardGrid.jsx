// frontend/src/components/CardGrid.jsx
import React from 'react';
import JobCard from './JobCard';
import NewsCard from './NewsCard';
import Loading from './Loading';

export default function CardGrid({
    posts,
    type = 'all', // 'all' | 'jobs' | 'news'
    isLoading = false,
    emptyMessage = 'No posts found.',
    columns = { mobile: 1, tablet: 2, desktop: 3 },
}) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="card p-0 overflow-hidden">
                        <div className="skeleton w-full aspect-[16/9] rounded-t-2xl" />
                        <div className="p-4 space-y-3">
                            <div className="skeleton h-5 w-3/4 rounded" />
                            <div className="skeleton h-4 w-1/2 rounded" />
                            <div className="flex gap-2">
                                <div className="skeleton h-6 w-16 rounded-full" />
                                <div className="skeleton h-6 w-16 rounded-full" />
                            </div>
                            <div className="skeleton h-4 w-1/3 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-light dark:bg-[#2a1a4a] flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
                    {emptyMessage}
                </h3>
                <p className="text-sm text-muted max-w-sm">
                    Try adjusting your search or filters to find what you're looking for.
                </p>
            </div>
        );
    }

    const colClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    const cols = columns.desktop || 3;
    const colKey = cols > 4 ? 4 : cols;

    return (
        <div className={`grid ${colClass[colKey] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-5`}>
            {posts.map((post) => {
                // Determine if it's a job or news post
                const isJob = post.type === 'job' || post.type === 'work_from_home';
                if (type === 'jobs' && !isJob) return null;
                if (type === 'news' && isJob) return null;
                return isJob ? <JobCard key={post.id} post={post} /> : <NewsCard key={post.id} post={post} />;
            })}
        </div>
    );
}