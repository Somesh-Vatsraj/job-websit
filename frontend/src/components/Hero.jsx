// frontend/src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, TrendingUp, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/40 via-primary-very-light to-white dark:from-[#1a0a2e] dark:via-[#12121a] dark:to-[#12121a] border-b border-[#e4e4e7] dark:border-[#2a2a3e]">
            <div className="container-custom py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1e1e2f] border border-[#e4e4e7] dark:border-[#2a2a3e] rounded-full px-4 py-1.5 text-sm text-muted shadow-soft mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Find Your Next Remote Opportunity</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark dark:text-white leading-tight tracking-tight">
                        Discover <span className="text-primary">Work From Home</span> Jobs & Career News
                    </h1>

                    <p className="text-lg text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
                        Explore thousands of remote jobs, career insights, and tech news — all in one place.
                    </p>

                    {/* Quick search */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                type="text"
                                placeholder="Search jobs, companies, skills..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a3e] bg-white dark:bg-[#1a1a2e] text-dark dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        window.location.href = `/jobs?search=${encodeURIComponent(e.target.value)}`;
                                    }
                                }}
                            />
                        </div>
                        <Link to="/jobs" className="btn btn-primary w-full sm:w-auto">
                            <Briefcase className="w-4 h-4" />
                            Browse Jobs
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-8 border-t border-[#e4e4e7] dark:border-[#2a2a3e]">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-dark dark:text-white">10,000+</p>
                            <p className="text-xs text-muted">Remote Jobs</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-dark dark:text-white">500+</p>
                            <p className="text-xs text-muted">Companies</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-dark dark:text-white">24/7</p>
                            <p className="text-xs text-muted">News Updates</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-dark dark:text-white flex items-center justify-center gap-1">
                                <TrendingUp className="w-6 h-6 text-primary" />
                                4.8★
                            </p>
                            <p className="text-xs text-muted">User Rating</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-secondary/5 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />
        </section>
    );
}