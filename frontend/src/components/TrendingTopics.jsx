// frontend/src/components/TrendingTopics.jsx
import React, { useState, useEffect } from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function TrendingTopics({ className = '' }) {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true);
            try {
                const res = await api.posts.list({ trending: true, limit: 5 });
                if (res.data) {
                    setTopics(res.data);
                } else {
                    // Fallback demo topics
                    setTopics([
                        { id: 1, title: 'Remote Work Trends 2026', slug: 'remote-work-trends-2026' },
                        { id: 2, title: 'AI in Recruitment', slug: 'ai-in-recruitment' },
                        { id: 3, title: 'Freelancing Boom', slug: 'freelancing-boom' },
                    ]);
                }
            } catch (err) {
                setTopics([
                    { id: 1, title: 'Remote Work Trends 2026', slug: 'remote-work-trends-2026' },
                    { id: 2, title: 'AI in Recruitment', slug: 'ai-in-recruitment' },
                    { id: 3, title: 'Freelancing Boom', slug: 'freelancing-boom' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopics();
    }, []);

    return (
        <div className={`card p-4 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-400" />
                <h4 className="font-semibold text-dark dark:text-white">Trending Topics</h4>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-6 w-full rounded" />
                    ))}
                </div>
            ) : topics.length === 0 ? (
                <p className="text-sm text-muted">No trending topics right now.</p>
            ) : (
                <ul className="space-y-2.5">
                    {topics.map((topic) => (
                        <li key={topic.id}>
                            <Link
                                to={`/post/${topic.id}/${topic.slug || topic.title?.toLowerCase().replace(/\s+/g, '-')}`}
                                className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors group"
                            >
                                <ChevronRight className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                                <span className="line-clamp-1">{topic.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}