// frontend/src/admin/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        // Check if already logged in
        const session = localStorage.getItem('adminSession');
        if (session) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.auth.login(email, password);
            if (res.success) {
                localStorage.setItem('adminSession', 'true');
                showToast('Welcome back!', 'success');
                navigate('/admin');
            } else {
                showToast(res.message || 'Login failed.', 'error');
            }
        } catch (err) {
            showToast(err.message || 'Invalid credentials. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/30 via-primary-very-light to-white dark:from-[#0a0a1a] dark:via-[#12121a] dark:to-[#12121a] p-4">
            <div className="w-full max-w-md">
                <div className="card p-8 shadow-soft-lg">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-sm shadow-primary/20">
                            R
                        </div>
                        <h1 className="text-2xl font-bold text-dark dark:text-white">Admin Login</h1>
                        <p className="text-sm text-muted mt-1">Sign in to manage your content</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="label">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="input pl-12"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input pl-12 pr-12"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark dark:hover:text-white transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-[#e4e4e7] text-primary focus:ring-primary/40"
                                />
                                Remember me
                            </label>
                            <a href="#" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-3 text-base"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted mt-6">
                        Secure admin access. All actions are logged.
                    </p>
                </div>
            </div>
        </div>
    );
}