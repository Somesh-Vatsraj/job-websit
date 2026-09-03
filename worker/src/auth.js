// worker/src/auth.js
import { jsonResponse, successResponse, errorResponse, getDb, getAuthSecret, corsHeaders } from './utils';

export async function handleAuth(request, env) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return errorResponse('Email and password required', 400);
        }

        const db = getDb(env);
        const result = await db
            .prepare('SELECT id, email, password_hash FROM admins WHERE email = ?')
            .bind(email)
            .first();

        if (!result) {
            return errorResponse('Invalid credentials', 401);
        }

        // In a real implementation, use bcrypt or a proper password hashing library
        // For this demo, we use a simple comparison with the pre-hashed password
        // The default password is 'admin123' with bcrypt hash
        const bcrypt = require('bcryptjs');
        const valid = await bcrypt.compare(password, result.password_hash);

        if (!valid) {
            return errorResponse('Invalid credentials', 401);
        }

        // Generate JWT-like token
        const secret = getAuthSecret(env);
        const payload = {
            id: result.id,
            email: result.email,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        const payloadB64 = btoa(JSON.stringify(payload));
        const encoder = new TextEncoder();
        const keyData = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign(
            'HMAC',
            keyData,
            encoder.encode(payloadB64)
        );

        const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
        const token = `${payloadB64}.${signatureB64}`;

        // Set cookie
        const headers = {
            ...corsHeaders,
            'Set-Cookie': `admin_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
        };

        return new Response(
            JSON.stringify({
                success: true,
                data: { id: result.id, email: result.email },
                message: 'Login successful',
            }),
            {
                status: 200,
                headers,
            }
        );
    } catch (err) {
        return errorResponse(err.message || 'Authentication failed', 500);
    }
}

export async function handleLogout() {
    const headers = {
        ...corsHeaders,
        'Set-Cookie': 'admin_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    };

    return new Response(
        JSON.stringify({ success: true, message: 'Logged out' }),
        {
            status: 200,
            headers,
        }
    );
}

export async function handleMe(request, env) {
    // The requireAuth middleware already verified the token
    // We just need to return the user info
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
        const [payloadB64] = token.split('.');
        const payload = JSON.parse(atob(payloadB64));
        return successResponse({ id: payload.id, email: payload.email }, 'Authenticated');
    } catch (err) {
        return errorResponse('Invalid token', 401);
    }
}