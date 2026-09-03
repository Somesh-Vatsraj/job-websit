// frontend/src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300',
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full">
            {toasts.map(({ id, message, type }) => (
                <div
                    key={id}
                    className={`card p-4 border ${typeStyles[type]} animate-slide-up shadow-soft-lg`}
                    role="alert"
                >
                    <div className="flex items-start gap-3">
                        <span className="flex-1 text-sm">{message}</span>
                        <button
                            onClick={() => removeToast(id)}
                            className="text-muted hover:text-dark dark:hover:text-white transition-colors"
                            aria-label="Dismiss notification"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}