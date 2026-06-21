import { useState, useEffect } from 'react';

interface ContactTabProps {
    data: Record<string, unknown> | undefined;
    onSave: (payload: Record<string, unknown>) => void;
    saving: boolean;
}

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function ContactTab({ data, onSave, saving }: ContactTabProps) {
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [mapEmbed, setMapEmbed] = useState('');

    useEffect(() => {
        if (data) {
            setAddress(String(data.contact_address ?? ''));
            setPhone(String(data.contact_phone ?? ''));
            setEmail(String(data.contact_email ?? ''));
            setMapEmbed(String(data.contact_map_embed ?? ''));
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            contact_address: address,
            contact_phone: phone,
            contact_email: email,
            contact_map_embed: mapEmbed,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className={labelClass}>Adres</label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className={inputClass}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Telefon</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                        required
                    />
                </div>
                <div>
                    <label className={labelClass}>E-posta</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        required
                    />
                </div>
            </div>
            <div>
                <label className={labelClass}>Harita Embed Kodu (HTML)</label>
                <textarea
                    value={mapEmbed}
                    onChange={(e) => setMapEmbed(e.target.value)}
                    rows={4}
                    className={`${inputClass} font-mono text-xs`}
                    placeholder="<iframe ...></iframe>"
                />
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
            </button>
        </form>
    );
}
