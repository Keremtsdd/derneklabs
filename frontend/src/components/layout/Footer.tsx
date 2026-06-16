import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
    const { siteName, address, email, phone, raw: settingsRaw } = useSiteSettings();

    // Dynamically retrieve social links from DB settings
    const social = settingsRaw?.social as Record<string, string> | undefined;
    const socialList = [
        { icon: FaTwitter, href: social?.twitter || 'https://twitter.com', label: 'Twitter' },
        { icon: FaFacebookF, href: social?.facebook || 'https://facebook.com', label: 'Facebook' },
        { icon: FaInstagram, href: social?.instagram || 'https://instagram.com', label: 'Instagram' },
        { icon: FaYoutube, href: social?.youtube || 'https://youtube.com', label: 'Youtube' },
    ];

    // Dynamically retrieve quick links from Header's navbar menu
    const menuItems = (typeof settingsRaw?.navbar_menu === 'string'
        ? JSON.parse(settingsRaw.navbar_menu)
        : settingsRaw?.navbar_menu) || [];

    const safeMenu = Array.isArray(menuItems) ? menuItems : [];

    return (
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
            {/* Upper Footer: Branding & Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl bg-slate-800 p-2 rounded-2xl">🏛️</span>
                            <div>
                                <h4 className="font-heading font-extrabold text-white text-base tracking-tight">{siteName}</h4>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Sivil Toplum Portalı</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Güçlü toplumlar, paylaşılan değerler ve şeffaf yardımlaşma ağları ile inşa edilir. Portalımızdaki tüm sosyal dayanışma projelerini ve resmi bildirileri buradan takip edebilirsiniz.
                        </p>
                        <div className="flex gap-2 pt-2">
                            {socialList.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-emerald-600 hover:text-white transition-all duration-300 text-sm hover:-translate-y-0.5"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Navigation Links */}
                    <div className="space-y-4">
                        <h5 className="text-white font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-2">Hızlı Bağlantılar</h5>
                        <ul className="space-y-2 text-xs font-semibold">
                            {safeMenu.slice(0, 5).map((item) => (
                                <li key={item.title}>
                                    <Link to={item.link || item.url || '#'} className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                                        <span>•</span> {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Campaigns & Projects Links */}
                    <div className="space-y-4">
                        <h5 className="text-white font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-2">Faaliyetler</h5>
                        <ul className="space-y-2 text-xs font-semibold">
                            <li><Link to="/haberler" className="hover:text-emerald-500 transition-colors">Son Gelişmeler & Haberler</Link></li>
                            <li><Link to="/duyurular" className="hover:text-emerald-500 transition-colors">Resmi Duyurular</Link></li>
                            <li><Link to="/etkinlikler" className="hover:text-emerald-500 transition-colors">Etkinlik Takvimi</Link></li>
                            <li><Link to="/projeler" className="hover:text-emerald-500 transition-colors">Sosyal Projeler</Link></li>
                        </ul>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-4">
                        <h5 className="text-white font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-2">İletişim Bilgileri</h5>
                        <ul className="space-y-3 text-xs">
                            <li className="flex items-start gap-2.5">
                                <FaMapMarkerAlt className="text-emerald-500 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{address}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <FaPhoneAlt className="text-emerald-500 shrink-0" />
                                <a href={`tel:${phone ? phone.replace(/\s/g, '') : ''}`} className="hover:text-emerald-500 transition-colors font-bold text-sm">
                                    {phone || ''}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <FaEnvelope className="text-emerald-500 shrink-0" />
                                <a href={`mailto:${email}`} className="hover:text-emerald-500 transition-colors">
                                    {email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer: Copyright & STK CTA */}
            <div className="bg-slate-950/50 border-t border-slate-850/50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-slate-500 text-center md:text-left">
                        © {new Date().getFullYear()} {siteName}. Tüm Hakları Saklıdır. Sivil Toplum Dayanışma Portalı.
                    </p>
                    <div className="flex items-center gap-2 text-slate-500">
                        <span>Dayanışma ile güçlüyüz</span>
                        <FaHeart className="text-rose-500 animate-pulse text-xs" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
