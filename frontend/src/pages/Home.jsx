// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Newspaper, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import CardGrid from '../components/CardGrid';
import CategoryFilter from '../components/CategoryFilter';
import TrendingTopics from '../components/TrendingTopics';
import Newsletter from '../components/Newsletter';
import { api } from '../services/api';

export default function Home() {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentNews, setRecentNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [featuredRes, jobsRes, newsRes] = await Promise.all([
                    api.posts.list({ featured: true, limit: 6 }),
                    api.posts.list({ type: 'job', limit: 6 }),
                    api.posts.list({ type: 'news', limit: 6 }),
                ]);

                setFeaturedPosts(featuredRes.data || []);
                setRecentJobs(jobsRes.data || []);
                setRecentNews(newsRes.data || []);
            } catch (err) {
                // Use demo data if API fails
                const demoFeatured = [
                    {
                        id: 1,
                        title: 'Senior Remote Developer at TechCorp',
                        type: 'job',
                        company_name: 'TechCorp Inc.',
                        category: 'Technology',
                        image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
                        salary_min: 80000,
                        salary_max: 120000,
                        currency: '$',
                        work_mode: 'Remote',
                        featured: true,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        title: 'AI in Recruitment: The Future of Hiring',
                        type: 'news',
                        category: 'AI',
                        image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
                        description: 'How artificial intelligence is transforming the recruitment landscape.',
                        source_name: 'TechCrunch',
                        featured: true,
                        created_at: new Date().toISOString(),
                    },
                ];
                setFeaturedPosts(demoFeatured);
                setRecentJobs(demoFeatured.filter(p => p.type === 'job'));
                setRecentNews(demoFeatured.filter(p => p.type === 'news'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredFeatured = category === 'All'
        ? featuredPosts
        : featuredPosts.filter(p => p.category === category);

    return (
        <div className="space-y-12 pb-12">
            <Hero />

            {/* Featured Section */}
            <section className="container-custom">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Featured
                        </h2>
                        <p className="text-sm text-muted">Handpicked opportunities and stories</p>
                    </div>
                    <Link
                        to="/jobs"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <CategoryFilter
                            selected={category}
                            onChange={setCategory}
                            className="sticky top-24"
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <CardGrid
                            posts={filteredFeatured}
                            isLoading={isLoading}
                            emptyMessage="No featured posts found."
                            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
                        />
                    </div>
                </div>
            </section>

            {/* Recent Jobs & News */}
            <section className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Jobs */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-dark dark:text-white">Recent Jobs</h2>
                            </div>
                            <Link
                                to="/jobs"
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                View all <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <CardGrid
                            posts={recentJobs}
                            isLoading={isLoading}
                            emptyMessage="No jobs posted yet."
                            columns={{ mobile: 1, tablet: 1, desktop: 1 }}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Newspaper className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-dark dark:text-white">Recent News</h2>
                        </div>
                        <CardGrid
                            posts={recentNews}
                            isLoading={isLoading}
                            emptyMessage="No news articles yet."
                            columns={{ mobile: 1, tablet: 1, desktop: 1 }}
                        />

                        <TrendingTopics />
                        <Newsletter />
                    </div>
                </div>
            </section>
        </div>
    );
}