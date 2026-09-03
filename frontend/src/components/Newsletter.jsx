// frontend/src/components/Newsletter.jsx
import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Newsletter({ className = '' }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        setStatus('loading');
        try {
            await api.newsletter.subscribe(email);
            setStatus('success');
            setEmail('');
            showToast('Subscribed successfully! 🎉', 'success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            setStatus('error');
            showToast(err.message || 'Subscription failed. Please try again.', 'error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className={`card p-5 ${className}`}>
            <h4 className="font-semibold text-dark dark:text-white mb-1">
                Get the latest jobs & career news
            </h4>
            <p className="text-sm text-muted mb-4">
                Subscribe to our newsletter for weekly updates.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="input pr-12"
                        disabled={status === 'loading' || status === 'success'}
                        aria-label="Email address"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
                        aria-label="Subscribe"
                    >
                        {status === 'loading' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : status === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {status === 'error' && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Something went wrong. Please try again.
                    </p>
                )}

                <p className="text-xs text-muted">
                    No spam. Unsubscribe anytime.
                </p>
            </form>
        </div>
    );
}