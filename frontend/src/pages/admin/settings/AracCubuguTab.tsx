import { useState, useEffect } from 'react';
import ImageUpload from '../../../components/admin/ImageUpload';
import { uploadFile } from '../../../services/adminApi';

interface AracCubuguTabProps {
    data: Record<string, unknown> | undefined;
    onSave: (payload: Record<string, unknown>) => void;
    saving: boolean;
}

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function AracCubuguTab({ data, onSave, saving }: AracCubuguTabProps) {
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [favicon, setFavicon] = useState('');
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (data) {
            setMetaTitle(String(data.seo_meta_title ?? ''));
            setMetaDescription(String(data.seo_meta_description ?? ''));
            setFavicon(String(data.general_favicon ?? ''));
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload: Record<string, unknown> = {
                seo_meta_title: metaTitle,
                seo_meta_description: metaDescription,
                general_favicon: favicon,
            };
            if (faviconFile) {
                const { url } = await uploadFile(faviconFile);
                payload.general_favicon = url;
            }
            onSave(payload);
        } catch (err) {
            console.error('Araç çubuğu ayarları kaydedilirken hata oluştu:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const isPending = saving || submitting;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className={labelClass}>Tarayıcı Sekme Başlığı (Title)</label>
                <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className={inputClass}
                    placeholder="Örn: Çukurca Sivil Toplum Destek Derneği"
                    required
                />
            </div>
            <div>
                <label className={labelClass}>Tarayıcı Sekme Açıklaması (Meta Description)</label>
                <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className={inputClass}
                    placeholder="Sekme üzerine gelindiğinde veya arama motorlarında görünecek kısa açıklama..."
                />
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <ImageUpload
                    label="Sekme Logosu (Favicon / .ico veya .png)"
                    currentImage={favicon}
                    onFileSelect={setFaviconFile}
                    onClear={() => setFavicon('')}
                />
            </div>
            <button type="submit" disabled={isPending} className={submitButtonClass}>
                {isPending ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
            </button>
        </form>
    );
}
