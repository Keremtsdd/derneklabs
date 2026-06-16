import { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { resolveImageUrl } from '../../services/api';

/**
 * Site ayarlarındaki SEO alanlarına göre document title ve meta etiketlerini günceller.
 */
export default function DocumentMeta() {
    const { metaTitle, metaDescription, metaKeywords, ogImage, favicon, isSuccess } = useSiteSettings();

    useEffect(() => {
        if (!isSuccess) return;
        document.title = metaTitle || document.title;

        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', metaTitle || '');
    }, [isSuccess, metaTitle]);

    useEffect(() => {
        if (!isSuccess) return;
        const desc = metaDescription || '';
        
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', desc);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
            ogDesc = document.createElement('meta');
            ogDesc.setAttribute('property', 'og:description');
            document.head.appendChild(ogDesc);
        }
        ogDesc.setAttribute('content', desc);
    }, [isSuccess, metaDescription]);

    useEffect(() => {
        if (!isSuccess) return;
        const keywords = metaKeywords || '';
        
        let meta = document.querySelector('meta[name="keywords"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'keywords');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', keywords);
    }, [isSuccess, metaKeywords]);

    useEffect(() => {
        if (!isSuccess || !ogImage || ogImage.trim() === '') return;
        const url = resolveImageUrl(ogImage);
        let meta = document.querySelector('meta[property="og:image"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', 'og:image');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', url);
    }, [isSuccess, ogImage]);

    useEffect(() => {
        if (!isSuccess || !favicon || favicon.trim() === '') return;
        const url = resolveImageUrl(favicon);
        
        // Update 32x32 link
        const link32 = document.querySelector('link[sizes="32x32"]');
        if (link32) link32.setAttribute('href', url);

        // Update 16x16 link
        const link16 = document.querySelector('link[sizes="16x16"]');
        if (link16) link16.setAttribute('href', url);

        // Update apple-touch-icon
        const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (appleIcon) appleIcon.setAttribute('href', url);

        // Update general shortcut/icon
        const shortcutIcon = document.querySelector('link[rel="icon"]');
        if (shortcutIcon) shortcutIcon.setAttribute('href', url);
    }, [isSuccess, favicon]);

    return null;
}
