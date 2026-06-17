/** Tüm koleksiyonlardaki ortak alanlar */
export interface BaseRecord {
    id: string;
    title: string;
    summary: string;
    content?: string;
    date: string;
    image: string;
    link: string;
    created_at: string;
    updated_at: string;
    published: boolean;
    slug?: string;
    dynamicProperties?: any;
}

export interface News extends BaseRecord { }

export interface Announcement extends BaseRecord { }

export interface Event extends BaseRecord { }

export interface Project extends BaseRecord { }

export interface Document extends BaseRecord { }

export interface Video extends BaseRecord { }

export interface Banner extends BaseRecord { }

export interface FastLink extends BaseRecord { }

export interface Notice extends BaseRecord { }

export interface PhotoGallery extends BaseRecord { }

export interface Page {
    id: string;
    slug: string;
    title: string;
    summary: string;
    body: string;
    image: string;
    created_at: string;
    updated_at: string;
    published: boolean;
}

/** API yanıt tipleri */
export type CollectionName =
    | 'news'
    | 'announcements'
    | 'events'
    | 'banners'
    | 'notices'
    | 'documents'
    | 'projects'
    | 'fast_links'
    | 'videos'
    | 'pages'
    | 'photo-gallery';
