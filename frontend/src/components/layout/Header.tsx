import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

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

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const dropdownRef = useRef<HTMLUListElement>(null);

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
        const hasChildren = item.children && item.children.length > 0;
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <li>
                <div className="flex items-center justify-between">
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
                    {hasChildren && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-400 hover:text-accent"
                        >
                            <FaChevronDown className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
                {hasChildren && isExpanded && (
                    <ul className="border-l-2 border-gray-100 ml-4 space-y-1 my-1">
                        {item.children.map((child) => (
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
                        <img src="/images/logo-kare.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12 rounded" />
                        <span className="font-heading text-primary font-bold text-lg lg:text-xl">Orhanpaşa Bel.</span>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="hidden lg:flex items-center gap-1 h-full" ref={dropdownRef}>
                        {menuItems.map((item) => (
                            <DesktopMenuItem key={item.id} item={item} />
                        ))}

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
