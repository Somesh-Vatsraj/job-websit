// frontend/src/components/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (start > 1) pages.unshift('...');
        if (end < totalPages) pages.push('...');

        return pages;
    };

    return (
        <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-sm text-muted">…</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`min-w-[2.5rem] h-10 rounded-xl text-sm font-medium transition-all ${page === currentPage
                                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                    : 'text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e]'
                                }`}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/50 dark:hover:bg-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
}