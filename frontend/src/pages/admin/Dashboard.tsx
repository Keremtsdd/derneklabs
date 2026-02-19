import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../../services/adminApi';

const statLabels: Record<string, { label: string; icon: string; color: string }> = {
    news: { label: 'Haberler', icon: '📰', color: 'bg-blue-500' },
    announcements: { label: 'Duyurular', icon: '📢', color: 'bg-orange-500' },
    events: { label: 'Etkinlikler', icon: '🎭', color: 'bg-purple-500' },
    projects: { label: 'Projeler', icon: '🏗️', color: 'bg-green-500' },
    banners: { label: 'Banner', icon: '🖼️', color: 'bg-pink-500' },
    fast_links: { label: 'Hızlı İşlemler', icon: '⚡', color: 'bg-yellow-500' },
    documents: { label: 'Belgeler', icon: '📄', color: 'bg-teal-500' },
    notices: { label: 'İlanlar', icon: '📌', color: 'bg-red-500' },
    videos: { label: 'Videolar', icon: '🎬', color: 'bg-indigo-500' },
    pages: { label: 'Sayfalar', icon: '📃', color: 'bg-cyan-500' },
};

export default function Dashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: fetchDashboardStats,
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                            <div className="h-8 bg-gray-200 rounded w-12" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {stats &&
                        Object.entries(stats).map(([key, count]) => {
                            const meta = statLabels[key] || { label: key, icon: '📦', color: 'bg-gray-500' };
                            return (
                                <div key={key} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 ${meta.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                                            {meta.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">{meta.label}</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{count}</p>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
