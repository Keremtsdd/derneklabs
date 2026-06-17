import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaBars, 
    FaTimes, 
    FaChevronDown, 
    FaHeart, 
    FaTwitter, 
    FaFacebookF, 
    FaInstagram, 
    FaYoutube,
    FaPhoneAlt,
    FaWhatsapp,
    FaSun,
    FaMoon
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface MenuItem {
    id?: string;
    title: string;
    url?: string;
    link?: string;
    children?: MenuItem[];
}

export default function Header() {
    const { siteName, logo, phone, raw: settingsRaw } = useSiteSettings();
    const social = settingsRaw?.social as Record<string, string> | undefined;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [desktopActiveDropdown, setDesktopActiveDropdown] = useState<string | null>(null);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Smart scroll hide/show navbar
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 85) {
                // Scroll down - hide
                setShowNavbar(false);
            } else {
                // Scroll up - show
                setShowNavbar(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Parse navbar_menu dynamically from settings
    useEffect(() => {
        if (settingsRaw && settingsRaw.navbar_menu) {
            try {
                const menu = typeof settingsRaw.navbar_menu === 'string'
                    ? JSON.parse(settingsRaw.navbar_menu)
                    : settingsRaw.navbar_menu;
                setMenuItems(Array.isArray(menu) ? menu : []);
            } catch (err) {
                console.error('Navbar menu parse error:', err);
                setMenuItems([]);
            }
        }
    }, [settingsRaw]);

    // Close mobile menu on path change
    useEffect(() => {
        setMobileOpen(false);
        setActiveDropdown(null);
        setDesktopActiveDropdown(null);
    }, [location.pathname]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDesktopActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (title: string) => {
        setActiveDropdown(prev => prev === title ? null : title);
    };

    return (
        <>
            {/* UP-HEADER (Top row of the dual-layer header) */}
            <div className="bg-slate-900 text-slate-350 border-b border-slate-950/40 text-[11px] font-semibold py-2 px-4 sm:px-6 lg:px-8 hidden md:block">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left Side: Phone, WhatsApp link, Languages */}
                    <div className="flex items-center gap-5">
                        <a href={`tel:${phone ? phone.replace(/\s/g, '') : '04385112014'}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <FaPhoneAlt className="text-emerald text-[9px]" />
                            <span>{phone || '0438 511 20 14'}</span>
                        </a>
                        <a 
                            href={`https://wa.me/${phone ? phone.replace(/\s/g, '').replace('+', '') : '904385112014'}?text=Merhaba,%20bilgi%20almak%20istiyorum.`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 text-emerald hover:text-emerald-dark transition-colors"
                        >
                            <FaWhatsapp className="text-xs" />
                            <span>WhatsApp Destek</span>
                        </a>
                    </div>

                    {/* Right Side: Social Icons */}
                    <div className="flex items-center gap-5">
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {social?.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <FaTwitter />
                                </a>
                            )}
                            {social?.facebook && (
                                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <FaFacebookF />
                                </a>
                            )}
                            {social?.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <FaInstagram />
                                </a>
                            )}
                            {social?.youtube && (
                                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <FaYoutube />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN HEADER (Bottom row of the dual-layer header) */}
            <header className={`sticky top-0 z-50 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-transform duration-300 ease-in-out ${
                showNavbar ? 'translate-y-0' : '-translate-y-full'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo & Brand */}
                        <Link to="/" className="flex items-center gap-3 group">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={siteName}
                                    className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/logo-kare.png';
                                    }}
                                />
                            ) : (
                                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full" />
                            )}
                            <div>
                                {siteName ? (
                                    <span className="font-heading font-extrabold text-base md:text-lg text-slate-900 dark:text-slate-100 tracking-tight block leading-tight">
                                        {siteName}
                                    </span>
                                ) : (
                                    <div className="h-5 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md my-0.5" />
                                )}
                                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald block -mt-0.5">
                                    Sivil Toplum Portalı
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>                            {menuItems.map((item) => {
                                const hasChildren = item.children && item.children.length > 0;
                                const isDropdownOpen = desktopActiveDropdown === item.title;
                                const itemPath = item.link || item.url || '#';

                                return (
                                    <div
                                        key={item.title}
                                        className="relative"
                                        onMouseEnter={() => hasChildren && setDesktopActiveDropdown(item.title)}
                                        onMouseLeave={() => setDesktopActiveDropdown(null)}
                                    >
                                        <Link
                                            to={itemPath}
                                            onClick={() => setDesktopActiveDropdown(null)}
                                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 ${location.pathname === itemPath
                                                    ? 'bg-emerald/10 text-emerald-dark dark:bg-emerald/20 dark:text-emerald'
                                                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-dark dark:hover:text-emerald hover:bg-slate-50 dark:hover:bg-slate-900'
                                                }`}
                                        >
                                            {item.title}
                                            {hasChildren && (
                                                <FaChevronDown className={`text-[8px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                            )}
                                        </Link>

                                        {/* Dropdown Card */}
                                        {hasChildren && (
                                            <div
                                                className={`absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-2xl/50 p-3 flex flex-col gap-1 transition-all duration-200 ease-in-out z-50 before:absolute before:block before:w-full before:h-4 before:-top-4 before:content-[''] ${isDropdownOpen
                                                        ? 'opacity-100 pointer-events-auto translate-y-0'
                                                        : 'opacity-0 pointer-events-none translate-y-1.5'
                                                    }`}
                                            >
                                                {item.children?.map((child) => {
                                                    const childPath = child.link || child.url || '#';
                                                    return (
                                                        <Link
                                                            key={child.title}
                                                            to={childPath}
                                                            onClick={() => setDesktopActiveDropdown(null)}
                                                            className={`block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-dark dark:hover:text-emerald hover:bg-emerald/5 dark:hover:bg-emerald/10 transition-all duration-200 ${location.pathname === childPath ? 'bg-emerald/10 text-emerald-dark font-bold dark:bg-emerald/20 dark:text-emerald' : ''
                                                                }`}
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Divider & Theme Toggle */}
                            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald dark:hover:text-emerald hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                                aria-label="Tema Değiştir"
                                title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
                            >
                                {theme === 'dark' ? <FaSun size={15} /> : <FaMoon size={15} />}
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex lg:hidden items-center gap-3">
                            {/* Small inline donate button for mobile */}
                            <Link
                                to="/destek"
                                className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-sm"
                            >
                                Bağış Yap
                            </Link>

                            {/* Mobile Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-dark dark:hover:text-emerald hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                aria-label="Tema Değiştir"
                                title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
                            >
                                {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
                            </button>

                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 rounded-xl text-slate-600 dark:text-slate-350 hover:text-emerald-dark hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                aria-label="Menüyü Aç/Kapat"
                            >
                                {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <>
                    {/* Dark blurred overlay */}
                    <div
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9990] lg:hidden animate-in fade-in duration-200"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div
                        className="fixed right-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-l border-slate-200/50 dark:border-slate-800/80 flex flex-col justify-between z-[9999] lg:hidden animate-in slide-in-from-right duration-300 ease-out"
                    >
                        {/* Drawer Header (Replace static MENU with dynamic logo, siteName, and emerald subtitle) */}
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                            <Link to="/" onClick={() => setTimeout(() => setMobileOpen(false), 80)} className="flex items-center gap-2.5 group">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt={siteName}
                                        className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/logo-kare.png';
                                        }}
                                    />
                                ) : (
                                    <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full" />
                                )}
                                <div className="text-left">
                                    {siteName ? (
                                        <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight block leading-none">
                                            {siteName}
                                        </span>
                                    ) : (
                                        <div className="h-3.5 w-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded my-0.5" />
                                    )}
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-emerald block -mt-0.5">
                                        Sivil Toplum Portalı
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-100 dark:border-slate-800 transition-all cursor-pointer flex-shrink-0"
                                aria-label="Menüyü Kapat"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* Drawer Body - Scrollable Links */}
                        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const hasChildren = item.children && item.children.length > 0;
                                    const isDropdownOpen = activeDropdown === item.title;
                                    const itemPath = item.link || item.url || '#';

                                    return (
                                        <div key={item.title} className="space-y-1">
                                            {hasChildren ? (
                                                <>
                                                    <div className="flex items-center justify-between py-1 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent">
                                                        {/* Parent items navigate on text click */}
                                                        <Link
                                                            to={itemPath}
                                                            onClick={() => setTimeout(() => setMobileOpen(false), 80)}
                                                            className={`text-[11px] font-extrabold uppercase tracking-wider flex-1 py-1.5 ${location.pathname === itemPath ? 'text-emerald-dark dark:text-emerald' : 'text-slate-700 dark:text-slate-300'
                                                                }`}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        {/* Sub-menu toggled ONLY by clicking the right-side chevron */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleDropdown(item.title);
                                                            }}
                                                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-dark transition-colors cursor-pointer border-l border-slate-100 dark:border-slate-800 ml-1"
                                                            aria-label={`${item.title} Alt Menüsünü Göster/Gizle`}
                                                        >
                                                            <FaChevronDown className={`text-[8px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>
                                                    {isDropdownOpen && (
                                                        <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-3 py-1 bg-slate-50/50 dark:bg-slate-950/20 rounded-r-xl">
                                                            {item.children?.map((child) => {
                                                                const childPath = child.link || child.url || '#';
                                                                return (
                                                                    <Link
                                                                        key={child.title}
                                                                        to={childPath}
                                                                        onClick={() => setTimeout(() => setMobileOpen(false), 80)}
                                                                        className={`block py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-dark dark:hover:text-emerald transition-all ${location.pathname === childPath ? 'text-emerald-dark font-bold bg-emerald/5 dark:bg-emerald/10 dark:text-emerald' : ''
                                                                            }`}
                                                                    >
                                                                        {child.title}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <Link
                                                    to={itemPath}
                                                    onClick={() => setTimeout(() => setMobileOpen(false), 80)}
                                                    className={`block py-2.5 px-4 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 ${location.pathname === itemPath
                                                            ? 'bg-emerald/10 text-emerald-dark dark:bg-emerald/20 dark:text-emerald'
                                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                                        }`}
                                                >
                                                    {item.title}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                            <Link
                                id="mobile-destek-btn"
                                to="/destek"
                                onClick={() => setTimeout(() => setMobileOpen(false), 80)}
                                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gradient-to-r from-accent to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md cursor-pointer hover:opacity-95"
                            >
                                <FaHeart className="text-xs text-white animate-pulse" />
                                Bağış Yap
                            </Link>

                            {/* Social Links inside Menu */}
                            <div className="flex justify-center gap-3 pt-2">
                                {social && (
                                    <>
                                        {social.twitter && (
                                            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald/10 hover:text-emerald-dark dark:hover:bg-emerald/20 transition-all text-sm">
                                                <FaTwitter />
                                            </a>
                                        )}
                                        {social.facebook && (
                                            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald/10 hover:text-emerald-dark dark:hover:bg-emerald/20 transition-all text-sm">
                                                <FaFacebookF />
                                            </a>
                                        )}
                                        {social.instagram && (
                                            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald/10 hover:text-emerald-dark dark:hover:bg-emerald/20 transition-all text-sm">
                                                <FaInstagram />
                                            </a>
                                        )}
                                        {social.youtube && (
                                            <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald/10 hover:text-emerald-dark dark:hover:bg-emerald/20 transition-all text-sm">
                                                <FaYoutube />
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
