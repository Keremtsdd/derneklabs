import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaBars, FaTimes, FaChevronDown, FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { resolveImageUrl, fetchKurumsalMenu, type KurumsalMegamenuData } from '../../services/api';

// Types
interface MenuItem {
    id: string;
    title: string;
    url: string;
    children: MenuItem[];
    collapsed?: boolean;
}

const STORAGE_KEY = 'navbar_menu_data_v2';

const DEFAULT_MENU_ITEMS: MenuItem[] = [
    {
        id: 'kurumsal',
        title: 'KURUMSAL',
        url: '#',
        children: [
            {
                id: 'orhanpasa-bel',
                title: 'Orhanpaşa Belediyesi',
                url: '#',
                children: [
                    { id: 'baskan', title: 'Belediye Başkanı', url: '/baskan', children: [] },
                    { id: 'yonetim', title: 'Yönetim Şeması', url: '/sayfa/yonetim', children: [] },
                    { id: 'mudurlukler', title: 'Müdürlükler', url: '/sayfa/mudurlukler', children: [] },
                ],
            },
        ],
    },
    { id: 'projeler', title: 'PROJELER', url: '/projeler', children: [] },
    { id: 'etkinlikler', title: 'ETKİNLİK', url: '/etkinlikler', children: [] },
    {
        id: 'hizli-islemler',
        title: 'HIZLI İŞLEMLER',
        url: '#',
        children: [
            { id: 'borc-sorgulama', title: 'Borç Sorgulama', url: '/borc-sorgulama', children: [] },
            { id: 'nobetci-eczane', title: 'Nöbetçi Eczaneler', url: '/nobetci-eczaneler', children: [] },
            { id: 'imar-durumu', title: 'İmar Durumu', url: '/imar-durumu', children: [] },
        ],
    },
    {
        id: 'basvuru-islemleri',
        title: 'BAŞVURU İŞLEMLERİ',
        url: '#',
        children: [
            { id: 'beyaz-masa', title: 'Beyaz Masa Başvurusu', url: '/beyaz-masa', children: [] },
            { id: 'is-basvurusu', title: 'İş Başvurusu', url: '/is-basvurusu', children: [] },
            { id: 'evrak-takip', title: 'Evrak Takip', url: '/evrak-takip', children: [] },
        ],
    },
    { id: 'e-belediye', title: 'E-BELEDİYE', url: '/e-belediye', children: [] },
    { id: 'yayinlar', title: 'YAYINLAR', url: '/yayinlar', children: [] },
];

const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com/bpasabelediyesi', title: 'Twitter' },
    { icon: FaFacebookF, href: 'https://tr-tr.facebook.com/bpasabelediyesi', title: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/bayrampasabeltr/', title: 'Instagram' },
    { icon: FaYoutube, href: 'https://www.youtube.com/user/bayrampasabld', title: 'Youtube' },
];

const DEFAULT_KURUMSAL_MEGAMENU: KurumsalMegamenuData = {
    column1: {
        title: 'Orhanpaşa Belediyesi',
        imageUrl: '/images/menu_baskan.png',
        imageCaption: 'Orhanpaşa Belediyesi Başkan V.',
        socialLinks: [
            { label: 'Twitter', url: 'https://x.com/Ibrahimakn', icon: 'twitter' },
            { label: 'Instagram', url: 'https://www.instagram.com/ibrahimakinbb/', icon: 'instagram' },
        ],
        menuItems: [
            { title: 'Hizmet Merkezleri', url: '/sayfa/hizmet-merkezleri' },
            { title: 'Belediye Başkan V.', url: '/baskan' },
            { title: 'Başkan Yardımcıları', url: '/sayfa/baskan-yardimcilari' },
            { title: 'Koordinatörler', url: '/sayfa/koordinatorler' },
            { title: 'Belediye Meclisi', url: '/sayfa/meclis' },
            { title: 'Müdürlükler', url: '/sayfa/mudurlukler' },
            { title: 'Belediye Encümeni', url: '/sayfa/encumen' },
            { title: 'Organizasyon Şeması', url: '/sayfa/yonetim' },
            { title: 'İç Denetim', url: '/sayfa/denetim' },
            { title: 'KVKK Bilgilendirmesi', url: '/sayfa/kvkk' },
        ],
    },
    column2: {
        title: 'Orhanpaşa',
        imageUrl: '/images/menu_belediye.jpg',
        menuItems: [
            { title: 'Orhanpaşa Hakkında', url: '/hakkinda' },
            { title: 'Kent Konseyi', url: '/sayfa/kent-konseyi' },
            { title: 'Stratejik Plan ve Raporlar', url: '/sayfa/stratejik' },
            { title: 'Kurumsal Kimlik', url: '/sayfa/kurumsal-kimlik' },
            { title: 'Banka Hesap No', url: '/sayfa/banka-hesap-numarasi' },
            { title: 'Kamu Hizmeti Standartı', url: '/sayfa/kamuhizmet-standarti' },
            { title: 'Etik İlkeler', url: '/sayfa/etik-ilkeler' },
            { title: 'İletişim Bilgileri', url: '/iletisim' },
        ],
    },
    column3: {
        title: 'İletişim',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6019.129994581453!2d28.912395!3d41.034772!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2f2f759065a8afbc!2sT.C%20Bayrampa%C5%9Fa%20Belediyesi!5e0!3m2!1str!2str!4v1625232148007!5m2!1str!2str',
        contact: {
            address: 'Yenidoğan Mahallesi Abdi İpekçi Caddesi No:2 Bayrampaşa/İstanbul/Türkiye',
            email: 'bayrampasa@bayrampasa.bel.tr',
            phone: '+90 212 467 19 00 / 444 1 990',
            fax: '+90 212 467 19 89',
            kep: 'bayrampasabelediyesi@hs01.kep.tr',
            uets: '35419-69147-33683',
        },
    },
};

const socialIconMap = { twitter: FaTwitter, instagram: FaInstagram, facebook: FaFacebookF } as const;

export default function Header() {
    const { siteName, logo } = useSiteSettings();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const dropdownRef = useRef<HTMLUListElement>(null);

    const { data: kurumsalData } = useQuery({
        queryKey: ['kurumsal-menu'],
        queryFn: fetchKurumsalMenu,
        staleTime: 5 * 60 * 1000,
    });
    const megamenuData = kurumsalData ?? DEFAULT_KURUMSAL_MEGAMENU;

    // Initialize menu from localStorage or default
    useEffect(() => {
        const loadMenu = () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    setMenuItems(JSON.parse(saved));
                } catch {
                    setMenuItems(DEFAULT_MENU_ITEMS);
                }
            } else {
                setMenuItems(DEFAULT_MENU_ITEMS);
                // Persist defaults to local storage if empty to sync with Admin Panel
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
            }
        };

        loadMenu();

        // Optional: Listen for storage events to update if changed in another tab
        window.addEventListener('storage', loadMenu);
        return () => window.removeEventListener('storage', loadMenu);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdowns({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (id: string, isOpen: boolean) => {
        setOpenDropdowns((prev) => ({ ...prev, [id]: isOpen }));
    };

    // Recursive Menu Component for Desktop
    const DesktopMenuItem = ({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openDropdowns[item.id];

        const handleMouseEnter = () => {
            if (hasChildren) toggleDropdown(item.id, true);
        };

        const handleMouseLeave = () => {
            if (hasChildren) toggleDropdown(item.id, false);
        };

        return (
            <li
                className={`relative group ${depth === 0 ? 'h-full flex items-center' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link
                    to={item.url}
                    className={`
                        flex items-center gap-1 transition-colors
                        ${depth === 0
                            ? 'px-3 py-2 text-sm font-bold text-primary hover:text-accent uppercase'
                            : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent w-full'
                        }
                    `}
                    onClick={(e) => {
                        if (hasChildren && item.url === '#') e.preventDefault();
                    }}
                >
                    {item.title}
                    {hasChildren && (
                        <FaChevronDown className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''} ${depth > 0 ? '-rotate-90 ml-auto' : ''}`} />
                    )}
                </Link>

                {/* Dropdown Menu */}
                {hasChildren && isOpen && (
                    <div className={`
                        absolute z-50 bg-white shadow-xl rounded-lg border border-gray-100 min-w-[220px] py-1 animate-in fade-in zoom-in-95 duration-100
                        ${depth === 0 ? 'top-full left-0' : 'top-0 left-full ml-1'}
                    `}>
                        <ul className="py-1">
                            {item.children.map((child) => (
                                <DesktopMenuItem key={child.id} item={child} depth={depth + 1} />
                            ))}
                        </ul>
                    </div>
                )}
            </li>
        );
    };

    // Recursive Menu Component for Mobile
    const MobileMenuItem = ({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {
        const isKurumsal = item.id === 'kurumsal';
        const hasChildren = !isKurumsal && item.children && item.children.length > 0;
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <li>
                <div className="flex items-center justify-between">
                    {isKurumsal ? (
                        <button
                            type="button"
                            className="block flex-1 py-2 text-left text-sm font-bold uppercase px-3 text-primary hover:bg-gray-50 rounded"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {item.title}
                        </button>
                    ) : (
                        <Link
                            to={item.url}
                            className={`
                                block flex-1 py-2 text-primary hover:bg-gray-50 rounded
                                ${depth === 0 ? 'text-sm font-bold uppercase px-3' : 'text-sm font-medium pl-6 pr-3'}
                                ${depth > 1 ? 'pl-9' : ''}
                            `}
                            onClick={() => {
                                if (!hasChildren) setMobileOpen(false);
                            }}
                        >
                            {item.title}
                        </Link>
                    )}
                    {(hasChildren || isKurumsal) && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-400 hover:text-accent"
                        >
                            <FaChevronDown className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
                {isKurumsal && isExpanded && (
                    <div className="border-l-2 border-gray-100 ml-4 pl-3 my-2 space-y-4">
                        <div>
                            <p className="text-xs font-bold text-red-600 uppercase mt-2">{megamenuData.column1.title}</p>
                            <ul className="space-y-1">
                                {(megamenuData.column1.menuItems || []).map((m, i) => (
                                    <li key={i}>
                                        {m.url.startsWith('http') ? <a href={m.url} className="block py-1 text-sm text-primary">{m.title}</a> : <Link to={m.url} className="block py-1 text-sm text-primary" onClick={() => setMobileOpen(false)}>{m.title}</Link>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-600 uppercase mt-2">{megamenuData.column2.title}</p>
                            <ul className="space-y-1">
                                {(megamenuData.column2.menuItems || []).map((m, i) => (
                                    <li key={i}>
                                        {m.url.startsWith('http') ? <a href={m.url} className="block py-1 text-sm text-primary">{m.title}</a> : <Link to={m.url} className="block py-1 text-sm text-primary" onClick={() => setMobileOpen(false)}>{m.title}</Link>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-600 uppercase mt-2">{megamenuData.column3.title}</p>
                            {megamenuData.column3.contact?.address && <p className="text-sm text-gray-600">{megamenuData.column3.contact.address}</p>}
                            {megamenuData.column3.contact?.phone && <p className="text-sm"><a href={`tel:${megamenuData.column3.contact.phone.replace(/\s/g, '')}`} className="text-primary">{megamenuData.column3.contact.phone}</a></p>}
                            <Link to="/iletisim" className="block py-1 text-sm text-primary font-medium" onClick={() => setMobileOpen(false)}>İletişim sayfası</Link>
                        </div>
                    </div>
                )}
                {hasChildren && isExpanded && (
                    <ul className="border-l-2 border-gray-100 ml-4 space-y-1 my-1">
                        {item.children!.map((child) => (
                            <MobileMenuItem key={child.id} item={child} depth={depth + 1} />
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <nav className="flex items-center justify-between h-16 lg:h-20">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img src={resolveImageUrl(logo)} alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12 rounded object-contain" />
                        <span className="font-heading text-primary font-bold text-lg lg:text-xl">{siteName}</span>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="hidden lg:flex items-center gap-1 h-full" ref={dropdownRef}>
                        {menuItems.map((item) => {
                            if (item.id === 'kurumsal') {
                                const isOpen = openDropdowns['kurumsal'];
                                return (
                                    <li
                                        key="kurumsal"
                                        className="relative h-full flex items-center group"
                                        onMouseEnter={() => toggleDropdown('kurumsal', true)}
                                        onMouseLeave={() => toggleDropdown('kurumsal', false)}
                                    >
                                        <Link
                                            to="#"
                                            className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-primary hover:text-accent uppercase transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleDropdown('kurumsal', !isOpen);
                                            }}
                                        >
                                            KURUMSAL
                                            <FaChevronDown className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </Link>
                                        {isOpen && (
                                            <div className="fixed left-0 right-0 top-20 z-50 w-full shadow-xl border-t border-gray-200 bg-white">
                                                <div className="w-full max-w-7xl mx-auto px-6 py-5">
                                                    <div className="grid grid-cols-3 gap-8" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                                        {/* Sütun 1 — Belediye */}
                                                        <div className="min-w-0 flex flex-col border-r border-gray-200 pr-6">
                                                            <h6 className="text-red-600 font-bold uppercase text-sm tracking-wide mb-3 shrink-0">{megamenuData.column1.title}</h6>
                                                            {megamenuData.column1.imageUrl && (
                                                                <figure className="mb-2 shrink-0">
                                                                    <img src={resolveImageUrl(megamenuData.column1.imageUrl)} alt="" className="w-full rounded border shadow-sm object-cover max-h-28" />
                                                                    {megamenuData.column1.imageCaption && (
                                                                        <figcaption className="text-red-600 text-xs font-bold mt-1">{megamenuData.column1.imageCaption}</figcaption>
                                                                    )}
                                                                </figure>
                                                            )}
                                                            {megamenuData.column1.socialLinks && megamenuData.column1.socialLinks.length > 0 && (
                                                                <div className="flex gap-1 mb-3 shrink-0">
                                                                    {megamenuData.column1.socialLinks.map((s) => {
                                                                        const Icon = socialIconMap[s.icon as keyof typeof socialIconMap] || FaTwitter;
                                                                        return (
                                                                            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-8 h-8 flex items-center justify-center rounded bg-gradient-to-br from-primary to-primary/80 text-white text-xs hover:from-accent hover:to-accent/80 shrink-0">
                                                                                <Icon />
                                                                            </a>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                            <ul className="space-y-0 shrink-0">
                                                                {(megamenuData.column1.menuItems || []).map((m, i) => (
                                                                    <li key={i} className="border-b border-gray-100 last:border-b-0">
                                                                        {m.url.startsWith('http') ? (
                                                                            <a href={m.url} className="block py-2 text-sm font-medium text-primary hover:text-accent">{m.title}</a>
                                                                        ) : (
                                                                            <Link to={m.url} className="block py-2 text-sm font-medium text-primary hover:text-accent" onClick={() => toggleDropdown('kurumsal', false)}>{m.title}</Link>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        {/* Sütun 2 — İlçe */}
                                                        <div className="min-w-0 flex flex-col border-r border-gray-200 pr-6">
                                                            <h6 className="text-red-600 font-bold uppercase text-sm tracking-wide mb-3 shrink-0">{megamenuData.column2.title}</h6>
                                                            {megamenuData.column2.imageUrl && (
                                                                <figure className="mb-2 shrink-0">
                                                                    <img src={resolveImageUrl(megamenuData.column2.imageUrl)} alt="" className="w-full rounded border object-cover max-h-24" />
                                                                </figure>
                                                            )}
                                                            <ul className="space-y-0 shrink-0">
                                                                {(megamenuData.column2.menuItems || []).map((m, i) => (
                                                                    <li key={i} className="border-b border-gray-100 last:border-b-0">
                                                                        {m.url.startsWith('http') ? (
                                                                            <a href={m.url} className="block py-2 text-sm font-medium text-primary hover:text-accent">{m.title}</a>
                                                                        ) : (
                                                                            <Link to={m.url} className="block py-2 text-sm font-medium text-primary hover:text-accent" onClick={() => toggleDropdown('kurumsal', false)}>{m.title}</Link>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        {/* Sütun 3 — İletişim */}
                                                        <div className="min-w-0 flex flex-col overflow-hidden">
                                                            <h6 className="text-red-600 font-bold uppercase text-sm tracking-wide mb-3 shrink-0">{megamenuData.column3.title}</h6>
                                                            {megamenuData.column3.mapEmbedUrl && (
                                                                <div className="relative w-full overflow-hidden rounded border mb-3 shrink-0" style={{ paddingBottom: '52%' }}>
                                                                    <iframe src={megamenuData.column3.mapEmbedUrl} title="Harita" className="absolute inset-0 w-full h-full border-0" />
                                                                </div>
                                                            )}
                                                            {megamenuData.column3.contact && (
                                                                <div className="text-sm text-gray-700 space-y-1.5 shrink-0 break-words">
                                                                    {megamenuData.column3.contact.address && <p className="leading-snug"><strong>Adres:</strong> {megamenuData.column3.contact.address}</p>}
                                                                    {megamenuData.column3.contact.email && <p><strong>E-posta:</strong> <a href={`mailto:${megamenuData.column3.contact.email}`} className="text-primary hover:text-accent underline break-all">{megamenuData.column3.contact.email}</a></p>}
                                                                    {megamenuData.column3.contact.phone && <p><strong>Telefon:</strong> <a href={`tel:${megamenuData.column3.contact.phone.replace(/\s/g, '')}`} className="text-primary hover:text-accent underline">{megamenuData.column3.contact.phone}</a></p>}
                                                                    {megamenuData.column3.contact.fax && <p><strong>Faks:</strong> {megamenuData.column3.contact.fax}</p>}
                                                                    {megamenuData.column3.contact.kep && <p><strong>KEP:</strong> <a href={`mailto:${megamenuData.column3.contact.kep}`} className="text-primary hover:text-accent underline break-all">{megamenuData.column3.contact.kep}</a></p>}
                                                                    {megamenuData.column3.contact.uets && <p><strong>UETS:</strong> {megamenuData.column3.contact.uets}</p>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            }
                            return <DesktopMenuItem key={item.id} item={item} />;
                        })}

                        {/* Social Icons */}
                        <li className="flex items-center gap-1 ml-3 pl-3 border-l h-8">
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
                    <div className="lg:hidden border-t pb-4 animate-in slide-in-from-top max-h-[80vh] overflow-y-auto">
                        <ul className="space-y-1 pt-2">
                            {menuItems.map((item) => (
                                <MobileMenuItem key={item.id} item={item} />
                            ))}
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
