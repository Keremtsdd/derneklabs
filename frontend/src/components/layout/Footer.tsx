import { 
    FaPhoneAlt, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaWhatsapp, 
    FaTwitter, 
    FaFacebookF, 
    FaInstagram, 
    FaYoutube, 
    FaChevronUp 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
    const { siteName, logo, address, email, phone, raw: settingsRaw } = useSiteSettings();
    const social = settingsRaw?.social as Record<string, string> | undefined;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-900/80 pt-16 pb-8 transition-colors duration-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-200/60 dark:border-slate-800/60">
                    
                    {/* Column 1 (4 cols): Brand Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={siteName}
                                    className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/logo-kare.png';
                                    }}
                                />
                            ) : (
                                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
                            )}
                            <div>
                                <span className="font-heading font-extrabold text-slate-800 dark:text-slate-100 text-lg tracking-tight block leading-tight">
                                    {siteName || 'SİVİL TOPLUM PORTALI'}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald block -mt-0.5">
                                    Geleceği Birlikte İnşa Ediyoruz
                                </span>
                            </div>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Şeffaflık, hesap verebilirlik ve toplumsal fayda ilkeleriyle hareket ediyor; dünyanın her köşesindeki ihtiyaç sahiplerine umut taşıyan sürdürülebilir kalkınma modelleri geliştiriyoruz.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {social?.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-900 hover:bg-emerald hover:text-white dark:hover:bg-emerald dark:hover:text-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:scale-105 transition-all duration-300 shadow-sm" title="Twitter">
                                    <FaTwitter size={13} />
                                </a>
                            )}
                            {social?.facebook && (
                                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-900 hover:bg-emerald hover:text-white dark:hover:bg-emerald dark:hover:text-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:scale-105 transition-all duration-300 shadow-sm" title="Facebook">
                                    <FaFacebookF size={13} />
                                </a>
                            )}
                            {social?.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-900 hover:bg-emerald hover:text-white dark:hover:bg-emerald dark:hover:text-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:scale-105 transition-all duration-300 shadow-sm" title="Instagram">
                                    <FaInstagram size={13} />
                                </a>
                            )}
                            {social?.youtube && (
                                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-900 hover:bg-emerald hover:text-white dark:hover:bg-emerald dark:hover:text-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:scale-105 transition-all duration-300 shadow-sm" title="YouTube">
                                    <FaYoutube size={13} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2 (2 cols): Kurumsal */}
                    <div className="lg:col-span-2 space-y-4 md:pl-4">
                        <h4 className="text-slate-800 dark:text-slate-100 font-heading font-extrabold text-xs uppercase tracking-wider">
                            Kurumsal
                        </h4>
                        <ul className="space-y-3 text-[11px] font-bold">
                            <li>
                                <Link to="/hakkinda" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link to="/baskan" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Başkanın Mesajı
                                </Link>
                            </li>
                            <li>
                                <Link to="/sayfa/yonetim-kurulu" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Yönetim Kurulu
                                </Link>
                            </li>
                            <li>
                                <Link to="/sayfa/dernek-tuzugu" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Dernek Tüzüğü
                                </Link>
                            </li>
                            <li>
                                <Link to="/sayfa/gonulluluk" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Gönüllü Katılımı
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 (2 cols): Çalışmalarımız */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-slate-800 dark:text-slate-100 font-heading font-extrabold text-xs uppercase tracking-wider">
                            Faaliyetler
                        </h4>
                        <ul className="space-y-3 text-[11px] font-bold">
                            <li>
                                <Link to="/projeler" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Sosyal Projeler
                                </Link>
                            </li>
                            <li>
                                <Link to="/etkinlikler" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Etkinlik Takvimi
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Sahadan Kareler
                                </Link>
                            </li>
                            <li>
                                <Link to="/duyurular" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Belge ve Raporlar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 (2 cols): Bilgi & Destek */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-slate-800 dark:text-slate-100 font-heading font-extrabold text-xs uppercase tracking-wider">
                            Bilgi & Destek
                        </h4>
                        <ul className="space-y-3 text-[11px] font-bold">
                            <li>
                                <Link to="/haberler" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Faaliyet Haberleri
                                </Link>
                            </li>
                            <li>
                                <Link to="/duyurular" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Duyurular & Resmi Bildiriler
                                </Link>
                            </li>
                            <li>
                                <Link to="/sayfa/s-s-s" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Sıkça Sorulan Sorular
                                </Link>
                            </li>
                            <li>
                                <Link to="/destek" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Online Bağış Yap
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/giris" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald hover:translate-x-1 inline-block transition-all duration-200">
                                    Üye Giriş Portalı
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5 (2 cols): İletişim */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-slate-800 dark:text-slate-100 font-heading font-extrabold text-xs uppercase tracking-wider">
                            İletişim
                        </h4>
                        <ul className="space-y-3 text-[11px] font-bold">
                            <li className="flex items-start gap-2">
                                <FaMapMarkerAlt className="text-emerald-600 dark:text-emerald shrink-0 mt-0.5 text-xs" />
                                <span className="leading-relaxed font-semibold text-slate-600 dark:text-slate-400">
                                    {address || 'İstanbul / Türkiye'}
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaPhoneAlt className="text-emerald-600 dark:text-emerald shrink-0 text-xs" />
                                <a href={`tel:${phone ? phone.replace(/\s/g, '') : ''}`} className="text-slate-600 hover:text-emerald-650 dark:text-slate-400 dark:hover:text-emerald transition-colors font-semibold">
                                    {phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaEnvelope className="text-emerald-600 dark:text-emerald shrink-0 text-xs" />
                                <a href={`mailto:${email}`} className="text-slate-600 hover:text-emerald-655 dark:text-slate-400 dark:hover:text-emerald transition-colors font-semibold truncate block max-w-full">
                                    {email}
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaWhatsapp className="text-emerald-600 dark:text-emerald shrink-0 text-xs" />
                                <a 
                                    href={`https://wa.me/${phone ? phone.replace(/\s/g, '').replace('+', '') : ''}?text=Merhaba`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-slate-600 hover:text-emerald-655 dark:text-slate-400 dark:hover:text-emerald transition-colors font-semibold"
                                >
                                    WhatsApp Destek
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom copyright and legal strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 dark:text-slate-500 font-bold">
                    <p className="text-center md:text-left">
                        © {new Date().getFullYear()} {siteName || 'Mesleki & Dayanışma'}. Tüm Hakları Saklıdır.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4.5">
                        <Link to="/sayfa/gizlilik-politikasi" className="text-slate-500 hover:text-slate-805 dark:text-slate-500 dark:hover:text-slate-200 transition-colors">
                            Gizlilik Politikası
                        </Link>
                        <span className="text-slate-300 dark:text-slate-800">|</span>
                        <Link to="/sayfa/kullanim-sartlari" className="text-slate-500 hover:text-slate-805 dark:text-slate-500 dark:hover:text-slate-200 transition-colors">
                            Kullanım Şartları
                        </Link>
                        <span className="text-slate-300 dark:text-slate-800">|</span>
                        <Link to="/sayfa/kvkk-aydinlatma-metni" className="text-slate-500 hover:text-slate-805 dark:text-slate-500 dark:hover:text-slate-200 transition-colors">
                            KVKK Aydınlatma Metni
                        </Link>
                    </div>
                    
                    {/* Back to top button */}
                    <button 
                        onClick={scrollToTop}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-emerald hover:text-white dark:hover:bg-emerald dark:hover:text-slate-950 transition-all hover:scale-105 cursor-pointer shadow-sm"
                        aria-label="Yukarı Git"
                        title="Yukarı Git"
                    >
                        <FaChevronUp size={10} />
                    </button>
                </div>
            </div>

            {/* Sticky Green WhatsApp Floating Button */}
            <a
                href={`https://wa.me/${phone ? phone.replace(/\s/g, '').replace('+', '') : ''}?text=Merhaba`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
                aria-label="WhatsApp Destek Hattı"
            >
                <FaWhatsapp className="text-2xl animate-pulse" />
                <span className="absolute right-full mr-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-md">
                    Yardım Hattı
                </span>
            </a>
        </footer>
    );
}
