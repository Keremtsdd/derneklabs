import { useState, useEffect } from 'react';
import ImageUpload from '../../../components/admin/ImageUpload';
import { uploadFile } from '../../../services/adminApi';

interface GeneralTabProps {
    data: Record<string, unknown> | undefined;
    onSave: (payload: Record<string, unknown>) => void;
    saving: boolean;
}

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function GeneralTab({ data, onSave, saving }: GeneralTabProps) {
    const [siteName, setSiteName] = useState('');
    const [siteSubtitle, setSiteSubtitle] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [logo, setLogo] = useState('');
    const [favicon, setFavicon] = useState('');

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (data) {
            setSiteName(String(data.general_site_name ?? ''));
            setSiteSubtitle(String(data.general_site_subtitle ?? ''));
            setSiteDescription(String(data.general_site_description ?? ''));
            setLogo(String(data.general_logo ?? ''));
            setFavicon(String(data.general_favicon ?? ''));
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload: Record<string, unknown> = {
                general_site_name: siteName,
                general_site_subtitle: siteSubtitle,
                general_site_description: siteDescription,
                general_logo: logo,
                general_favicon: favicon,
            };
            if (logoFile) {
                const { url } = await uploadFile(logoFile);
                payload.general_logo = url;
            }
            if (faviconFile) {
                const { url } = await uploadFile(faviconFile);
                payload.general_favicon = url;
            }
            onSave(payload);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const isPending = saving || submitting;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Site Adı</label>
                    <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className={inputClass}
                        required
                    />
                </div>
                <div>
                    <label className={labelClass}>Site Alt Başlığı (Logo Yanı)</label>
                    <input
                        type="text"
                        value={siteSubtitle}
                        onChange={(e) => setSiteSubtitle(e.target.value)}
                        className={inputClass}
                        placeholder="Örn: Sivil Toplum Portalı"
                    />
                </div>
            </div>
            <div>
                <label className={labelClass}>Site Açıklaması</label>
                <textarea
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={3}
                    className={inputClass}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <ImageUpload
                        label="Site Logosu"
                        currentImage={logo}
                        onFileSelect={setLogoFile}
                        onClear={() => setLogo('')}
                    />
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <ImageUpload
                        label="Favicon"
                        currentImage={favicon}
                        onFileSelect={setFaviconFile}
                        onClear={() => setFavicon('')}
                    />
                </div>
            </div>
            <button type="submit" disabled={isPending} className={submitButtonClass}>
                {isPending ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydediliyor...
                    </>
                ) : '💾 Ayarları Kaydet'}
            </button>
        </form>
    );
}
