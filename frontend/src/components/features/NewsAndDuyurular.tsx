import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaNewspaper, FaBullhorn, FaCalendarCheck, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { useNews, useAnnouncements, useEvents, useNotices } from '../../hooks/useCollections';
import { resolveImageUrl } from '../../services/api';

type TabType = 'news' | 'announcements' | 'events' | 'press';

export default function NewsAndDuyurular() {
    const [activeTab, setActiveTab] = useState<TabType>('news');
    const { data: news } = useNews();
    const { data: announcements } = useAnnouncements();
    const { data: events } = useEvents();
    const { data: notices } = useNotices();

    const formatCardDate = (dateString: string) => {
        if (!dateString) return '16 Haziran 2026';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatAnnouncementDate = (dateString: string) => {
        if (!dateString) return { day: '16', monthYear: 'Haz. 2026' };
        const parts = dateString.split(' ');
        if (parts.length >= 3) {
            return { day: parts[0], monthYear: `${parts[1]} ${parts[2]}` };
        }
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return { day: '16', monthYear: 'Haz. 2026' };
        }
        
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return { day, monthYear: `${month} ${year}` };
    };

    const renderTabContent = () => {
        let items: any[] = [];
        let categoryLabel = '';
        let pillBg = '';
        let viewAllLink = '/haberler';

        switch (activeTab) {
            case 'news':
                items = news || [];
                categoryLabel = 'Haber';
                pillBg = 'bg-sky-50 text-sky-700 border-sky-100';
                viewAllLink = '/haberler';
                break;
            case 'announcements':
                items = announcements || [];
                categoryLabel = 'Duyuru';
                pillBg = 'bg-emerald/10 text-emerald-dark border-emerald/20';
                viewAllLink = '/duyurular';
                break;
            case 'events':
                items = events || [];
                categoryLabel = 'Etkinlik';
                pillBg = 'bg-amber-50 text-amber-700 border-amber-100';
                viewAllLink = '/etkinlikler';
                break;
            case 'press':
                items = notices || [];
                categoryLabel = 'Basın';
                pillBg = 'bg-purple-50 text-purple-700 border-purple-100';
                viewAllLink = '/haberler';
                break;
        }

        // 4 items displayed in 2x2 grid for a wider, more modern card format
        const displayItems = items.slice(0, 4);

        if (displayItems.length === 0) {
            return (
                <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    📢 Bu kategoride henüz yayınlanmış içerik bulunamadı.
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {displayItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100/80 dark:border-slate-800/80 shadow-sm dark:shadow-black/20 hover:shadow-xl dark:hover:shadow-black/35 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                        >
                            {/* Card Image */}
                            <div className="h-44 overflow-hidden relative">
                                <img
                                    src={resolveImageUrl(item.image)}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-3.5 left-3.5">
                                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${pillBg}`}>
                                        {categoryLabel}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 dark:text-slate-500 mb-2">
                                        <FaCalendarAlt className="text-emerald" />
                                        <span>{formatCardDate(item.date || item.created_at)}</span>
                                    </div>
                                    <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 hover:text-emerald-dark dark:hover:text-emerald transition-colors mb-2">
                                        <Link to={item.link || `/sayfa/${item.slug || ''}`}>
                                            {item.title}
                                        </Link>
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 mb-4">
                                        {item.summary || item.short_description || 'Çalışmalarımız hakkında en güncel bilgilere buradan ulaşabilirsiniz.'}
                                    </p>
                                </div>
                                <Link 
                                    to={item.link || `/sayfa/${item.slug || ''}`} 
                                    className="text-xs font-extrabold text-emerald-dark dark:text-emerald hover:text-emerald dark:hover:text-emerald-light flex items-center gap-1 transition-colors mt-auto w-max"
                                >
                                    Detayları Gör →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="flex justify-start pt-2">
                    <Link
                        to={viewAllLink}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white dark:text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                    >
                        Tümünü Gör <FaArrowRight className="text-[8px]" />
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-6">
            
            {/* Split Grid Layout (Asymmetric: News left (8 cols), Duyurular timeline right (4 cols)) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: News Tabbed Section (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                        <div>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20">
                                Güncel Paylaşımlar
                            </span>
                            <h2 className="font-heading text-2.5xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2.5">
                                Topluluğumuzdan Haberler
                            </h2>
                        </div>
                        
                        {/* Tab Buttons */}
                        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                            {( [
                                { id: 'news', label: 'Haberler', icon: <FaNewspaper /> },
                                { id: 'announcements', label: 'Duyurular', icon: <FaBullhorn /> },
                                { id: 'events', label: 'Etkinlikler', icon: <FaCalendarCheck /> },
                                { id: 'press', label: 'Basın', icon: <FaGlobe /> },
                            ] as const).map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-extrabold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-emerald/10 dark:bg-emerald/20 text-emerald-dark dark:text-emerald font-black'
                                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content Grid */}
                    <div>
                        {renderTabContent()}
                    </div>
                </div>

                {/* Right Side: Vertical Feed Duyurular (4 Cols) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm dark:shadow-black/10 rounded-3xl p-5 lg:sticky lg:top-24">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                        <h3 className="font-heading font-black text-sm text-slate-800 dark:text-slate-100 tracking-widest uppercase flex items-center gap-2">
                            <span className="w-1.5 h-3 bg-emerald rounded-full" />
                            Resmi Duyurular
                        </h3>
                        <Link 
                            to="/duyurular" 
                            className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 hover:text-emerald-dark dark:hover:text-emerald tracking-wider uppercase transition-colors"
                        >
                            Tümünü Gör
                        </Link>
                    </div>

                    {/* Timeline Vertical Marquee Ticker */}
                    <div className="h-[320px] overflow-hidden relative pl-3 mt-4">
                        {/* Timeline background vertical line */}
                        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-slate-200/60 dark:bg-slate-800/60 z-0" />

                        {announcements && announcements.length > 0 ? (
                            <div className="flex flex-col gap-4 animate-marquee-down z-10 relative py-2">
                                {/* Duplicate the array to ensure seamless infinite looping */}
                                {[...announcements, ...announcements].map((ann, idx) => {
                                    const { day, monthYear } = formatAnnouncementDate(ann.date || ann.created_at);
                                    return (
                                        <Link 
                                            key={`${ann.id}-${idx}`}
                                            to={ann.link || `/sayfa/${ann.slug || ''}`}
                                            className="bg-white hover:bg-slate-50/50 border border-slate-100/80 rounded-2xl p-2.5 shadow-sm hover:shadow-md hover:border-slate-200/50 flex items-center gap-3 transition-all duration-300 relative z-10 group dark:bg-slate-900 dark:border-slate-800/80 dark:hover:bg-slate-800/60 dark:hover:border-slate-700"
                                        >
                                            {/* Left timeline element: Small solid dark rectangle */}
                                            <div className="bg-slate-900 dark:bg-slate-800 group-hover:bg-primary-hover dark:group-hover:bg-emerald text-white dark:group-hover:text-slate-950 rounded-xl py-1.5 px-2 flex flex-col items-center justify-center min-w-[55px] h-[52px] flex-shrink-0 transition-colors duration-300">
                                                <span className="text-sm font-black leading-none">{day}</span>
                                                <span className="text-[7px] font-semibold uppercase tracking-wider text-slate-350 text-center mt-1">
                                                    {monthYear.split(' ')[0]}
                                                </span>
                                            </div>
                                            
                                            {/* Right: Title */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2 group-hover:text-emerald-dark dark:group-hover:text-emerald transition-colors">
                                                    {ann.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-150 text-xs">
                                Duyuru bulunamadı.
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
