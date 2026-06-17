import { useQuery } from '@tanstack/react-query';
import { fetchCollection, fetchPageBySlug } from '../services/api';
import type {
    News,
    Announcement,
    Event,
    Project,
    Document,
    Video,
    Banner,
    FastLink,
    Notice,
    Page,
    PhotoGallery,
} from '../types';

/** Haberler */
export const useNews = () =>
    useQuery<News[]>({ queryKey: ['news'], queryFn: () => fetchCollection<News>('news') });

/** Duyurular */
export const useAnnouncements = () =>
    useQuery<Announcement[]>({
        queryKey: ['announcements'],
        queryFn: () => fetchCollection<Announcement>('announcements'),
    });

/** Etkinlikler */
export const useEvents = () =>
    useQuery<Event[]>({ queryKey: ['events'], queryFn: () => fetchCollection<Event>('events') });

/** Projeler */
export const useProjects = () =>
    useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: () => fetchCollection<Project>('projects'),
    });

/** Belgeler */
export const useDocuments = () =>
    useQuery<Document[]>({
        queryKey: ['documents'],
        queryFn: () => fetchCollection<Document>('documents'),
    });

/** Videolar */
export const useVideos = () =>
    useQuery<Video[]>({ queryKey: ['videos'], queryFn: () => fetchCollection<Video>('videos') });

/** Banner (slider) */
export const useBanners = () =>
    useQuery<Banner[]>({
        queryKey: ['banners'],
        queryFn: () => fetchCollection<Banner>('banners'),
    });

/** Hızlı İşlemler */
export const useFastLinks = () =>
    useQuery<FastLink[]>({
        queryKey: ['fast_links'],
        queryFn: () => fetchCollection<FastLink>('fast_links'),
    });

/** İlanlar */
export const useNotices = () =>
    useQuery<Notice[]>({
        queryKey: ['notices'],
        queryFn: () => fetchCollection<Notice>('notices'),
    });

/** Fotoğraf Galerisi */
export const usePhotoGallery = () =>
    useQuery<PhotoGallery[]>({
        queryKey: ['photo-gallery'],
        queryFn: () => fetchCollection<PhotoGallery>('photo-gallery'),
    });

/** Slug ile tek sayfa */
export const usePageBySlug = (slug: string) =>
    useQuery<Page>({
        queryKey: ['page', slug],
        queryFn: () => fetchPageBySlug(slug),
        enabled: !!slug,
    });
