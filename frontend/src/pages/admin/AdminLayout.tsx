import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAdmin';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useSiteSettings } from '../../hooks/useSiteSettings';

type MenuItem = { to: string; label: string; icon: string };
type MenuSection = { title: string; items: MenuItem[] };

const menuSections: MenuSection[] = [
    {
        title: 'Genel',
        items: [
            { to: '/admin', label: 'Dashboard', icon: '📊' },
        ]
    },
    {
        title: 'İçerik Yönetim Sistemi',
        items: [
            { to: '/admin/haberler', label: 'Haberler', icon: '📰' },
            { to: '/admin/duyurular', label: 'Duyurular', icon: '📢' },
            { to: '/admin/etkinlikler', label: 'Etkinlikler', icon: '🎭' },
            { to: '/admin/projeler', label: 'Projeler', icon: '🏗️' },
            { to: '/admin/sayfalar', label: 'Sayfalar', icon: '📃' },
            { to: '/admin/belgeler', label: 'Belgeler', icon: '📄' },
            { to: '/admin/bannerlar', label: 'Banner / Slider', icon: '🖼️' },
            { to: '/admin/hizli-islemler', label: 'Hızlı Bağlantılar', icon: '⚡' },
        ]
    },
    {
        title: 'Site Yönetimi',
        items: [
            { to: '/admin/menu', label: 'Menü Yönetimi', icon: '☰' },
            { to: '/admin/ayarlar', label: 'Site Ayarları', icon: '⚙️' },
            { to: '/admin/destek-talepleri', label: 'Destek Talepleri', icon: '📬' },
        ]
    }
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { siteName, logo } = useSiteSettings();

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
                <div className="px-6 py-6 border-b border-slate-900">
                    <div className="flex items-center gap-3">
                        {logo ? (
                            <img src={logo} alt="" className="w-8 h-8 object-contain rounded-lg" />
                        ) : (
                            <span className="text-2xl bg-slate-800 p-1.5 rounded-xl">🏛️</span>
                        )}
                        <div>
                            <h1 className="text-sm font-extrabold text-white tracking-wider uppercase font-heading truncate max-w-[140px]" title={siteName || 'Yönetim'}>
                                {siteName || 'Yönetim'}
                            </h1>
                            <p className="text-[10px] font-bold text-primary-light tracking-widest uppercase mt-0.5">Yönetim Paneli</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 select-none space-y-4">
                    {menuSections.map((section) => {
                        const isExpanded = expandedSections.includes(section.title);

                        return (
                            <div key={section.title} className="px-3">
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
                                >
                                    <span>{section.title}</span>
                                    {isExpanded ? <FaChevronDown size={8} /> : <FaChevronRight size={8} />}
                                </button>

                                {isExpanded && (
                                    <div className="space-y-1 mt-2 transition-all duration-200">
                                        {section.items.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={item.to === '/admin'}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-200 ${isActive
                                                        ? 'bg-gradient-to-r from-primary-light to-primary text-white shadow-md shadow-primary/10'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                                                    }`
                                                }
                                            >
                                                <span className="text-base w-5 flex justify-center">{item.icon}</span>
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
                <div className="p-4 border-t border-slate-900 bg-slate-950/40">
                    <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-900">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-light to-primary flex items-center justify-center text-sm font-bold text-white shadow-inner">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user?.name || 'Yönetici'}</p>
                            <p className="text-[10px] font-medium text-slate-500 truncate">{user?.email || 'admin@cukurca.bel.tr'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-3 w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-semibold rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
