// worker/src/posts.js
import {
    jsonResponse,
    successResponse,
    errorResponse,
    getDb,
    slugify,
    validateEmail,
    corsHeaders,
} from './utils';

export async function handleListPosts(request, env) {
    try {
        const url = new URL(request.url);
        const db = getDb(env);

        // Parse query params
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 12;
        const offset = (page - 1) * limit;
        const type = url.searchParams.get('type');
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        const featured = url.searchParams.get('featured');
        const trending = url.searchParams.get('trending');
        const published = url.searchParams.get('published') !== 'false' ? true : undefined;
        const sort = url.searchParams.get('sort') || 'created_at';
        const order = url.searchParams.get('order') || 'desc';

        // Build query
        let query = 'SELECT * FROM posts WHERE 1=1';
        const params = [];

        if (published !== undefined) {
            query += ' AND published = ?';
            params.push(published ? 1 : 0);
        } else {
            // Default: only show published
            query += ' AND published = 1';
            params.push(1);
        }

        if (type && (type === 'job' || type === 'news' || type === 'work_from_home')) {
            query += ' AND type = ?';
            params.push(type);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (title LIKE ? OR company_name LIKE ? OR description LIKE ? OR tags LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (featured === 'true') {
            query += ' AND featured = 1';
        }

        if (trending === 'true') {
            query += ' AND trending = 1';
        }

        // Count total
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const countResult = await db.prepare(countQuery).bind(...params).first();
        const total = countResult?.total || 0;

        // Add ordering and pagination
        const validSorts = ['created_at', 'updated_at', 'title', 'id'];
        const sortField = validSorts.includes(sort) ? sort : 'created_at';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const result = await db.prepare(query).bind(...params).all();
        const posts = result.results || [];

        return successResponse(
            {
                posts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
            'Posts retrieved'
        );
    } catch (err) {
        return errorResponse(err.message || 'Failed to fetch posts', 500);
    }
}

export async function handleGetPost(request, env, ctx) {
    try {
        const id = ctx.params?.id;
        if (!id) {
            return errorResponse('Post ID required', 400);
        }

        const db = getDb(env);
        const result = await db
            .prepare('SELECT * FROM posts WHERE id = ?')
            .bind(parseInt(id))
            .first();

        if (!result) {
            return errorResponse('Post not found', 404);
        }

        return successResponse(result, 'Post retrieved');
    } catch (err) {
        return errorResponse(err.message || 'Failed to fetch post', 500);
    }
}

export async function handleCreatePost(request, env) {
    try {
        const data = await request.json();
        const db = getDb(env);

        // Validate required fields
        if (!data.title) {
            return errorResponse('Title is required', 400);
        }

        const slug = data.slug || slugify(data.title);
        const now = new Date().toISOString();

        // Insert post
        const result = await db
            .prepare(`
        INSERT INTO posts (
          type, title, slug, company_name, category, description, content,
          image_url, salary_min, salary_max, currency, work_mode, location,
          experience, skills, requirements, benefits, apply_url,
          application_instructions, source_name, source_url, tags,
          featured, trending, published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(
                data.type || 'job',
                data.title,
                slug,
                data.company_name || null,
                data.category || null,
                data.description || null,
                data.content || null,
                data.image_url || null,
                data.salary_min || null,
                data.salary_max || null,
                data.currency || '$',
                data.work_mode || null,
                data.location || null,
                data.experience || null,
                data.skills || null,
                data.requirements || null,
                data.benefits || null,
                data.apply_url || null,
                data.application_instructions || null,
                data.source_name || null,
                data.source_url || null,
                data.tags || null,
                data.featured ? 1 : 0,
                data.trending ? 1 : 0,
                data.published ? 1 : 0,
                data.created_at || now,
                now
            )
            .run();

        const postId = result.meta?.last_row_id || result.lastRowId;

        const newPost = await db
            .prepare('SELECT * FROM posts WHERE id = ?')
            .bind(postId)
            .first();

        return successResponse(newPost, 'Post created successfully');
    } catch (err) {
        return errorResponse(err.message || 'Failed to create post', 500);
    }
}

export async function handleUpdatePost(request, env, ctx) {
    try {
        const id = ctx.params?.id;
        if (!id) {
            return errorResponse('Post ID required', 400);
        }

        const data = await request.json();
        const db = getDb(env);

        // Check if post exists
        const existing = await db
            .prepare('SELECT * FROM posts WHERE id = ?')
            .bind(parseInt(id))
            .first();

        if (!existing) {
            return errorResponse('Post not found', 404);
        }

        const slug = data.slug || slugify(data.title || existing.title);
        const now = new Date().toISOString();

        // Build update query dynamically
        const fields = [];
        const values = [];

        const fieldMap = {
            type: data.type,
            title: data.title,
            slug,
            company_name: data.company_name,
            category: data.category,
            description: data.description,
            content: data.content,
            image_url: data.image_url,
            salary_min: data.salary_min,
            salary_max: data.salary_max,
            currency: data.currency,
            work_mode: data.work_mode,
            location: data.location,
            experience: data.experience,
            skills: data.skills,
            requirements: data.requirements,
            benefits: data.benefits,
            apply_url: data.apply_url,
            application_instructions: data.application_instructions,
            source_name: data.source_name,
            source_url: data.source_url,
            tags: data.tags,
            featured: data.featured !== undefined ? (data.featured ? 1 : 0) : undefined,
            trending: data.trending !== undefined ? (data.trending ? 1 : 0) : undefined,
            published: data.published !== undefined ? (data.published ? 1 : 0) : undefined,
        };

        for (const [key, val] of Object.entries(fieldMap)) {
            if (val !== undefined) {
                fields.push(`${key} = ?`);
                values.push(val);
            }
        }

        if (fields.length === 0) {
            return errorResponse('No fields to update', 400);
        }

        values.push(now, parseInt(id));

        const query = `
      UPDATE posts 
      SET ${fields.join(', ')}, updated_at = ?
      WHERE id = ?
    `;

        await db.prepare(query).bind(...values).run();

        const updated = await db
            .prepare('SELECT * FROM posts WHERE id = ?')
            .bind(parseInt(id))
            .first();

        return successResponse(updated, 'Post updated successfully');
    } catch (err) {
        return errorResponse(err.message || 'Failed to update post', 500);
    }
}

export async function handleDeletePost(request, env, ctx) {
    try {
        const id = ctx.params?.id;
        if (!id) {
            return errorResponse('Post ID required', 400);
        }

        const db = getDb(env);

        const existing = await db
            .prepare('SELECT * FROM posts WHERE id = ?')
            .bind(parseInt(id))
            .first();

        if (!existing) {
            return errorResponse('Post not found', 404);
        }

        await db
            .prepare('DELETE FROM posts WHERE id = ?')
            .bind(parseInt(id))
            .run();

        return successResponse({ id: parseInt(id) }, 'Post deleted successfully');
    } catch (err) {
        return errorResponse(err.message || 'Failed to delete post', 500);
    }
}

// Toggle helpers
export async function handleToggleFeatured(request, env, ctx) {
    return toggleField(request, env, ctx, 'featured');
}

export async function handleTogglePublished(request, env, ctx) {
    return toggleField(request, env, ctx, 'published');
}

export async function handleToggleTrending(request, env, ctx) {
    return toggleField(request, env, ctx, 'trending');
}

async function toggleField(request, env, ctx, field) {
    try {
        const id = ctx.params?.id;
        if (!id) {
            return errorResponse('Post ID required', 400);
        }

        const db = getDb(env);

        const existing = await db
            .prepare('SELECT * FROM posts WHERE id = ?')
            .bind(parseInt(id))
            .first();

        if (!existing) {
            return errorResponse('Post not found', 404);
        }

        const currentValue = existing[field] ? 1 : 0;
        const newValue = currentValue === 1 ? 0 : 1;

        await db
            .prepare(`UPDATE posts SET ${field} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
            .bind(newValue, parseInt(id))
            .run();

        return successResponse(
            { id: parseInt(id), [field]: newValue === 1 },
            `${field} toggled successfully`
        );
    } catch (err) {
        return errorResponse(err.message || `Failed to toggle ${field}`, 500);
    }
}

// Categories
export async function handleListCategories(request, env) {
    try {
        const db = getDb(env);
        const result = await db
            .prepare('SELECT * FROM categories ORDER BY name')
            .all();

        return successResponse(result.results || [], 'Categories retrieved');
    } catch (err) {
        return errorResponse(err.message || 'Failed to fetch categories', 500);
    }
}

// Newsletter
export async function handleNewsletterSubscribe(request, env) {
    try {
        const { email } = await request.json();

        if (!email || !validateEmail(email)) {
            return errorResponse('Valid email is required', 400);
        }

        const db = getDb(env);

        // Check if already subscribed
        const existing = await db
            .prepare('SELECT * FROM newsletter_subscribers WHERE email = ?')
            .bind(email)
            .first();

        if (existing) {
            if (existing.active === 0) {
                // Reactivate
                await db
                    .prepare('UPDATE newsletter_subscribers SET active = 1, subscribed_at = CURRENT_TIMESTAMP WHERE email = ?')
                    .bind(email)
                    .run();
                return successResponse({ email }, 'Subscription reactivated');
            }
            return successResponse({ email }, 'Already subscribed');
        }

        await db
            .prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)')
            .bind(email)
            .run();

        return successResponse({ email }, 'Subscribed successfully');
    } catch (err) {
        return errorResponse(err.message || 'Failed to subscribe', 500);
    }
}