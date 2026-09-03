// frontend/src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
    onSearch,
    placeholder = 'Search jobs, companies, skills...',
    className = '',
    initialValue = '',
}) {
    const [query, setQuery] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    return (
        <div
            className={`relative flex items-center bg-white dark:bg-[#1a1a2e] rounded-2xl border transition-all duration-300 ${isFocused
                    ? 'border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20'
                    : 'border-[#e4e4e7] dark:border-[#2a2a3e]'
                } ${className}`}
        >
            <Search className="absolute left-4 w-5 h-5 text-muted" />
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="w-full bg-transparent pl-12 pr-12 py-3.5 rounded-2xl text-dark dark:text-white placeholder:text-muted focus:outline-none"
                aria-label="Search"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-4 p-1 rounded-full text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#2a2a3e] transition-colors"
                    aria-label="Clear search"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}