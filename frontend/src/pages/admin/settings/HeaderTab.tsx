import { useState, useEffect } from 'react';

interface HeaderTabProps {
    data: Record<string, unknown> | undefined;
    onSave: (payload: Record<string, unknown>) => void;
    saving: boolean;
}

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function HeaderTab({ data, onSave, saving }: HeaderTabProps) {
    const [phone, setPhone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [facebook, setFacebook] = useState('');
    const [twitter, setTwitter] = useState('');
    const [instagram, setInstagram] = useState('');
    const [youtube, setYoutube] = useState('');

    useEffect(() => {
        if (data) {
            setPhone(String(data.contact_phone ?? ''));
            setWhatsapp(String(data.contact_whatsapp ?? ''));

            const social = (data.social || {}) as Record<string, unknown>;
            setFacebook(String(social.facebook ?? ''));
            setTwitter(String(social.twitter ?? ''));
            setInstagram(String(social.instagram ?? ''));
            setYoutube(String(social.youtube ?? ''));
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            contact_phone: phone,
            contact_whatsapp: whatsapp,
            social: {
                facebook,
                twitter,
                instagram,
                youtube
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Üst Bar Telefon Numarası</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                        placeholder="Örn: 0438 511 20 14"
                    />
                </div>
                <div>
                    <label className={labelClass}>WhatsApp Destek Numarası</label>
                    <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className={inputClass}
                        placeholder="Örn: +905051234567"
                    />
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Sosyal Medya Linkleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Facebook Adresi</label>
                        <input
                            type="url"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            className={inputClass}
                            placeholder="https://facebook.com/kullaniciadi"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Twitter / X Adresi</label>
                        <input
                            type="url"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className={inputClass}
                            placeholder="https://twitter.com/kullaniciadi"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Instagram Adresi</label>
                        <input
                            type="url"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            className={inputClass}
                            placeholder="https://instagram.com/kullaniciadi"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>YouTube Adresi</label>
                        <input
                            type="url"
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                            className={inputClass}
                            placeholder="https://youtube.com/kanaladi"
                        />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
            </button>
        </form>
    );
}
