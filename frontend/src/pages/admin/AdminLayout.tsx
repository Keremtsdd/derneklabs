import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAdmin';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useSiteSettings } from '../../hooks/useSiteSettings';

type MenuItem = { to: string; label: string; icon: string };
type MenuSection = { title: string; items: MenuItem[] };

const menuSections: MenuSection[] = [
    {
        title: 'Özet / Dashboard',
        items: [
            { to: '/admin/dashboard', label: 'Kontrol Paneli', icon: '📊' },
        ]
    },
    {
        title: 'İçerik Yönetimi',
        items: [
            { to: '/admin/hero', label: 'Hero Slider', icon: '🖼️' },
            { to: '/admin/etkinlikler', label: 'Etkinlikler', icon: '📅' },
            { to: '/admin/duyurular', label: 'Duyurular', icon: '📢' },
            { to: '/admin/haberler', label: 'Haberler', icon: '📰' },
            { to: '/admin/projeler', label: 'Projeler', icon: '🏗️' },
            { to: '/admin/basin', label: 'Basın Açıklamaları', icon: '✉️' },
        ]
    },
    {
        title: 'Modüller & Sayfalar',
        items: [
            { to: '/admin/sayfalar', label: 'Kurumsal Sayfalar', icon: '📑' },
            { to: '/admin/sss', label: 'Soru & Cevap (SSS)', icon: '❓' },
            { to: '/admin/foto-galeri', label: 'Foto Galeri', icon: '📸' },
            { to: '/admin/kategori-yonetimi', label: 'Kategori Yönetimi', icon: '🏷️' },
        ]
    },
    {
        title: 'Site Yapılandırması',
        items: [
            { to: '/admin/logo-baslik', label: 'Logo & Başlık', icon: '🏛️' },
            { to: '/admin/ust-menu', label: 'Üst Menü & Sosyal', icon: '📱' },
            { to: '/admin/arac-cubugu', label: 'Araç Çubuğu (Sekme)', icon: '💻' },
            { to: '/admin/menu', label: 'Menü Yönetimi', icon: '🌿' },
            { to: '/admin/iletisim-ayarlari', label: 'İletişim & Harita', icon: '📍' },
            { to: '/admin/footer-ayarlari', label: 'Footer & Copyright', icon: '📝' },
        ]
    }
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { siteName, logo, favicon } = useSiteSettings();

    // Dynamically update browser tab title and favicon in the admin panel
    useEffect(() => {
        if (siteName) {
            document.title = `${siteName} - Yönetim Paneli`;
        } else {
            document.title = 'Yönetim Paneli';
        }
        if (favicon && favicon.trim() !== '') {
            const shortcutIcon = document.querySelector('link[rel="icon"]');
            if (shortcutIcon) {
                shortcutIcon.setAttribute('href', favicon);
            }
        }
    }, [siteName, favicon]);

    // State to track expanded sections. Default to all open or based on current route
    const [expandedSections, setExpandedSections] = useState<string[]>(() => {
        // Auto-expand section containing current route, or expand all by default
        return menuSections.map(section => section.title);
    });

    const toggleSection = (title: string) => {
        setExpandedSections(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/giris');
    };

    const getActivePageLabel = () => {
        for (const section of menuSections) {
            for (const item of section.items) {
                if (item.to === location.pathname) {
                    return item.label;
                }
            }
        }
        return 'Dashboard';
    };

    if (!localStorage.getItem('admin_token')) {
        navigate('/admin/giris');
        return null;
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#090D16] text-white flex flex-col shrink-0 font-sans border-r border-slate-900">
                {/* Logo Area */}
                <div className="px-5 py-4 border-b border-slate-900">
                    <div className="flex items-center gap-2.5">
                        {logo ? (
                            <img src={logo} alt="" className="w-7 h-7 object-contain rounded-lg" />
                        ) : (
                            <span className="text-xl bg-slate-800 p-1 rounded-xl">🏛️</span>
                        )}
                        <div>
                            <h1 className="text-xs font-extrabold text-white tracking-wider uppercase font-heading truncate max-w-[140px]" title={siteName || 'Yönetim'}>
                                {siteName || 'Yönetim'}
                            </h1>
                            <p className="text-[9px] font-bold text-primary-light tracking-widest uppercase mt-0.5">Yönetim Paneli</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 select-none space-y-2 no-scrollbar">
                    {menuSections.map((section) => {
                        const isExpanded = expandedSections.includes(section.title);

                        return (
                            <div key={section.title} className="px-3">
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
                                >
                                    <span>{section.title}</span>
                                    {isExpanded ? <FaChevronDown size={8} /> : <FaChevronRight size={8} />}
                                </button>

                                {isExpanded && (
                                    <div className="space-y-0.5 mt-1 transition-all duration-200">
                                        {section.items.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={item.to === '/admin'}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-all duration-150 rounded-lg ${isActive
                                                        ? 'bg-slate-800 text-white border-l-2 border-primary rounded-l-none'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                                    }`
                                                }
                                            >
                                                <span className="text-xs w-4 flex justify-center">{item.icon}</span>
                                                {item.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Profile & Footer */}
                <div className="p-3 border-t border-slate-900 bg-slate-950/40">
                    <div className="flex items-center gap-2.5 bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-light to-primary flex items-center justify-center text-xs font-bold text-white shadow-inner">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-white truncate">{user?.name || 'Yönetici'}</p>
                            <p className="text-[9px] font-medium text-slate-500 truncate">{user?.email || 'admin@cukurca.bel.tr'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-full py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold rounded-lg text-[10px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Main Topbar */}
                <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/30">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span>Yönetim</span>
                        <span>/</span>
                        <span className="text-slate-800 font-bold">{getActivePageLabel()}</span>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-sm bg-white cursor-pointer"
                    >
                        👁️ Web Sitesini Aç
                    </a>
                </header>

                {/* Scrollable Page Wrapper */}
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
