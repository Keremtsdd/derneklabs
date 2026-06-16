import { FaNewspaper, FaCalendarAlt, FaBullhorn, FaFile, FaArrowRight, FaHeart, FaUsers, FaGlobe, FaHandsHelping } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AtaturkQuote from '../components/features/AtaturkQuote';
import HeroSlider from '../components/features/HeroSlider';
import QuickActionGrid from '../components/features/QuickActionGrid';
import TabGroup from '../components/ui/TabGroup';
import Carousel from '../components/ui/Carousel';
import NewsCard from '../components/features/NewsCard';
import EventCard from '../components/features/EventCard';
import AnnouncementItem from '../components/features/AnnouncementItem';
import DocumentItem from '../components/features/DocumentItem';
import ProjectCard from '../components/features/ProjectCard';
import { useNews, useEvents, useAnnouncements, useDocuments, useProjects } from '../hooks/useCollections';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface StatItem {
    label: string;
    value: string;
    icon: string;
}

export default function Home() {
    const { data: news } = useNews();
    const { data: events } = useEvents();
    const { data: announcements } = useAnnouncements();
    const { data: documents } = useDocuments();
    const { data: projects } = useProjects();
    const { raw: settingsRaw } = useSiteSettings();

    const multimediaTabs = [
        { id: 'news', label: 'SON HABERLER', icon: <FaNewspaper /> },
        { id: 'events', label: 'ETKİNLİKLERİMİZ', icon: <FaCalendarAlt /> },
    ];

    const announcementTabs = [
        { id: 'announcements', label: 'BİLDİRİLER & DUYURULAR', icon: <FaBullhorn /> },
        { id: 'documents', label: 'BELGE ARŞİVİ', icon: <FaFile /> },
    ];

    // Read Hero Title and Subtitle dynamically from Settings DB
    const heroTitle = String(settingsRaw?.home_hero_title ?? "");
    const heroSubtitle = String(settingsRaw?.home_hero_subtitle ?? "");

    // Read Stats dynamically from Settings DB
    const statsData: StatItem[] = (() => {
        if (!settingsRaw?.home_stats) return [];
        try {
            const parsed = typeof settingsRaw.home_stats === 'string'
                ? JSON.parse(settingsRaw.home_stats)
                : settingsRaw.home_stats;
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.error('Failed to parse home_stats:', err);
            return [];
        }
    })();

    const renderStatIcon = (iconName: string) => {
        switch (iconName?.toLowerCase()) {
            case 'heart':
                return <FaHeart className="text-rose-500 text-3xl mb-3" />;
            case 'users':
                return <FaUsers className="text-emerald-500 text-3xl mb-3" />;
            case 'globe':
                return <FaGlobe className="text-sky-500 text-3xl mb-3" />;
            case 'hands':
            case 'handshelping':
            case 'hands-helping':
                return <FaHandsHelping className="text-amber-500 text-3xl mb-3" />;
            default:
                return <FaHeart className="text-rose-500 text-3xl mb-3" />;
        }
    };

    return (
        <div className="pt-6 pb-20 bg-[#F8FAFC]">

            
            {/* Hero Banner Slider */}
            <HeroSlider />

            {/* Premium STK Impact / Stats Section (100% Dynamic) */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="bg-[#0C1425] text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">ETKİMİZ VE HEDEFLERİMİZ</span>
                        {heroTitle ? (
                            <h2 className="font-heading text-2xl md:text-4xl font-extrabold mt-4 tracking-tight leading-tight">{heroTitle}</h2>
                        ) : (
                            <div className="h-10 bg-slate-800 animate-pulse rounded-lg mt-4 w-3/4 mx-auto" />
                        )}
                        {heroSubtitle ? (
                            <p className="text-slate-400 text-xs md:text-sm mt-3 font-medium leading-relaxed">{heroSubtitle}</p>
                        ) : (
                            <div className="h-6 bg-slate-800 animate-pulse rounded-lg mt-3 w-5/6 mx-auto" />
                        )}
                    </div>

                    {statsData.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            {statsData.map((stat, idx) => (
                                <div key={idx} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 text-center flex flex-col items-center justify-center">
                                    {renderStatIcon(stat.icon)}
                                    <span className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Atatürk Vecizesi */}
            <AtaturkQuote />

            {/* Hızlı İşlemler / Gönüllü Bağlantıları */}
            <QuickActionGrid />

            {/* Son Haberler & Etkinlikler */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 p-6 md:p-10 border border-slate-100">
                    <TabGroup tabs={multimediaTabs} defaultTabId="news">
                        {(activeId) => (
                            <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in duration-300">
                                {activeId === 'news' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-slate-800 font-extrabold text-lg md:text-xl uppercase tracking-tight">Güncel Gelişmeler</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">Vakıf faaliyetlerimiz ve sahadan en son haberler.</p>
                                            </div>
                                            <Link to="/haberler" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl">
                                                Tüm Haberler <FaArrowRight className="text-[10px]" />
                                            </Link>
                                        </div>
                                        <Carousel slidesPerView={4} showDots>
                                            {(news || []).slice(0, 8).map((item) => (
                                                <div key={item.id} className="p-2 h-full">
                                                    <NewsCard item={item} />
                                                </div>
                                            ))}
                                        </Carousel>
                                        {(!news || news.length === 0) && (
                                            <div className="text-center text-slate-400 py-12 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                📢 Henüz yayınlanmış haber bulunamadı.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeId === 'events' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-slate-800 font-extrabold text-lg md:text-xl uppercase tracking-tight">Yaklaşan Etkinlikler</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">Topluluk buluşmalarımız, seminerlerimiz ve saha operasyonlarımız.</p>
                                            </div>
                                            <Link to="/etkinlikler" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl">
                                                Etkinlik Takvimi <FaArrowRight className="text-[10px]" />
                                            </Link>
                                        </div>
                                        <Carousel slidesPerView={4} showDots>
                                            {(events || []).slice(0, 8).map((item) => (
                                                <div key={item.id} className="p-2 h-full">
                                                    <EventCard item={item} />
                                                </div>
                                            ))}
                                        </Carousel>
                                        {(!events || events.length === 0) && (
                                            <div className="text-center text-slate-400 py-12 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                📅 Yaklaşan etkinlik bulunmamaktadır.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </TabGroup>
                </div>
            </div>

            {/* Duyurular & Belgeler + Kampanya Slider */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 p-6 md:p-10 border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Duyurular & Belgeler Listesi */}
                        <div className="lg:col-span-2">
                            <TabGroup tabs={announcementTabs} defaultTabId="announcements">
                                {(activeId) => (
                                    <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in duration-300">
                                        {activeId === 'announcements' && (
                                            <div className="flex flex-col h-full justify-between">
                                                <ul className="space-y-1">
                                                    {(announcements || []).slice(0, 4).map((item) => (
                                                        <AnnouncementItem key={item.id} item={item} />
                                                    ))}
                                                    {(!announcements || announcements.length === 0) && (
                                                        <li className="py-8 text-center text-sm text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Duyuru bulunamadı.</li>
                                                    )}
                                                </ul>
                                                <div className="pt-4 border-t border-slate-50 mt-4">
                                                    <Link to="/duyurular" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl w-max">
                                                        Tüm Duyuruları Gör <FaArrowRight className="text-[9px]" />
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        {activeId === 'documents' && (
                                            <ul className="space-y-1">
                                                {(documents || []).slice(0, 5).map((item) => (
                                                    <DocumentItem key={item.id} item={item} />
                                                ))}
                                                {(!documents || documents.length === 0) && (
                                                    <li className="py-8 text-center text-sm text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Resmi rapor veya belge bulunamadı.</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </TabGroup>
                        </div>

                        {/* Kampanya / Tanıtım Görselleri */}
                        <div className="lg:col-span-3 flex flex-col justify-center">
                            <div className="rounded-2xl overflow-hidden border border-slate-100 p-2 bg-slate-50/50 shadow-inner">
                                <Carousel autoplay autoplayDelay={5000} loop showDots>
                                    {[
                                        '/images/31-1287298.jpg',
                                        '/images/31-1287728.jpg',
                                        '/images/08-0186825.jpg',
                                        '/images/31-1285071.jpg',
                                    ].map((src, i) => (
                                        <div key={i} className="rounded-xl overflow-hidden h-64 lg:h-[320px] relative group">
                                            <img
                                                src={src}
                                                alt={`Faaliyet Görseli ${i + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                                                <span className="text-white text-xs font-bold bg-emerald-600/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-emerald-500/10">Saha Faaliyetlerimiz</span>
                                            </div>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aktif STK Projelerimiz */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 p-6 md:p-10 border border-slate-100">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                        <div>
                            <h2 className="font-heading text-slate-800 font-extrabold text-xl md:text-2xl uppercase tracking-tight">Sosyal Projelerimiz</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Toplumsal kalkınmayı ve yardımlaşmayı artıracak aktif proje operasyonlarımız.</p>
                        </div>
                        <Link to="/projeler" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl">
                            Tüm Projelerimiz <span className="text-sm">→</span>
                        </Link>
                    </div>
                    
                    <Carousel slidesPerView={4} showDots>
                        {(projects || []).slice(0, 8).map((item) => (
                            <div key={item.id} className="p-2 h-full">
                                <ProjectCard item={item} />
                            </div>
                        ))}
                    </Carousel>
                    {(!projects || projects.length === 0) && (
                        <div className="text-center text-slate-400 py-12 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            🏗️ Aktif proje çalışması bulunamadı.
                        </div>
                    )}
                </div>
            </div>

            {/* Destekçiler / İşbirlikleri */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 p-6 border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Değerli Destekçilerimiz & Çözüm Ortaklarımız</p>
                    <div className="inline-block bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <img 
                            src="/images/logolar.jpg" 
                            alt="İşbirlikleri ve Destekçiler" 
                            className="inline-block max-w-full h-auto mix-blend-multiply opacity-85 hover:opacity-100 transition-opacity" 
                            loading="lazy" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
