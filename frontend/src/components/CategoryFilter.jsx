// frontend/src/components/CategoryFilter.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

const defaultCategories = [
    'All',
    'Work From Home',
    'Technology',
    'Career',
    'AI',
    'Freelancing',
    'Education',
    'Business',
    'Government Jobs',
    'Trending',
];

export default function CategoryFilter({
    selected = 'All',
    onChange,
    className = '',
    showAll = true,
}) {
    const [categories, setCategories] = useState(defaultCategories);
    const [isLoading, setIsLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const res = await api.categories.list();
                if (res.data && res.data.length > 0) {
                    const catNames = res.data.map((c) => c.name);
                    if (showAll) setCategories(['All', ...catNames]);
                    else setCategories(catNames);
                }
            } catch (err) {
                // Use defaults
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [showAll]);

    const handleSelect = (cat) => {
        onChange(cat);
        if (window.innerWidth < 768) setIsCollapsed(true);
    };

    return (
        <div className={`card p-4 ${className}`}>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex w-full items-center justify-between text-dark dark:text-white font-semibold text-sm mb-2"
            >
                <span>Categories</span>
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div
                className={`space-y-1 transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100'
                    }`}
            >
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton h-9 w-full rounded-lg" />
                        ))}
                    </div>
                ) : (
                    categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleSelect(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selected === cat
                                    ? 'bg-primary-light dark:bg-[#2a1a4a] text-primary dark:text-[#c4a0ff] font-medium'
                                    : 'text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/30 dark:hover:bg-[#1a1a2e]'
                                }`}
                        >
                            {cat}
                            {cat === 'All' && (
                                <span className="ml-2 text-xs text-muted">(everything)</span>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}