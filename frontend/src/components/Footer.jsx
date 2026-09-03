// frontend/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '../config/site';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[#e4e4e7] dark:border-[#2a2a3e] bg-white dark:bg-[#12121a] mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2.5 group mb-4">
                            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
                                R
                            </div>
                            <span className="text-lg font-bold text-dark dark:text-white">
                                {siteConfig.siteName}
                            </span>
                        </Link>
                        <p className="text-muted text-sm max-w-sm leading-relaxed">
                            {siteConfig.description}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <a
                                href="#"
                                className="text-muted hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted hover:text-primary transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted hover:text-primary transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href={`mailto:${siteConfig.supportEmail}`}
                                className="text-muted hover:text-primary transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-dark dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/jobs" className="text-muted hover:text-primary transition-colors text-sm">
                                    Work From Home Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/news" className="text-muted hover:text-primary transition-colors text-sm">
                                    Career News
                                </Link>
                            </li>
                            <li>
                                <Link to="/bookmarks" className="text-muted hover:text-primary transition-colors text-sm">
                                    Bookmarks
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-dark dark:text-white mb-4">Support</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <a href="#" className="text-muted hover:text-primary transition-colors text-sm">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted hover:text-primary transition-colors text-sm">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted hover:text-primary transition-colors text-sm">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#e4e4e7] dark:border-[#2a2a3e] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted">
                        © {currentYear} {siteConfig.siteName}. Made with{' '}
                        <Heart className="inline w-4 h-4 text-red-400" /> for remote work.
                    </p>
                    <p className="text-sm text-muted">v1.0.0</p>
                </div>
            </div>
        </footer>
    );
}