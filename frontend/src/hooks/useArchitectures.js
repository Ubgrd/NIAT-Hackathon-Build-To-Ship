import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch';

export function useArchitectures() {
    const [architectures, setArchitectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArchitectures = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch('/api/architectures');
            setArchitectures(data.architectures || []);
        } catch (err) {
            console.error('Failed to fetch architectures:', err.message);
            setError(err.message || 'Failed to load saved architectures');
            setArchitectures([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteArchitecture = useCallback(async (id) => {
        try {
            await apiFetch(`/api/architectures/${id}`, { method: 'DELETE' });
            setArchitectures((prev) => prev.filter((arch) => arch.id !== id));
            return { success: true };
        } catch (err) {
            console.error('Failed to delete architecture:', err.message);
            return { success: false, error: err.message || 'Delete failed' };
        }
    }, []);

    useEffect(() => {
        fetchArchitectures();
    }, [fetchArchitectures]);

    return { architectures, loading, error, deleteArchitecture, refetch: fetchArchitectures };
}

export default useArchitectures;
