import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../../services/adminApi';

const statLabels: Record<string, { label: string; icon: string; color: string; hoverColor: string }> = {
    news: { label: 'Haberler', icon: '📰', color: 'from-blue-500 to-indigo-600', hoverColor: 'hover:shadow-blue-100' },
    announcements: { label: 'Duyurular', icon: '📢', color: 'from-amber-500 to-orange-600', hoverColor: 'hover:shadow-amber-100' },
    events: { label: 'Etkinlikler', icon: '🎭', color: 'from-purple-500 to-pink-600', hoverColor: 'hover:shadow-purple-100' },
    projects: { label: 'Projeler', icon: '🏗️', color: 'from-emerald-500 to-teal-600', hoverColor: 'hover:shadow-emerald-100' },
    banners: { label: 'Slaytlar', icon: '🖼️', color: 'from-rose-500 to-red-600', hoverColor: 'hover:shadow-rose-100' },
    quickLinks: { label: 'Hızlı İşlemler', icon: '⚡', color: 'from-yellow-500 to-amber-600', hoverColor: 'hover:shadow-yellow-100' },
    documents: { label: 'Belgeler', icon: '📄', color: 'from-teal-500 to-cyan-600', hoverColor: 'hover:shadow-teal-100' },
    photoGallery: { label: 'Fotoğraf Galerisi', icon: '📸', color: 'from-indigo-500 to-violet-600', hoverColor: 'hover:shadow-indigo-100' },
    supportTickets: { label: 'Destek Talepleri', icon: '🎟️', color: 'from-violet-500 to-fuchsia-600', hoverColor: 'hover:shadow-violet-100' },
    pages: { label: 'Sayfalar', icon: '📃', color: 'from-cyan-500 to-blue-600', hoverColor: 'hover:shadow-cyan-100' },
};

export default function Dashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: fetchDashboardStats,
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-10 translate-x-10">
                    <span className="text-[200px] font-bold">CMS</span>
                </div>
                <div className="relative z-10 max-w-2xl">
                    <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        Yönetim Paneli
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight mt-3">Merhaba, Yönetici!</h1>
                    <p className="text-slate-300 mt-2 leading-relaxed">
                        Çukurca Sivil Toplum ve Dayanışma Portalı Yönetim Paneline hoş geldiniz. Buradan sitenizin tüm menü ağacını, haberlerini, sayfalarını ve destek taleplerini anlık olarak yönetebilirsiniz.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <Link to="/admin/menu" className="bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md">
                            🌳 Menü Yönetimi
                        </Link>
                        <Link to="/admin/ayarlar" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                            ⚙️ Sistem Ayarları
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-2">
                    📊 Genel İstatistikler <span className="text-sm font-normal text-slate-400">({Object.keys(statLabels).length} kategori)</span>
                </h2>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
                                <div className="h-4 bg-slate-200 rounded w-20 mb-4" />
                                <div className="h-8 bg-slate-200 rounded w-12" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {stats &&
                            Object.entries(stats).map(([key, count]) => {
                                const meta = statLabels[key] || { label: key, icon: '📦', color: 'from-gray-500 to-gray-600', hoverColor: 'hover:shadow-gray-100' };
                                return (
                                    <div 
                                        key={key} 
                                        className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100/80 ${meta.hoverColor} group`}
                                    >
                                        <div className="flex items-center gap-3.5 mb-4">
                                            <div className={`w-11 h-11 bg-gradient-to-br ${meta.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                {meta.icon}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors uppercase tracking-wider">{meta.label}</span>
                                        </div>
                                        <p className="text-4xl font-black text-slate-900 tracking-tight">{count}</p>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>

            {/* Quick Actions Panel */}
            <div className="mt-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">⚡ Hızlı İşlemler</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link to="/admin/haberler" className="p-4 bg-slate-50 hover:bg-blue-50/50 hover:text-blue-600 rounded-2xl text-sm font-semibold text-slate-700 text-center transition-all border border-slate-100">
                            📰 Yeni Haber Ekle
                        </Link>
                        <Link to="/admin/duyurular" className="p-4 bg-slate-50 hover:bg-amber-50/50 hover:text-amber-600 rounded-2xl text-sm font-semibold text-slate-700 text-center transition-all border border-slate-100">
                            📢 Yeni Duyuru Yayınla
                        </Link>
                        <Link to="/admin/etkinlikler" className="p-4 bg-slate-50 hover:bg-purple-50/50 hover:text-purple-600 rounded-2xl text-sm font-semibold text-slate-700 text-center transition-all border border-slate-100">
                            🎭 Etkinlik Planla
                        </Link>
                        <Link to="/admin/sayfalar" className="p-4 bg-slate-50 hover:bg-cyan-50/50 hover:text-cyan-600 rounded-2xl text-sm font-semibold text-slate-700 text-center transition-all border border-slate-100">
                            📃 Yeni Sayfa Aç
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
