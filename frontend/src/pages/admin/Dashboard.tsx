import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaUsers, 
    FaGlobe, 
    FaChevronRight, 
    FaArrowRight,
    FaNewspaper,
    FaBullhorn,
    FaCalendarAlt,
    FaImage,
    FaThumbtack,
    FaFolderOpen,
    FaWrench,
    FaBolt,
    FaVideo,
    FaTicketAlt,
    FaArchive,
    FaImages,
    FaFileAlt,
    FaPlusCircle,
    FaCommentAlt,
    FaCalendarPlus,
    FaFileMedical,
    FaSlidersH,
    FaEnvelopeOpenText,
    FaSyncAlt,
    FaSignInAlt,
    FaCog,
    FaPlus,
    FaPen,
    FaTrash
} from 'react-icons/fa';
import Toast from '../../components/ui/Toast';
import { 
    fetchDashboardStats, 
    fetchRecentActivities, 
    syncInstagramContent, 
    type ActivityLog 
} from '../../services/adminApi';

interface StatRow {
    key: string;
    label: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    path: string;
    bgColor: string;
    textColor: string;
    isMocked?: boolean;
    mockedValue?: number;
}

const STAT_ROWS: StatRow[] = [
    { key: 'news', label: 'Haberler', Icon: FaNewspaper, path: '/admin/haberler', bgColor: 'bg-blue-50', textColor: 'text-blue-500' },
    { key: 'announcements', label: 'Duyurular', Icon: FaBullhorn, path: '/admin/duyurular', bgColor: 'bg-orange-50', textColor: 'text-orange-500' },
    { key: 'events', label: 'Etkinlikler', Icon: FaCalendarAlt, path: '/admin/etkinlikler', bgColor: 'bg-purple-50', textColor: 'text-purple-500' },
    { key: 'banners', label: 'Bannerlar', Icon: FaImage, path: '/admin/hero', bgColor: 'bg-pink-50', textColor: 'text-pink-500' },
    { key: 'notices_mocked', label: 'İlanlar', Icon: FaThumbtack, path: '/admin/dashboard', bgColor: 'bg-red-50', textColor: 'text-red-500', isMocked: true, mockedValue: 0 },
    { key: 'documents', label: 'Belgeler', Icon: FaFolderOpen, path: '/admin/dashboard', bgColor: 'bg-teal-50', textColor: 'text-teal-500' },
    { key: 'projects', label: 'Projeler', Icon: FaWrench, path: '/admin/projeler', bgColor: 'bg-emerald-50', textColor: 'text-emerald-500' },
    { key: 'quickLinks', label: 'Hızlı Bağlantı', Icon: FaBolt, path: '/admin/ust-menu', bgColor: 'bg-amber-50', textColor: 'text-amber-500' },
    { key: 'videos_mocked', label: 'Videolar', Icon: FaVideo, path: '/admin/dashboard', bgColor: 'bg-indigo-50', textColor: 'text-indigo-500', isMocked: true, mockedValue: 0 },
    { key: 'supportTickets', label: 'tickets', Icon: FaTicketAlt, path: '/admin/dashboard', bgColor: 'bg-slate-100', textColor: 'text-slate-500' },
    { key: 'notices', label: 'press', Icon: FaArchive, path: '/admin/basin', bgColor: 'bg-slate-100', textColor: 'text-slate-500' },
    { key: 'photoGallery', label: 'gallery_images', Icon: FaImages, path: '/admin/foto-galeri', bgColor: 'bg-slate-100', textColor: 'text-slate-500' },
    { key: 'pages', label: 'Sayfalar', Icon: FaFileAlt, path: '/admin/sayfalar', bgColor: 'bg-sky-50', textColor: 'text-sky-500' }
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [syncToast, setSyncToast] = useState(false);
    const [syncing, setSyncing] = useState(false);
    
    // Stats query
    const { data: stats, isLoading: isStatsLoading } = useQuery<Record<string, number>>({
        queryKey: ['admin', 'dashboard'],
        queryFn: fetchDashboardStats,
    });

    // Activities query
    const { 
        data: activities, 
        isLoading: isActivitiesLoading, 
        refetch: refetchActivities 
    } = useQuery<ActivityLog[]>({
        queryKey: ['admin', 'activities'],
        queryFn: fetchRecentActivities,
    });

    const getTurkishDate = () => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { 
            day: 'numeric', 
            month: 'long', 
            weekday: 'long' 
        };
        return date.toLocaleDateString('tr-TR', options);
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            await syncInstagramContent();
            refetchActivities();
            setSyncToast(true);
        } catch (err) {
            console.error('Senkronizasyon hatası:', err);
        } finally {
            setSyncing(false);
        }
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('tr-TR');
    };

    const formatRelativeTime = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffSec < 60) {
            return 'Az önce';
        } else if (diffMin < 60) {
            return `${diffMin} dk önce`;
        } else if (diffHr < 24) {
            return `${diffHr} sa önce`;
        } else {
            return `${diffDay} gün önce`;
        }
    };

    const getActivityStyle = (type: string) => {
        switch (type) {
            case 'login':
                return { Icon: FaSignInAlt, bgColor: 'bg-blue-50', textColor: 'text-blue-500' };
            case 'sync':
                return { Icon: FaSyncAlt, bgColor: 'bg-emerald-50', textColor: 'text-emerald-500' };
            case 'settings':
                return { Icon: FaCog, bgColor: 'bg-amber-50', textColor: 'text-amber-500' };
            case 'create':
                return { Icon: FaPlus, bgColor: 'bg-green-50', textColor: 'text-green-500' };
            case 'update':
                return { Icon: FaPen, bgColor: 'bg-blue-50', textColor: 'text-blue-500' };
            case 'delete':
                return { Icon: FaTrash, bgColor: 'bg-red-50', textColor: 'text-red-500' };
            default:
                return { Icon: FaArrowRight, bgColor: 'bg-slate-50', textColor: 'text-slate-500' };
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans text-slate-800">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                    Hoş geldiniz 👋
                </h1>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {getTurkishDate()}
                </p>
            </div>

            {/* Top Stat Cards (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Bugünkü Ziyaretçi */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg">
                        <FaUsers size={18} />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Bugünkü Ziyaretçi</span>
                        <span className="text-2xl font-black text-[#0F172A] leading-tight">
                            {isStatsLoading ? '...' : formatNumber(stats?.visitorsToday ?? 0)}
                        </span>
                    </div>
                </div>

                {/* Toplam Ziyaretçi */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50/50 flex items-center justify-center text-indigo-500 text-lg">
                        <FaGlobe size={18} />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Toplam Ziyaretçi</span>
                        <span className="text-2xl font-black text-[#0F172A] leading-tight">
                            {isStatsLoading ? '...' : formatNumber(stats?.visitorsTotal ?? 0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2-Column Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (2/3 width) - İçerik Özeti */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                        <div>
                            <h3 className="text-sm font-bold text-[#0F172A]">İçerik Özeti</h3>
                            <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">Toplam kayıt sayıları</span>
                        </div>
                    </div>

                    {isStatsLoading ? (
                        <div className="space-y-3 py-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-10 bg-slate-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100/60">
                            {STAT_ROWS.map((row) => {
                                const count = row.isMocked ? (row.mockedValue ?? 0) : (stats?.[row.key] ?? 0);
                                return (
                                    <div 
                                        key={row.key} 
                                        onClick={() => navigate(row.path)}
                                        className="flex items-center justify-between py-2.5 hover:bg-slate-50/70 px-2 rounded-xl -mx-2 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.bgColor} ${row.textColor} transition-transform group-hover:scale-105`}>
                                                <row.Icon size={13} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-655 group-hover:text-slate-900 transition-colors">{row.label}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-blue-600 group-hover:text-blue-700 transition-colors">{count}</span>
                                            <FaChevronRight className="text-slate-300 group-hover:text-slate-450 transition-colors" size={8} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column (1/3 width) - Hızlı İşlemler */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 h-fit">
                    <h3 className="text-sm font-bold text-[#0F172A] border-b border-slate-50 pb-3">Hızlı İşlemler</h3>
                    
                    <div className="space-y-1">
                        <Link to="/admin/haberler" className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-colors text-xs font-semibold text-slate-600 hover:text-slate-900">
                            <span className="text-blue-500 font-bold"><FaPlusCircle size={13} /></span>
                            Haber Ekle
                        </Link>
                        <Link to="/admin/duyurular" className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-colors text-xs font-semibold text-slate-600 hover:text-slate-900">
                            <span className="text-blue-500 font-bold"><FaCommentAlt size={13} /></span>
                            Duyuru Ekle
                        </Link>
                        <Link to="/admin/etkinlikler" className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-colors text-xs font-semibold text-slate-600 hover:text-slate-900">
                            <span className="text-blue-500 font-bold"><FaCalendarPlus size={13} /></span>
                            Etkinlik Ekle
                        </Link>
                        <Link to="/admin/sayfalar" className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-colors text-xs font-semibold text-slate-600 hover:text-slate-900">
                            <span className="text-blue-500 font-bold"><FaFileMedical size={13} /></span>
                            Belge Ekle
                        </Link>
                        <Link to="/admin/logo-baslik" className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-colors text-xs font-semibold text-slate-600 hover:text-slate-900">
                            <span className="text-slate-400 font-bold"><FaSlidersH size={13} /></span>
                            Site Ayarları
                        </Link>
                        <Link to="/admin/dashboard" className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-colors text-xs font-semibold text-slate-600 hover:text-slate-900">
                            <span className="text-blue-500 font-bold"><FaEnvelopeOpenText size={13} /></span>
                            Destek Talepleri
                        </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                        <button 
                            onClick={handleSync}
                            disabled={syncing}
                            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-pink-50 hover:bg-pink-100/70 text-pink-600 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-70"
                        >
                            <FaSyncAlt className={`text-[11px] ${syncing ? 'animate-spin' : ''}`} />
                            Instagram Senkronize Et
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Son Etkinlik */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-sm font-bold text-[#0F172A]">Son Etkinlik</h3>
                    <button 
                        onClick={() => refetchActivities()}
                        className="text-[10px] font-bold text-blue-500 hover:text-blue-650 hover:underline uppercase tracking-wider flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                        Yenile
                    </button>
                </div>

                {isActivitiesLoading ? (
                    <div className="space-y-2 py-4">
                        <div className="h-6 bg-slate-50 rounded-lg animate-pulse" />
                        <div className="h-6 bg-slate-50 rounded-lg animate-pulse" />
                        <div className="h-6 bg-slate-50 rounded-lg animate-pulse" />
                    </div>
                ) : !activities || activities.length === 0 ? (
                    <div className="py-6 text-center text-xs font-semibold text-slate-400">
                        Henüz bir etkinlik kaydı bulunmuyor.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {activities.map((act) => {
                            const style = getActivityStyle(act.activity_type);
                            return (
                                <div key={act.id} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs w-6 h-6 rounded-lg ${style.bgColor} ${style.textColor} flex items-center justify-center select-none`}>
                                            <style.Icon size={10} />
                                        </span>
                                        <span className="text-xs font-bold text-slate-750">{act.description}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{formatRelativeTime(act.created_at)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Toast 
                message="Instagram içerikleri başarıyla senkronize edildi!" 
                visible={syncToast} 
                onClose={() => setSyncToast(false)} 
                type="success" 
            />
        </div>
    );
}
