import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAdmin';

const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/haberler', label: 'Haberler', icon: '📰' },
    { to: '/admin/duyurular', label: 'Duyurular', icon: '📢' },
    { to: '/admin/etkinlikler', label: 'Etkinlikler', icon: '🎭' },
    { to: '/admin/projeler', label: 'Projeler', icon: '🏗️' },
    { to: '/admin/bannerlar', label: 'Banner / Slider', icon: '🖼️' },
    { to: '/admin/hizli-islemler', label: 'Hızlı İşlemler', icon: '⚡' },
    { to: '/admin/belgeler', label: 'Belgeler', icon: '📄' },
    { to: '/admin/sayfalar', label: 'Sayfalar', icon: '📃' },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
            <aside className="w-64 bg-[#0d2137] text-white flex flex-col shrink-0">
                <div className="px-6 py-5 border-b border-white/10">
                    <h1 className="text-lg font-bold tracking-wide">🏛️ Yönetim Paneli</h1>
                    <p className="text-xs text-gray-400 mt-1">Orhanpaşa Belediyesi</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${isActive
                                    ? 'bg-white/10 text-white border-r-4 border-red-500'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
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
                        className="mt-3 w-full text-left text-sm text-gray-400 hover:text-red-400 transition-colors"
                    >
                        ← Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
