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
    general_site_subtitle: '',
    footer_subtitle: '',
    footer_text: '',
    footer_copyright: '',
    contact_whatsapp: '',
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
        /** Genel: site adı */
        siteName: getString(data, 'general_site_name', ''),
        /** Genel: site açıklaması */
        siteDescription: getString(data, 'general_site_description', ''),
        /** Genel: logo URL */
        logo: getString(data, 'general_logo', ''),
        /** Genel: favicon URL */
        favicon: getString(data, 'general_favicon', ''),
        /** İletişim: adres */
        address: getString(data, 'contact_address', ''),
        /** İletişim: telefon */
        phone: getString(data, 'contact_phone', ''),
        /** İletişim: e-posta */
        email: getString(data, 'contact_email', ''),
        /** İletişim: harita embed HTML */
        mapEmbed: getString(data, 'contact_map_embed', ''),
        /** SEO: meta başlık */
        metaTitle: getString(data, 'seo_meta_title', ''),
        /** SEO: meta açıklama */
        metaDescription: getString(data, 'seo_meta_description', ''),
        /** SEO: meta anahtar kelimeler */
        metaKeywords: getString(data, 'seo_meta_keywords', ''),
        /** SEO: OG görsel */
        ogImage: getString(data, 'seo_og_image', ''),
        /** Bakım modu açık mı */
        maintenanceEnabled: getBool(data, 'maintenance_enabled', false),
        /** Bakım mesajı */
        maintenanceMessage: getString(data, 'maintenance_message', ''),
        /** Genel: site alt başlığı */
        siteSubtitle: getString(data, 'general_site_subtitle', 'Sivil Toplum Portalı'),
        /** Footer: alt başlık */
        footerSubtitle: getString(data, 'footer_subtitle', 'Geleceği Birlikte İnşa Ediyoruz'),
        /** Footer: açıklama */
        footerText: getString(data, 'footer_text', 'Şeffaflık, hesap verebilirlik ve toplumsal fayda ilkeleriyle hareket ediyor; dünyanın her köşesindeki ihtiyaç sahiplerine umut taşıyan sürdürülebilir kalkınma modelleri geliştiriyoruz.'),
        /** Footer: copyright */
        footerCopyright: getString(data, 'footer_copyright', ''),
        /** İletişim: WhatsApp destek numarası */
        contactWhatsapp: getString(data, 'contact_whatsapp', ''),
    };
}
