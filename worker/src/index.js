// worker/src/index.js
import { Router } from 'itty-router';
import { handleAuth, handleLogout, handleMe } from './auth';
import {
    handleListPosts,
    handleGetPost,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleToggleFeatured,
    handleTogglePublished,
    handleToggleTrending,
    handleListCategories,
    handleNewsletterSubscribe,
} from './posts';
import { corsHeaders, errorResponse, requireAuth } from './utils';

const router = Router();

// CORS preflight
router.options('*', () => {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
});

// Auth routes
router.post('/api/auth/login', handleAuth);
router.post('/api/auth/logout', handleLogout);
router.get('/api/auth/me', requireAuth, handleMe);

// Public post routes
router.get('/api/posts', handleListPosts);
router.get('/api/posts/:id', handleGetPost);

// Admin post routes (require auth)
router.post('/api/posts', requireAuth, handleCreatePost);
router.put('/api/posts/:id', requireAuth, handleUpdatePost);
router.delete('/api/posts/:id', requireAuth, handleDeletePost);
router.patch('/api/posts/:id/featured', requireAuth, handleToggleFeatured);
router.patch('/api/posts/:id/published', requireAuth, handleTogglePublished);
router.patch('/api/posts/:id/trending', requireAuth, handleToggleTrending);

// Categories
router.get('/api/categories', handleListCategories);

// Newsletter
router.post('/api/newsletter/subscribe', handleNewsletterSubscribe);

// 404 handler
router.all('*', () => {
    return errorResponse('Not found', 404);
});

export default {
    async fetch(request, env, ctx) {
        // Set env for handlers
        globalThis.__env = env;

        const url = new URL(request.url);
        const path = url.pathname;

        // Handle API routes
        if (path.startsWith('/api')) {
            const response = await router.handle(request, env, ctx);
            if (response) return response;
            return errorResponse('Not found', 404);
        }

        // For non-API routes, return 404
        return errorResponse('Not found', 404);
    },
};