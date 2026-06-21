import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { createSupportTicket } from '../services/api';

const MapContainer = memo(({ embedHtml }: { embedHtml: string }) => {
    if (!embedHtml || embedHtml.trim().length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] bg-slate-50 dark:bg-slate-955/20 rounded-2xl text-slate-400 dark:text-slate-550 text-xs font-semibold">
                Harita konumu belirtilmemiş.
            </div>
        );
    }
    return (
        <div 
            className="[&>iframe]:w-full [&>iframe]:h-[300px] [&>iframe]:border-0 [&>iframe]:rounded-2xl dark:[&>iframe]:opacity-80" 
            dangerouslySetInnerHTML={{ __html: embedHtml }} 
        />
    );
});

export default function Contact() {
    const { address, email, phone, mapEmbed } = useSiteSettings();
    const [userContact, setUserContact] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userContact.trim() || !subject.trim() || !message.trim()) return;

        setStatus('loading');
        try {
            const success = await createSupportTicket({ userContact, subject, message });
            if (success) {
                setStatus('success');
                setUserContact('');
                setSubject('');
                setMessage('');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Failed to submit ticket:', err);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-background transition-colors duration-300">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">İletişim</span>
                </div>
                <Link to="/" className="text-xs font-bold text-slate-700 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-355 dark:hover:border-slate-750 rounded-xl px-4 py-2 transition-all bg-white dark:bg-slate-900 shadow-sm cursor-pointer">
                    Geri Dön
                </Link>
            </div>

            {/* Header Jumbotron */}
            <div className="bg-gradient-to-r from-[#0C1425] to-emerald-955 text-white rounded-3xl p-8 md:p-10 mb-8 border border-slate-800 shadow-xl shadow-slate-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-white/10 px-3 py-1 rounded-full border border-white/5">İLETİŞİM MASASI</span>
                    <h1 className="font-heading text-2xl md:text-4xl font-extrabold mt-3 tracking-tight">Bizimle İletişime Geçin</h1>
                    <p className="text-slate-300 text-xs md:text-sm mt-2 font-medium">Sorularınız, iş birliği önerileriniz veya destek talepleriniz için aşağıdaki kanalları kullanabilir ya da doğrudan mesaj gönderebilirsiniz.</p>
                </div>
            </div>

            {/* Contact Info & Forms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left Side: Contact Cards & Map */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/20 p-6 border border-slate-100 dark:border-slate-800/80 space-y-4">
                        <h3 className="font-heading text-slate-800 dark:text-slate-100 font-extrabold text-base mb-4 uppercase tracking-tight">İLETİŞİM KANALLARI</h3>
                        
                        <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-slate-955/20 rounded-2xl border border-slate-100/50 dark:border-slate-800/60">
                            <FaMapMarkerAlt className="text-emerald-600 dark:text-emerald mt-1 shrink-0 text-lg" />
                            <div>
                                <h4 className="font-heading font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-0.5">Adres</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">{address}</p>
                            </div>
                        </div>
 
                        <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-slate-955/20 rounded-2xl border border-slate-100/50 dark:border-slate-800/60">
                            <FaEnvelope className="text-emerald-600 dark:text-emerald mt-1 shrink-0 text-lg" />
                            <div>
                                <h4 className="font-heading font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-0.5">E-posta</h4>
                                <a href={`mailto:${email}`} className="text-xs text-primary dark:text-emerald font-bold hover:text-emerald-600 dark:hover:text-emerald-light transition-colors">
                                    {email}
                                </a>
                            </div>
                        </div>
 
                        <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-slate-955/20 rounded-2xl border border-slate-100/50 dark:border-slate-800/60">
                            <FaPhoneAlt className="text-emerald-600 dark:text-emerald mt-1 shrink-0 text-lg" />
                            <div>
                                <h4 className="font-heading font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-0.5">Telefon</h4>
                                <a href={`tel:${phone ? phone.replace(/\s/g, '') : ''}`} className="text-xs text-primary dark:text-emerald font-bold hover:text-emerald-600 dark:hover:text-emerald-light transition-colors">
                                    {phone || ''}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Harita */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/20 p-2 border border-slate-100 dark:border-slate-800/85 overflow-hidden min-h-[300px]">
                        <MapContainer embedHtml={mapEmbed} />
                    </div>
                </div>

                {/* Right Side: Message Submission Form */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/20 p-6 md:p-8 border border-slate-100 dark:border-slate-800/80">
                    <h3 className="font-heading text-slate-800 dark:text-slate-100 font-extrabold text-base mb-2 uppercase tracking-tight">BİZE YAZIN</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-450 mb-6 font-semibold">Görüş, öneri veya destek taleplerinizi aşağıdaki form aracılığıyla hızlıca iletebilirsiniz.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">E-POSTA ADRESİNİZ VEYA TELEFON NUMARANIZ</label>
                            <input
                                type="text"
                                value={userContact}
                                onChange={(e) => setUserContact(e.target.value)}
                                placeholder="Örn: ad.soyad@email.com veya 0555..."
                                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50/50 dark:bg-slate-955/20 hover:bg-slate-50 dark:hover:bg-slate-955/40 focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500 dark:focus:border-emerald focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-slate-800 dark:text-slate-100 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">KONU</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Örn: Gönüllülük çalışmaları, Burs başvurusu vb."
                                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50/50 dark:bg-slate-955/20 hover:bg-slate-50 dark:hover:bg-slate-955/40 focus:bg-white dark:focus:bg-slate-955 focus:border-emerald-500 dark:focus:border-emerald focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-slate-800 dark:text-slate-100 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">MESAJINIZ</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                placeholder="Mesajınızı detaylıca buraya yazın..."
                                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50/50 dark:bg-slate-955/20 hover:bg-slate-50 dark:hover:bg-slate-955/40 focus:bg-white dark:focus:bg-slate-955 focus:border-emerald-500 dark:focus:border-emerald focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-slate-800 dark:text-slate-100 text-sm"
                                required
                            />
                        </div>

                        {status === 'success' && (
                            <div className="flex items-center gap-2.5 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald rounded-2xl border border-emerald-100 dark:border-emerald-900/35 text-xs font-semibold">
                                <FaCheckCircle className="shrink-0 text-emerald-600 text-base" />
                                <span>Mesajınız başarıyla iletildi. En kısa sürede dönüş sağlanacaktır.</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex items-center gap-2.5 p-4 bg-rose-50 dark:bg-rose-955/20 text-rose-850 dark:text-rose-455 rounded-2xl border border-rose-100 dark:border-rose-900/35 text-xs font-semibold">
                                <FaExclamationCircle className="shrink-0 text-rose-600 text-base" />
                                <span>Mesaj gönderilirken bir sorun oluştu. Lütfen bilgileri kontrol edip tekrar deneyin.</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {status === 'loading' ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Gönderiliyor...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane className="text-xs" />
                                    MESAJ GÖNDER
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
