// backend/lib/auth.js
// JWT authentication middleware
// Verifies the Bearer token from the Authorization header and attaches decoded user to req.user

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || 'dev-fallback-secret-change-me';

/**
 * Middleware: authenticateToken
 * Checks for a valid JWT in the Authorization header.
 * On success, attaches the decoded payload to req.user.
 * On failure, returns 401 or 403.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, github_id, login, name, avatar_url, email }
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

/**
 * Middleware: optionalAuth
 * Same as authenticateToken but doesn't block if no token is present.
 * If a valid token exists, attaches req.user. Otherwise, req.user = null.
 * Useful for endpoints that work with or without auth.
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        req.user = null;
    }
    next();
}

/**
 * Helper: generateToken
 * Creates a signed JWT for a given user payload.
 * Token expires in 7 days.
 */
function generateToken(userPayload) {
    return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { authenticateToken, optionalAuth, generateToken };
