import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaHeart, FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface MenuItem {
    id?: string;
    title: string;
    url?: string;
    link?: string;
    children?: MenuItem[];
}

export default function Header() {
    const { siteName, logo, raw: settingsRaw } = useSiteSettings();
    const social = settingsRaw?.social as Record<string, string> | undefined;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [desktopActiveDropdown, setDesktopActiveDropdown] = useState<string | null>(null);
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo & Brand */}
                        <Link to="/" className="flex items-center gap-3 group">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={siteName}
                                    className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        // Fallback logo if missing
                                        (e.target as HTMLImageElement).src = '/images/logo-kare.png';
                                    }}
                                />
                            ) : (
                                <div className="h-10 w-10 bg-slate-100 animate-pulse rounded-full" />
                            )}
                            <div>
                                {siteName ? (
                                    <span className="font-heading font-extrabold text-base md:text-lg text-slate-800 tracking-tight block">
                                        {siteName}
                                    </span>
                                ) : (
                                    <div className="h-5 w-24 bg-slate-100 animate-pulse rounded-md my-0.5" />
                                )}
                                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 block -mt-1">
                                    Sivil Toplum Portalı
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1.5" ref={dropdownRef}>
                            {menuItems.map((item) => {
                                const hasChildren = item.children && item.children.length > 0;
                                const itemPath = item.link || item.url || '#';
                                const isDropdownOpen = desktopActiveDropdown === item.title;

                                return (
                                    <div
                                        key={item.title}
                                        className="relative group"
                                        onMouseEnter={() => hasChildren && setDesktopActiveDropdown(item.title)}
                                        onMouseLeave={() => setDesktopActiveDropdown(null)}
                                    >
                                        <Link
                                            to={itemPath}
                                            onClick={() => setDesktopActiveDropdown(null)}
                                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${location.pathname === itemPath
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50/50'
                                                }`}
                                        >
                                            {item.title}
                                            {hasChildren && (
                                                <FaChevronDown className={`text-[9px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                            )}
                                        </Link>

                                        {/* Dropdown Card */}
                                        {hasChildren && (
                                            <div
                                                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 flex flex-col gap-1.5 transition-all duration-200 ease-in-out z-50 before:absolute before:block before:w-full before:h-4 before:-top-4 before:content-[''] ${isDropdownOpen
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
                                                            className={`block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 ${location.pathname === childPath ? 'bg-emerald-50 text-emerald-600' : ''
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
                        </nav>

                        {/* Actions & CTA */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link
                                to="/destek"
                                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:opacity-95 shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 transition-all duration-500"
                            >
                                <FaHeart className="text-xs text-rose-300 animate-pulse" />
                                Destek Ol
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex lg:hidden">
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-colors"
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
                        className="fixed right-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl border-l border-slate-100 flex flex-col justify-between z-[9999] lg:hidden animate-in slide-in-from-right duration-350 ease-out"
                    >
                        {/* Drawer Header */}
                        <div className="px-5 py-4 border-b border-slate-100/80 flex items-center justify-between">
                            <Link to="/" onClick={() => setTimeout(() => setMobileOpen(false), 80)} className="flex items-center gap-2.5 group">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt={siteName}
                                        className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/logo-kare.png';
                                        }}
                                    />
                                ) : (
                                    <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-full" />
                                )}
                                <div className="text-left">
                                    {siteName ? (
                                        <span className="font-heading font-extrabold text-sm text-slate-800 tracking-tight block leading-none">
                                            {siteName}
                                        </span>
                                    ) : (
                                        <div className="h-3.5 w-16 bg-slate-100 animate-pulse rounded my-0.5" />
                                    )}
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 block -mt-0.5">
                                        Sivil Toplum Portalı
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-100 transition-all cursor-pointer flex-shrink-0"
                                aria-label="Menüyü Kapat"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* Drawer Body - Scrollable Links */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                            <nav className="space-y-2.5">
                                {menuItems.map((item) => {
                                    const hasChildren = item.children && item.children.length > 0;
                                    const isDropdownOpen = activeDropdown === item.title;
                                    const itemPath = item.link || item.url || '#';

                                    return (
                                        <div key={item.title} className="space-y-1">
                                            {hasChildren ? (
                                                <>
                                                    <div className="flex items-center justify-between py-1 px-3 rounded-xl hover:bg-slate-50">
                                                        <Link
                                                            to={itemPath}
                                                            onClick={() => setTimeout(() => setMobileOpen(false), 80)}
                                                            className={`text-xs font-bold uppercase tracking-wider flex-1 py-1.5 ${location.pathname === itemPath ? 'text-emerald-600' : 'text-slate-700'
                                                                }`}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleDropdown(item.title);
                                                            }}
                                                            className="p-2.5 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                                                            aria-label={`${item.title} Alt Menüsünü Göster/Gizle`}
                                                        >
                                                            <FaChevronDown className={`text-[9px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>
                                                    {isDropdownOpen && (
                                                        <div className="pl-3 space-y-1 border-l-2 border-slate-100 ml-2 py-1">
                                                            {item.children?.map((child) => {
                                                                const childPath = child.link || child.url || '#';
                                                                return (
                                                                    <Link
                                                                        key={child.title}
                                                                        to={childPath}
                                                                        onClick={() => setTimeout(() => setMobileOpen(false), 80)}
                                                                        className={`block py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-all ${location.pathname === childPath ? 'text-emerald-600' : ''
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
                                                    className={`block py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${location.pathname === itemPath
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : 'text-slate-700 hover:bg-slate-50'
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
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                            <Link
                                id="mobile-destek-btn"
                                to="/destek"
                                onClick={() => setTimeout(() => setMobileOpen(false), 80)}
                                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md cursor-pointer hover:opacity-95"
                            >
                                <FaHeart className="text-xs text-rose-300 animate-pulse" />
                                Destek Ol
                            </Link>

                            {/* Social Links inside Menu */}
                            <div className="flex justify-center gap-3 pt-2">
                                {social && (
                                    <>
                                        {social.twitter && (
                                            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-sm">
                                                <FaTwitter />
                                            </a>
                                        )}
                                        {social.facebook && (
                                            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-sm">
                                                <FaFacebookF />
                                            </a>
                                        )}
                                        {social.instagram && (
                                            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-sm">
                                                <FaInstagram />
                                            </a>
                                        )}
                                        {social.youtube && (
                                            <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-sm">
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
