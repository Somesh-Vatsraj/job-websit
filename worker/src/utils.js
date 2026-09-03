// worker/src/utils.js
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
};

export function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}

export function successResponse(data, message = 'Success') {
    return jsonResponse({
        success: true,
        data,
        message,
    });
}

export function errorResponse(error, status = 400) {
    return jsonResponse(
        {
            success: false,
            error,
        },
        status
    );
}

export function getDb(env) {
    if (!env || !env.DB) {
        throw new Error('D1 database not available');
    }
    return env.DB;
}

export function getAuthSecret(env) {
    const secret = env.AUTH_SECRET;
    if (!secret) {
        throw new Error('AUTH_SECRET not configured');
    }
    return secret;
}

export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function requireAuth(request, env, ctx) {
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map((c) => {
            const [k, ...v] = c.trim().split('=');
            return [k, v.join('=')];
        })
    );

    const token = cookies.admin_token;

    if (!token) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        // Verify token using crypto
        const secret = getAuthSecret(env);
        const [payloadB64, signature] = token.split('.');
        if (!payloadB64 || !signature) {
            return errorResponse('Invalid token', 401);
        }

        const encoder = new TextEncoder();
        const keyData = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        const payloadData = encoder.encode(payloadB64);
        const signatureData = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));

        const valid = await crypto.subtle.verify(
            'HMAC',
            keyData,
            signatureData,
            payloadData
        );

        if (!valid) {
            return errorResponse('Invalid token', 401);
        }

        const payload = JSON.parse(atob(payloadB64));
        if (payload.exp < Date.now()) {
            return errorResponse('Token expired', 401);
        }

        // Continue to the next handler
        return null;
    } catch (err) {
        return errorResponse('Unauthorized', 401);
    }
}

// Middleware wrapper for auth-protected routes
export async function withAuth(handler, request, env, ctx) {
    const authResult = await requireAuth(request, env, ctx);
    if (authResult) return authResult;
    return handler(request, env, ctx);
}