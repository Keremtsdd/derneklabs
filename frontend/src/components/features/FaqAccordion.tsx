import { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

const FALLBACK_FAQS = [
    {
        question: "Derneğinizin temel amacı ve vizyonu nedir?",
        answer: "Derneğimiz; toplumsal yardımlaşma, eğitim desteği, sürdürülebilir çevre ve insani yardım alanlarında projeler üreterek, daha adil ve gelişmiş bir toplum yapısına katkı sağlamayı amaçlamaktadır."
    },
    {
        question: "Yapılan bağışlar nasıl değerlendiriliyor ve denetleniyor?",
        answer: "Toplanan tüm bağışlar, yönetim kurulumuz ve bağımsız denetçiler tarafından düzenli olarak incelenir. Faaliyet raporlarımız ve mali tablolarımız şeffaflık ilkesi gereği web sitemiz üzerinden kamuoyu ile paylaşılır."
    },
    {
        question: "Nasıl gönüllü olabilirim ve saha çalışmalarına katılabilirim?",
        answer: "Gönüllülük formumuzu doldurarak ilgi alanlarınız ve yetkinlikleriniz doğrultusunda saha operasyonlarımızda, eğitim projelerimizde veya dijital çalışmalarımızda aktif rol alabilirsiniz."
    },
    {
        question: "Online bağış sistemi güvenli midir?",
        answer: "Evet, online bağış altyapımızda 256-bit SSL şifreleme protokolü ve 3D Secure güvenli ödeme standartları kullanılmaktadır. Kredi kartı bilgileriniz hiçbir şekilde sistemlerimizde saklanmaz."
    },
    {
        question: "Eğitim bursu başvuruları ne zaman ve nasıl yapılıyor?",
        answer: "Burs başvuruları her yılın Eylül ayında web sitemiz üzerinden online olarak alınmaktadır. Gerekli kriterleri sağlayan ve değerlendirme sürecini geçen öğrencilere eğitim yılı boyunca düzenli burs desteği sağlanır."
    },
    {
        question: "Kurumsal iş birlikleri ve sponsorluk süreçleri nasıl işliyor?",
        answer: "Şirketler ve kurumlar, sosyal sorumluluk projelerimize sponsor olabilir veya ortak projeler geliştirebilirler. İş birliği detayları için kurumsal iletişim ekibimizle doğrudan iletişime geçebilirsiniz."
    }
];

export default function FaqAccordion() {
    const { raw: settingsRaw, email } = useSiteSettings();
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default for elite feel

    const faqItems = (() => {
        if (!settingsRaw?.faq) return FALLBACK_FAQS;
        try {
            const parsed = typeof settingsRaw.faq === 'string'
                ? JSON.parse(settingsRaw.faq)
                : settingsRaw.faq;
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : FALLBACK_FAQS;
        } catch (err) {
            console.error('Failed to parse FAQ settings:', err);
            return FALLBACK_FAQS;
        }
    })();

    // Always slice to 6 items as requested
    const displayFaqs = faqItems.slice(0, 6);

    const toggleIndex = (idx: number) => {
        setOpenIndex(prev => prev === idx ? null : idx);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 pt-4">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20">
                    SIKÇA SORULAN SORULAR
                </span>
                <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-4 uppercase">
                    SORU VE CEVAPLAR
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Derneğimiz ve faaliyetlerimiz hakkında merak ettiğiniz temel konuları aşağıda bulabilirsiniz.
                </p>
            </div>

            {/* Centered Single-Column Accordion List */}
            <div className="space-y-4 max-w-3xl mx-auto">
                {displayFaqs.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div 
                            key={idx}
                            className={`rounded-2xl border transition-all duration-300 group ${
                                isOpen 
                                    ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-md dark:shadow-black/20 ring-4 ring-slate-100/50 dark:ring-slate-900/50' 
                                    : 'bg-white/70 dark:bg-slate-900/40 border-slate-100/80 dark:border-slate-800/60 hover:border-slate-200/70 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => toggleIndex(idx)}
                                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-dark dark:hover:text-emerald transition-colors cursor-pointer"
                            >
                                <span className="font-black leading-snug">{item.question}</span>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-350 shrink-0 ${
                                    isOpen 
                                        ? 'bg-emerald text-white rotate-180 shadow-md shadow-emerald/20' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald/10 group-hover:text-emerald-dark dark:group-hover:text-emerald'
                                }`}>
                                    <FaChevronDown size={10} />
                                </span>
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${
                                isOpen ? 'grid-rows-[1fr] opacity-100 p-5 sm:p-6 pt-0 border-t border-slate-50 dark:border-slate-800/60' : 'grid-rows-[0fr] opacity-0'
                            }`}>
                                <div className="overflow-hidden text-xs sm:text-[13px] text-slate-600 dark:text-slate-350 font-medium leading-relaxed pt-3">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Support CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm dark:shadow-black/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald">
                        <FaQuestionCircle className="text-lg" />
                    </div>
                    <div>
                        <h4 className="font-heading font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase">Başka bir sorunuz mu var?</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Aradığınız cevabı bulamadıysanız bize e-posta gönderebilir veya iletişim sayfamızı inceleyebilirsiniz.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <a 
                        href={`mailto:${email || 'info@derneksoft.com'}`}
                        className="flex-1 sm:flex-none text-center px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-emerald-dark dark:hover:text-emerald transition-colors border border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                        E-POSTA GÖNDER
                    </a>
                    <Link
                        to="/sayfa/s-s-s"
                        className="flex-1 sm:flex-none text-center px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white dark:text-slate-950 rounded-xl shadow-md transition-all"
                    >
                        TÜM SSS
                    </Link>
                </div>
            </div>

        </div>
    );
}
