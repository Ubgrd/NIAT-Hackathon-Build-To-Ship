// frontend/src/lib/apiFetch.js
// Centralized API helper that attaches the JWT Authorization header to all requests.
// The frontend should NEVER talk to Supabase directly — all DB ops go through the backend.

import axios from 'axios';

// Base URL for the backend API
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Creates an axios instance with the JWT token attached.
 * Reads the token from localStorage on each call.
 */
function getApiClient() {
    const token = localStorage.getItem('token');

    return axios.create({
        baseURL: API_BASE,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
}

/**
 * apiFetch — Convenience wrapper around axios with auth header.
 * @param {string} method - HTTP method (get, post, delete, etc.)
 * @param {string} url - API endpoint path (e.g., '/api/history')
 * @param {object} data - Request body (for POST/PUT)
 * @returns {Promise} - axios response
 */
export async function apiFetch(method, url, data = null) {
    const client = getApiClient();

    if (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') {
        return client[method.toLowerCase()](url);
    }

    return client[method.toLowerCase()](url, data);
}

export default apiFetch;
