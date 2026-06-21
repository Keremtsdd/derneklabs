import { useState, useEffect } from 'react';

interface FooterTabProps {
    data: Record<string, unknown> | undefined;
    onSave: (payload: Record<string, unknown>) => void;
    saving: boolean;
}

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function FooterTab({ data, onSave, saving }: FooterTabProps) {
    const [subtitle, setSubtitle] = useState('');
    const [text, setText] = useState('');
    const [copyright, setCopyright] = useState('');

    useEffect(() => {
        if (data) {
            setSubtitle(String(data.footer_subtitle ?? ''));
            setText(String(data.footer_text ?? ''));
            setCopyright(String(data.footer_copyright ?? ''));
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            footer_subtitle: subtitle,
            footer_text: text,
            footer_copyright: copyright,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className={labelClass}>Footer Alt Başlığı (Logo Altı)</label>
                <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className={inputClass}
                    placeholder="Örn: Geleceği Birlikte İnşa Ediyoruz"
                />
            </div>
            <div>
                <label className={labelClass}>Footer Açıklama Metni</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>Telif Hakkı (Copyright) Metni</label>
                <input
                    type="text"
                    value={copyright}
                    onChange={(e) => setCopyright(e.target.value)}
                    className={inputClass}
                    placeholder="Örn: © 2026 Dernek Adı. Tüm Hakları Saklıdır."
                />
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
            </button>
        </form>
    );
}
