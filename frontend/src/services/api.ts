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
 * Site ayarları (public — herkesin erişebildiği)
 * Admin paneldeki Site Ayarları buradan okunur; cache’li.
 */
export async function fetchPublicSettings(): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE}/api/public/settings`);
    if (!response.ok) throw new Error('API Error: settings');
    const result: ApiResponse<Record<string, unknown>> = await response.json();
    return result.data || {};
}

/**
 * Kurumsal mega menü içeriği — navbar'da KURUMSAL açıldığında gösterilir
 */
export interface KurumsalMenuLink {
    title: string;
    url: string;
}
export interface KurumsalSocialLink {
    label: string;
    url: string;
    icon: string;
}
export interface KurumsalContact {
    address?: string;
    email?: string;
    phone?: string;
    fax?: string;
    kep?: string;
    uets?: string;
}
export interface KurumsalColumnData {
    title: string;
    imageUrl?: string;
    imageCaption?: string;
    socialLinks?: KurumsalSocialLink[];
    menuItems?: KurumsalMenuLink[];
    mapEmbedUrl?: string;
    contact?: KurumsalContact;
}
export interface KurumsalMegamenuData {
    column1: KurumsalColumnData;
    column2: KurumsalColumnData;
    column3: KurumsalColumnData;
}

export async function fetchKurumsalMenu(): Promise<KurumsalMegamenuData | null> {
    const response = await fetch(`${API_BASE}/api/public/kurumsal-menu`);
    if (!response.ok) return null;
    const result: ApiResponse<KurumsalMegamenuData | null> = await response.json();
    return result.data ?? null;
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
