import type { CollectionName, Page } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * Genel koleksiyon verisi çekme — GET /api/public/:collection
 */
export async function fetchCollection<T>(collection: CollectionName): Promise<T[]> {
    const response = await fetch(`${API_BASE}/api/public/${collection}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} — ${collection}`);
    }
    const result: ApiResponse<T[]> = await response.json();
    return result.data;
}

/**
 * Tek sayfa slug ile çekme — GET /api/public/pages/:slug
 */
export async function fetchPageBySlug(slug: string): Promise<Page> {
    const response = await fetch(`${API_BASE}/api/public/pages/${slug}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} — page/${slug}`);
    }
    const result: ApiResponse<Page> = await response.json();
    return result.data;
}

/**
 * Görsel URL'si oluştur
 */
export function resolveImageUrl(path: string): string {
    if (!path) return '/images/placeholder.png';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
    return path;
}
