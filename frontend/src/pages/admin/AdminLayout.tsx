import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAdmin';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

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
            { to: '/admin/kurumsal-menu', label: 'Kurumsal Menü', icon: '📋' },
            { to: '/admin/ayarlar', label: 'Site Ayarları', icon: '⚙️' },
        ]
    }
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State to track expanded sections. Default to all open or based on current route
    const [expandedSections, setExpandedSections] = useState<string[]>(() => {
        // Auto-expand section containing current route
        return menuSections
            .filter(section => section.items.some(item => item.to === location.pathname))
            .map(section => section.title);
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

    if (!localStorage.getItem('admin_token')) {
        navigate('/admin/giris');
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0d2137] text-white flex flex-col shrink-0 font-sans transition-all duration-300">
                <div className="px-6 py-5 border-b border-white/10">
                    <h1 className="text-lg font-bold tracking-wide">🏛️ Yönetim Paneli</h1>
                    <p className="text-xs text-gray-400 mt-1">Orhanpaşa Belediyesi</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 select-none">
                    {menuSections.map((section) => {
                        const isExpanded = expandedSections.includes(section.title);
                        // Hide title for "Genel" if mostly dashboard, or keep it consistent
                        // Let's render all sections as collapsible

                        return (
                            <div key={section.title} className="mb-2">
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex items-center justify-between px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <span>{section.title}</span>
                                    {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                                </button>

                                {isExpanded && (
                                    <div className="space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                                        {section.items.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={item.to === '/admin'}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors border-l-4 ${isActive
                                                        ? 'bg-white/10 text-white border-red-500'
                                                        : 'text-gray-300 border-transparent hover:bg-white/5 hover:text-white'
                                                    }`
                                                }
                                            >
                                                <span className="text-lg w-6 flex justify-center">{item.icon}</span>
                                                {item.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="px-6 py-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-3 w-full text-left text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                        <span>←</span> Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
