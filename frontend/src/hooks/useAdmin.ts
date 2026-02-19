import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchAdminCollection,
    fetchAdminItem,
    createAdminItem,
    updateAdminItem,
    deleteAdminItem,
} from '../services/adminApi';

/**
 * Admin CRUD hook'u — tüm koleksiyonlar için kullanılır
 */
export function useAdminCollection<T extends { id: string }>(collection: string) {
    const queryClient = useQueryClient();
    const queryKey = ['admin', collection];

    const listQuery = useQuery({
        queryKey,
        queryFn: () => fetchAdminCollection<T>(collection),
    });

    const createMutation = useMutation({
        mutationFn: (data: FormData | Record<string, unknown>) =>
            createAdminItem<T>(collection, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData | Record<string, unknown> }) =>
            updateAdminItem<T>(collection, id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAdminItem(collection, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    return {
        items: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        error: listQuery.error,
        refetch: listQuery.refetch,
        create: createMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}

/** Tek kayıt çekme hook'u */
export function useAdminItem<T>(collection: string, id: string | null) {
    return useQuery({
        queryKey: ['admin', collection, id],
        queryFn: () => fetchAdminItem<T>(collection, id!),
        enabled: !!id,
    });
}

/** Auth state hook'u */
export function useAuth() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('admin_user');
        return stored ? JSON.parse(stored) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

    const saveAuth = useCallback((tokenValue: string, userData: Record<string, unknown>) => {
        localStorage.setItem('admin_token', tokenValue);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setToken(null);
        setUser(null);
    }, []);

    return { user, token, isAuthenticated: !!token, saveAuth, logout };
}
