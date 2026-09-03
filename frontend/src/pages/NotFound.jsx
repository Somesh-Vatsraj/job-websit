// frontend/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="container-custom py-20">
            <div className="max-w-md mx-auto text-center">
                <div className="text-7xl font-bold text-primary/20 mb-4">404</div>
                <h1 className="text-2xl font-bold text-dark dark:text-white mb-3">Page Not Found</h1>
                <p className="text-muted text-sm mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="btn btn-primary">
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <button onClick={() => window.history.back()} className="btn btn-secondary">
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}