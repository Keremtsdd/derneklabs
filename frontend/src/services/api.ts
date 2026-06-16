import type { CollectionName, Page } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * Genel koleksiyon verisi çekme — GET /api/v1/:collection
 */
export async function fetchCollection<T>(collection: CollectionName): Promise<T[]> {
    const apiCollection = collection === 'fast_links' ? 'quick-links' : collection;
    const response = await fetch(`${API_BASE}/api/v1/${apiCollection}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} — ${collection}`);
    }
    const result: ApiResponse<any[]> = await response.json();
    return (result.data || []).map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.shortDescription || '',
        content: item.content || '',
        date: item.dynamicProperties?.date || item.dynamicProperties?.eventDate || '',
        image: item.image || '',
        link: item.link || '',
        published: item.isActive,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        ...item
    })) as unknown as T[];
}

/**
 * Tek sayfa slug ile çekme — GET /api/v1/pages/:slug
 */
export async function fetchPageBySlug(slug: string): Promise<Page> {
    const response = await fetch(`${API_BASE}/api/v1/pages/${slug}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} — page/${slug}`);
    }
    const result: ApiResponse<any> = await response.json();
    const item = result.data;
    return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.shortDescription || '',
        body: item.content || '',
        image: item.image || '',
        published: item.isActive,
        created_at: item.createdAt,
        updated_at: item.updatedAt
    } as unknown as Page;
}

/**
 * Site ayarları (public — herkesin erişebildiği)
 */
export async function fetchPublicSettings(): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE}/api/v1/settings`);
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
    const response = await fetch(`${API_BASE}/api/v1/settings/kurumsal_megamenu`);
    if (!response.ok) {
        // Geriye dönük uyumluluk için eski public menu rotasına fallback yap
        const oldResponse = await fetch(`${API_BASE}/api/public/kurumsal-menu`);
        if (!oldResponse.ok) return null;
        const oldResult: ApiResponse<KurumsalMegamenuData | null> = await oldResponse.json();
        return oldResult.data ?? null;
    }
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

/**
 * Destek / İletişim Talebi Oluştur — POST /api/v1/support-tickets
 */
export async function createSupportTicket(payload: { userContact: string; subject: string; message: string }): Promise<boolean> {
    const response = await fetch(`${API_BASE}/api/v1/support-tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_contact: payload.userContact,
            subject: payload.subject,
            message: payload.message
        })
    });
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} — support-tickets`);
    }
    const result: ApiResponse<any> = await response.json();
    return result.success;
}
