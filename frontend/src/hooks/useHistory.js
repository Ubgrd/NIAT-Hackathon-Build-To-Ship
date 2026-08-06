import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch';

export function useHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch('/api/history');
            setHistory(data.history || []);
        } catch (err) {
            console.error('Failed to fetch history:', err.message);
            setError(err.message || 'Failed to load chat history');
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, loading, error, refetch: fetchHistory };
}

export default useHistory;
