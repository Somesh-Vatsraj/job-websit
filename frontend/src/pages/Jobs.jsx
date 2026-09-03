// frontend/src/pages/Jobs.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Filter, X } from 'lucide-react';
import CardGrid from '../components/CardGrid';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import { api } from '../services/api';

export default function Jobs() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const limit = 12;

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                type: 'job',
                page: currentPage,
                limit,
                category: category !== 'All' ? category : undefined,
                search: searchQuery || undefined,
            };
            const res = await api.posts.list(params);
            setPosts(res.data || []);
            setTotalPages(res.pagination?.totalPages || 1);
        } catch (err) {
            setPosts([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, category, searchQuery]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        setCurrentPage(page);
    }, [searchParams]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSearchParams({ page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        setCurrentPage(1);
        setSearchParams({});
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        setSearchParams({});
    };

    const clearFilters = () => {
        setCategory('All');
        setSearchQuery('');
        setCurrentPage(1);
        setSearchParams({});
    };

    const hasFilters = category !== 'All' || searchQuery;

    return (
        <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
                        <Briefcase className="w-7 h-7 text-primary" />
                        Work From Home Jobs
                    </h1>
                    <p className="text-sm text-muted">Find your next remote opportunity</p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden btn btn-secondary flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
                </button>
            </div>

            <SearchBar
                onSearch={handleSearch}
                placeholder="Search jobs by title, company, or skill..."
                className="mb-6"
                initialValue={searchQuery}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters - desktop */}
                <div className="hidden md:block lg:col-span-1">
                    <CategoryFilter selected={category} onChange={handleCategoryChange} />
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-3 text-sm text-muted hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Filters - mobile */}
                <div
                    className={`md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={() => setShowFilters(false)}
                >
                    <div
                        className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-[#12121a] rounded-t-3xl p-6 transition-transform ${showFilters ? 'translate-y-0' : 'translate-y-full'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-dark dark:text-white">Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 rounded-xl hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <CategoryFilter selected={category} onChange={handleCategoryChange} />
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-3 text-sm text-muted hover:text-primary flex items-center gap-1 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    {!isLoading && posts.length > 0 && (
                        <p className="text-sm text-muted mb-4">
                            Showing {posts.length} job{posts.length > 1 ? 's' : ''}
                            {category !== 'All' && ` in ${category}`}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    )}
                    <CardGrid
                        posts={posts}
                        type="jobs"
                        isLoading={isLoading}
                        emptyMessage="No jobs found matching your criteria."
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-6"
                    />
                </div>
            </div>
        </div>
    );
}