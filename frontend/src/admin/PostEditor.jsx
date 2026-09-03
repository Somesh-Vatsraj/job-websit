// frontend/src/admin/PostEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    Send,
    X,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Star,
    Flame,
    Image as ImageIcon,
    Loader,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const POST_TYPES = [
    { value: 'job', label: '💼 Work From Home Job' },
    { value: 'news', label: '📰 Career / Tech News' },
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const CURRENCIES = ['$', '€', '£', '₹', '¥'];

const NEWS_CATEGORIES = [
    'Technology',
    'Career',
    'Work From Home',
    'AI',
    'Education',
    'Business',
    'Freelancing',
    'Government Jobs',
    'Trending',
];

export default function PostEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        type: 'job',
        title: '',
        slug: '',
        company_name: '',
        image_url: '',
        category: '',
        description: '',
        content: '',
        salary_min: '',
        salary_max: '',
        currency: '$',
        work_mode: 'Remote',
        location: '',
        experience: '',
        skills: '',
        requirements: '',
        benefits: '',
        apply_url: '',
        application_instructions: '',
        source_name: '',
        source_url: '',
        tags: '',
        featured: false,
        trending: false,
        published: false,
        created_at: new Date().toISOString().split('T')[0],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                setIsLoading(true);
                try {
                    const res = await api.posts.get(id);
                    if (res.data) {
                        const p = res.data;
                        setFormData({
                            type: p.type || 'job',
                            title: p.title || '',
                            slug: p.slug || '',
                            company_name: p.company_name || '',
                            image_url: p.image_url || '',
                            category: p.category || '',
                            description: p.description || '',
                            content: p.content || '',
                            salary_min: p.salary_min || '',
                            salary_max: p.salary_max || '',
                            currency: p.currency || '$',
                            work_mode: p.work_mode || 'Remote',
                            location: p.location || '',
                            experience: p.experience || '',
                            skills: p.skills || '',
                            requirements: p.requirements || '',
                            benefits: p.benefits || '',
                            apply_url: p.apply_url || '',
                            application_instructions: p.application_instructions || '',
                            source_name: p.source_name || '',
                            source_url: p.source_url || '',
                            tags: p.tags || '',
                            featured: p.featured || false,
                            trending: p.trending || false,
                            published: p.published || false,
                            created_at: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        });
                    }
                } catch (err) {
                    showToast(err.message || 'Failed to load post', 'error');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPost();
        }
    }, [id, isEdit, showToast]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleArrayChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e, publish = false) => {
        e.preventDefault();
        setIsSaving(true);

        const data = {
            ...formData,
            published: publish ? true : formData.published,
            salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
            salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        };

        try {
            if (isEdit) {
                await api.posts.update(id, data);
                showToast('Post updated successfully!', 'success');
            } else {
                await api.posts.create(data);
                showToast('Post created successfully!', 'success');
            }
            navigate('/admin/posts');
        } catch (err) {
            showToast(err.message || 'Failed to save post', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const renderJobFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Company Name</label>
                    <input
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g. Acme Corp"
                    />
                </div>
                <div>
                    <label className="label">Company Logo URL</label>
                    <input
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="input"
                        placeholder="https://example.com/logo.png"
                    />
                </div>
                <div>
                    <label className="label">Salary Min</label>
                    <input
                        name="salary_min"
                        type="number"
                        value={formData.salary_min}
                        onChange={handleChange}
                        className="input"
                        placeholder="30000"
                    />
                </div>
                <div>
                    <label className="label">Salary Max</label>
                    <input
                        name="salary_max"
                        type="number"
                        value={formData.salary_max}
                        onChange={handleChange}
                        className="input"
                        placeholder="50000"
                    />
                </div>
                <div>
                    <label className="label">Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="input">
                        {CURRENCIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label">Work Mode</label>
                    <select name="work_mode" value={formData.work_mode} onChange={handleChange} className="input">
                        {WORK_MODES.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label">Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g. San Francisco, CA"
                    />
                </div>
                <div>
                    <label className="label">Experience Level</label>
                    <input
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g. 3+ years"
                    />
                </div>
                <div>
                    <label className="label">Skills (comma separated)</label>
                    <input
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="input"
                        placeholder="React, Node.js, AWS"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="label">Requirements</label>
                    <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        className="input min-h-[80px]"
                        placeholder="Job requirements..."
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="label">Benefits</label>
                    <textarea
                        name="benefits"
                        value={formData.benefits}
                        onChange={handleChange}
                        className="input min-h-[60px]"
                        placeholder="Health insurance, remote work, etc."
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="label">Apply URL</label>
                    <input
                        name="apply_url"
                        value={formData.apply_url}
                        onChange={handleChange}
                        className="input"
                        placeholder="https://example.com/apply"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="label">Application Instructions</label>
                    <textarea
                        name="application_instructions"
                        value={formData.application_instructions}
                        onChange={handleChange}
                        className="input min-h-[60px]"
                        placeholder="How to apply..."
                    />
                </div>
            </div>
        </>
    );

    const renderNewsFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Source Name</label>
                    <input
                        name="source_name"
                        value={formData.source_name}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g. TechCrunch"
                    />
                </div>
                <div>
                    <label className="label">Source URL</label>
                    <input
                        name="source_url"
                        value={formData.source_url}
                        onChange={handleChange}
                        className="input"
                        placeholder="https://example.com/article"
                    />
                </div>
                <div>
                    <label className="label">Featured Image URL</label>
                    <input
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="input"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                <div>
                    <label className="label">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input">
                        <option value="">Select category</option>
                        {NEWS_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="label">Short Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input min-h-[80px]"
                        placeholder="Brief summary of the article..."
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="label">Full Article Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="input min-h-[200px]"
                        placeholder="Full article content..."
                    />
                </div>
                <div>
                    <label className="label">Tags (comma separated)</label>
                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="input"
                        placeholder="remote, work, technology"
                    />
                </div>
            </div>
        </>
    );

    const renderBasicFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="label">Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter title..."
                    required
                />
            </div>
            <div>
                <label className="label">Post Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="input">
                    {POST_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="label">Category</label>
                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. Technology, Marketing"
                />
            </div>
            <div className="md:col-span-2">
                <label className="label">Description / Excerpt</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input min-h-[80px]"
                    placeholder="Short description..."
                />
            </div>
        </div>
    );

    const renderPublishFields = () => (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-dark dark:text-white cursor-pointer">
                    <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-[#e4e4e7] text-primary focus:ring-primary/40"
                    />
                    Published
                </label>
                <label className="flex items-center gap-2 text-sm text-dark dark:text-white cursor-pointer">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-[#e4e4e7] text-primary focus:ring-primary/40"
                    />
                    Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-dark dark:text-white cursor-pointer">
                    <input
                        type="checkbox"
                        name="trending"
                        checked={formData.trending}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-[#e4e4e7] text-primary focus:ring-primary/40"
                    />
                    Trending
                </label>
            </div>
            <div>
                <label className="label">Publish Date</label>
                <input
                    type="date"
                    name="created_at"
                    value={formData.created_at}
                    onChange={handleChange}
                    className="input"
                />
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const isJob = formData.type === 'job' || formData.type === 'work_from_home';

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark dark:text-white">
                        {isEdit ? 'Edit Post' : 'Create New Post'}
                    </h1>
                    <p className="text-sm text-muted">{isEdit ? 'Update your content' : 'Add new content'}</p>
                </div>
                <button
                    onClick={() => navigate('/admin/posts')}
                    className="p-2 rounded-xl text-muted hover:text-dark dark:hover:text-white hover:bg-primary-light/30 dark:hover:bg-[#1a1a2e] transition-colors"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)}>
                {/* Tabs */}
                <div className="flex flex-wrap gap-1 mb-6 border-b border-[#e4e4e7] dark:border-[#2a2a3e] pb-2">
                    {['basic', 'details', 'publish'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab
                                    ? 'bg-primary-light dark:bg-[#2a1a4a] text-primary dark:text-[#c4a0ff]'
                                    : 'text-muted hover:text-dark dark:hover:text-white'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="card p-6 space-y-6">
                    {activeTab === 'basic' && renderBasicFields()}
                    {activeTab === 'details' && (
                        <>
                            {isJob ? renderJobFields() : renderNewsFields()}
                        </>
                    )}
                    {activeTab === 'publish' && renderPublishFields()}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {isEdit ? 'Update' : 'Save Draft'}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={isSaving}
                        className="btn btn-success"
                    >
                        <Send className="w-4 h-4" />
                        Publish
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/posts')}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}