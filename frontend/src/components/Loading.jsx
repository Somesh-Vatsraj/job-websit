// frontend/src/components/Loading.jsx
import React from 'react';

export default function Loading({ fullScreen = false, message = 'Loading...' }) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-muted text-sm animate-pulse">{message}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-primary-very-light/80 dark:bg-[#12121a]/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
}