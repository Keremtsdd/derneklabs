import { useQuery } from '@tanstack/react-query';
import { fetchPublicSettings } from '../services/api';

export type SiteSettings = Record<string, unknown>;

const QUERY_KEY = ['public', 'settings'];

/** Frontend’de kullanılan ayar anahtarları (admin paneldeki key’lerle aynı) */
export const SETTINGS_KEYS = {
    general_site_name: '',
    general_site_description: '',
    general_logo: '',
    general_favicon: '',
    contact_address: '',
    contact_phone: '',
    contact_email: '',
    contact_map_embed: '',
    seo_meta_title: '',
    seo_meta_description: '',
    seo_meta_keywords: '',
    seo_og_image: '',
    maintenance_enabled: false,
    maintenance_message: '',
} as const;

function getString(settings: SiteSettings | undefined, key: string, fallback: string): string {
    const v = settings?.[key];
    if (v == null || v === '') return fallback;
    return String(v);
}

function getBool(settings: SiteSettings | undefined, key: string, fallback: boolean): boolean {
    const v = settings?.[key];
    if (v == null) return fallback;
    if (typeof v === 'boolean') return v;
    if (v === '1' || v === 'true' || v === 1) return true;
    return false;
}

/**
 * Site ayarlarını public API’den okur (cache’li).
 * Admin panelde yapılan değişiklikler bir sonraki istekte burada yansır.
 */
export function useSiteSettings() {
    const { data, isLoading, isSuccess } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: fetchPublicSettings,
        staleTime: 2 * 60 * 1000,
    });

    return {
        raw: data,
        isLoading,
        isSuccess,
        /** Genel: site adı (varsayılan: Orhanpaşa Bel.) */
        siteName: getString(data, 'general_site_name', 'Orhanpaşa Bel.'),
        /** Genel: site açıklaması */
        siteDescription: getString(data, 'general_site_description', ''),
        /** Genel: logo URL (varsayılan: /images/logo-kare.png) */
        logo: getString(data, 'general_logo', '/images/logo-kare.png'),
        /** İletişim: adres */
        address: getString(
            data,
            'contact_address',
            'Yenidoğan Mahallesi Abdi İpekçi Caddesi No:2, Bayrampaşa/İstanbul'
        ),
        /** İletişim: telefon */
        phone: getString(data, 'contact_phone', '444 1 990'),
        /** İletişim: e-posta */
        email: getString(data, 'contact_email', 'iletisim@orhanpasa.bel.tr'),
        /** İletişim: harita embed HTML */
        mapEmbed: getString(data, 'contact_map_embed', ''),
        /** SEO: meta başlık */
        metaTitle: getString(data, 'seo_meta_title', 'Orhanpaşa Belediyesi'),
        /** SEO: meta açıklama */
        metaDescription: getString(data, 'seo_meta_description', ''),
        /** SEO: OG görsel */
        ogImage: getString(data, 'seo_og_image', ''),
        /** Bakım modu açık mı */
        maintenanceEnabled: getBool(data, 'maintenance_enabled', false),
        /** Bakım mesajı */
        maintenanceMessage: getString(data, 'maintenance_message', ''),
    };
}
