import { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { resolveImageUrl } from '../../services/api';

/**
 * Site ayarlarındaki SEO alanlarına göre document title ve meta etiketlerini günceller.
 */
export default function DocumentMeta() {
    const { metaTitle, metaDescription, ogImage, isSuccess } = useSiteSettings();

    useEffect(() => {
        if (!isSuccess) return;
        document.title = metaTitle || document.title;
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
    }, [isSuccess, metaDescription]);

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

    return null;
}
