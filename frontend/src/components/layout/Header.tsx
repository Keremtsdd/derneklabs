import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

interface MenuItem {
    label: string;
    href: string;
    external?: boolean;
}

interface MenuGroup {
    label: string;
    items: MenuItem[];
}

const kurumsalGroups: MenuGroup[] = [
    {
        label: 'Orhanpaşa Belediyesi',
        items: [
            { label: 'Hizmet Merkezleri', href: '/sayfa/hizmet-merkezleri' },
            { label: 'Belediye Başkan V.', href: '/baskan' },
            { label: 'Başkan Yardımcıları', href: '/sayfa/baskan-yardimcilari' },
            { label: 'Koordinatörler', href: '/sayfa/koordinatorler' },
            { label: 'Belediye Meclisi', href: '/sayfa/meclis' },
            { label: 'Müdürlükler', href: '/sayfa/mudurlukler' },
            { label: 'Belediye Encümeni', href: '/sayfa/encumen' },
            { label: 'Organizasyon Şeması', href: '/sayfa/organizasyon-semasi' },
            { label: 'İç Denetim', href: '/sayfa/denetim' },
            { label: 'KVKK Bilgilendirmesi', href: '/sayfa/kvkk' },
        ],
    },
    {
        label: 'Bayrampaşa',
        items: [
            { label: 'Bayrampaşa Hakkında', href: '/hakkinda' },
            { label: 'Kent Konseyi', href: '/sayfa/kent-konseyi' },
            { label: 'Stratejik Plan ve Raporlar', href: '/sayfa/stratejik' },
            { label: 'Kurumsal Kimlik', href: '/sayfa/kurumsal-kimlik' },
            { label: 'Banka Hesap No', href: '/sayfa/banka-hesap-numarasi' },
            { label: 'Kamu Hizmeti Standartı', href: '/sayfa/kamuhizmet-standarti' },
            { label: 'Etik İlkeler', href: '/sayfa/etik-ilkeler' },
            { label: 'İletişim Bilgileri', href: '/iletisim' },
        ],
    },
];

const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com/bpasabelediyesi', title: 'Twitter' },
    { icon: FaFacebookF, href: 'https://tr-tr.facebook.com/bpasabelediyesi', title: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/bayrampasabeltr/', title: 'Instagram' },
    { icon: FaYoutube, href: 'https://www.youtube.com/user/bayrampasabld', title: 'Youtube' },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [kurumsalOpen, setKurumsalOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <nav className="flex items-center justify-between h-16 lg:h-20">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img src="/images/logo-kare.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12 rounded" />
                        <span className="font-heading text-primary font-bold text-lg lg:text-xl">Orhanpaşa Bel.</span>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {/* Kurumsal Mega Menu */}
                        <li className="relative group">
                            <button
                                className="nav-link flex items-center gap-1 px-3 py-2 text-sm font-bold text-primary hover:text-accent transition-colors"
                                onClick={() => setKurumsalOpen(!kurumsalOpen)}
                                onMouseEnter={() => setKurumsalOpen(true)}
                            >
                                KURUMSAL <FaChevronDown className="text-[10px]" />
                            </button>
                            {kurumsalOpen && (
                                <div
                                    className="absolute left-0 top-full bg-white shadow-xl rounded-lg border p-6 min-w-[600px] z-50"
                                    onMouseLeave={() => setKurumsalOpen(false)}
                                >
                                    <div className="grid grid-cols-2 gap-6">
                                        {kurumsalGroups.map((group) => (
                                            <div key={group.label}>
                                                <h6 className="text-accent font-bold text-sm mb-3">{group.label}</h6>
                                                <ul className="space-y-1.5">
                                                    {group.items.map((item) => (
                                                        <li key={item.href}>
                                                            <Link
                                                                to={item.href}
                                                                className="text-sm text-primary hover:text-accent transition-colors font-medium"
                                                                onClick={() => setKurumsalOpen(false)}
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <Link to="/projeler" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                                PROJELER
                            </Link>
                        </li>
                        <li>
                            <Link to="/etkinlikler" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                                ETKİNLİK
                            </Link>
                        </li>
                        <li>
                            <Link to="/haberler" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                                HABERLER
                            </Link>
                        </li>
                        <li>
                            <Link to="/duyurular" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                                DUYURULAR
                            </Link>
                        </li>
                        <li>
                            <Link to="/iletisim" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                                İLETİŞİM
                            </Link>
                        </li>

                        {/* Social Icons */}
                        <li className="flex items-center gap-1 ml-3">
                            {socialLinks.map(({ icon: Icon, href, title }) => (
                                <a
                                    key={title}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={title}
                                    className="w-8 h-8 flex items-center justify-center rounded bg-gradient-to-br from-primary to-primary-light text-white text-xs hover:from-accent hover:to-accent-hover transition-all"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </li>
                    </ul>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden p-2 text-primary"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menüyü aç/kapat"
                    >
                        {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </nav>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="lg:hidden border-t pb-4 animate-in slide-in-from-top">
                        <ul className="space-y-1 pt-2">
                            {kurumsalGroups.flatMap((g) => g.items).map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className="block px-3 py-2 text-sm font-medium text-primary hover:bg-gray-50 rounded"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="border-t pt-2 mt-2">
                                <Link to="/projeler" className="block px-3 py-2 text-sm font-bold text-primary" onClick={() => setMobileOpen(false)}>PROJELER</Link>
                            </li>
                            <li>
                                <Link to="/etkinlikler" className="block px-3 py-2 text-sm font-bold text-primary" onClick={() => setMobileOpen(false)}>ETKİNLİK</Link>
                            </li>
                            <li>
                                <Link to="/haberler" className="block px-3 py-2 text-sm font-bold text-primary" onClick={() => setMobileOpen(false)}>HABERLER</Link>
                            </li>
                            <li>
                                <Link to="/iletisim" className="block px-3 py-2 text-sm font-bold text-primary" onClick={() => setMobileOpen(false)}>İLETİŞİM</Link>
                            </li>
                        </ul>
                        <div className="flex gap-2 px-3 pt-3 border-t mt-2">
                            {socialLinks.map(({ icon: Icon, href, title }) => (
                                <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-xs">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
