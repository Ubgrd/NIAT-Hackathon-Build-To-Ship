// frontend/src/utils/apiFetch.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export default apiFetch;
