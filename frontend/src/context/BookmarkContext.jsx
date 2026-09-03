// frontend/src/context/BookmarkContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

export function BookmarksProvider({ children }) {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const addBookmark = (postId) => {
        if (!bookmarks.includes(postId)) {
            setBookmarks((prev) => [...prev, postId]);
            return true;
        }
        return false;
    };

    const removeBookmark = (postId) => {
        setBookmarks((prev) => prev.filter((id) => id !== postId));
    };

    const toggleBookmark = (postId) => {
        if (bookmarks.includes(postId)) {
            removeBookmark(postId);
            return false;
        } else {
            addBookmark(postId);
            return true;
        }
    };

    const isBookmarked = (postId) => bookmarks.includes(postId);

    return (
        <BookmarkContext.Provider
            value={{ bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked }}
        >
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const ctx = useContext(BookmarkContext);
    if (!ctx) throw new Error('useBookmarks must be used within BookmarksProvider');
    return ctx;
}