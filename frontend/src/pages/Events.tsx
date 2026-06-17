import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useCollections';
import EventCard from '../components/features/EventCard';
import SearchBar from '../components/layout/SearchBar';

export default function Events() {
    const { data: events, isLoading, error } = useEvents();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEvents = (events || []).filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = item.summary?.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-background transition-colors duration-300">
            {/* Breadcrumb & Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Etkinlikler</span>
                </div>
                <Link to="/" className="text-xs font-bold text-slate-700 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-355 dark:hover:border-slate-750 rounded-xl px-4 py-2 transition-all bg-white dark:bg-slate-900 shadow-sm cursor-pointer">
                    Geri Dön
                </Link>
            </div>

            {/* Header Jumbotron */}
            <div className="bg-gradient-to-r from-[#0C1425] to-teal-900 text-white rounded-3xl p-8 md:p-10 mb-8 border border-slate-800 shadow-xl shadow-slate-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300 bg-white/10 px-3 py-1 rounded-full border border-white/5">ETKİNLİK TAKVİMİ</span>
                    <h1 className="font-heading text-2xl md:text-4xl font-extrabold mt-3 tracking-tight">Kültür, Eğitim ve Buluşma Etkinliklerimiz</h1>
                    <p className="text-slate-300 text-xs md:text-sm mt-2 font-medium">Toplumsal bağlarımızı güçlendirmek amacıyla düzenlediğimiz etkinlikleri takip edin, katılım sağlayın.</p>
                </div>
            </div>

            {/* Content Body */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/20 p-6 md:p-8 border border-slate-100 dark:border-slate-800/80">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Etkinliklerde ara..."
                />

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="animate-spin h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Yükleniyor...</span>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12 px-4 bg-rose-50 dark:bg-rose-955/20 rounded-2xl border border-rose-100 dark:border-rose-900/35 max-w-md mx-auto my-8">
                        <span className="text-3xl block mb-2">⚠️</span>
                        <p className="text-sm font-semibold text-rose-800 dark:text-rose-455">Etkinlikler yüklenirken bir sorun oluştu.</p>
                        <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">Lütfen sayfayı yenileyip tekrar deneyin.</p>
                    </div>
                )}

                {!isLoading && !error && (
                    filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredEvents.map((item) => (
                                <EventCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-slate-400 dark:text-slate-555 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            {searchQuery ? "Aramanızla eşleşen etkinlik bulunamadı." : "Yayınlanmış etkinlik bulunmamaktadır."}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
