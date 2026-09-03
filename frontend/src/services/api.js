// frontend/src/services/api.js
import { siteConfig } from '../config/site';

const API_BASE = siteConfig.apiBaseUrl;

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
        credentials: 'include',
    };

    try {
        const res = await fetch(url, config);
        const data = await res.json();

        if (!res.ok) {
            if (res.status === 401) {
                // Clear any stale auth state
                localStorage.removeItem('adminSession');
            }
            throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
        }

        return data;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error('Network error. Please check your connection.');
    }
}

export const api = {
    auth: {
        login: (email, password) =>
            request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),
        logout: () =>
            request('/auth/logout', {
                method: 'POST',
            }),
        me: () => request('/auth/me'),
    },

    posts: {
        list: (params = {}) => {
            const qs = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') qs.append(k, v);
            });
            const query = qs.toString();
            return request(`/posts${query ? `?${query}` : ''}`);
        },
        get: (id) => request(`/posts/${id}`),
        create: (data) =>
            request('/posts', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        update: (id, data) =>
            request(`/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        delete: (id) =>
            request(`/posts/${id}`, {
                method: 'DELETE',
            }),
        toggleFeatured: (id) =>
            request(`/posts/${id}/featured`, {
                method: 'PATCH',
            }),
        togglePublished: (id) =>
            request(`/posts/${id}/published`, {
                method: 'PATCH',
            }),
        toggleTrending: (id) =>
            request(`/posts/${id}/trending`, {
                method: 'PATCH',
            }),
    },

    categories: {
        list: () => request('/categories'),
    },

    newsletter: {
        subscribe: (email) =>
            request('/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email }),
            }),
    },
};