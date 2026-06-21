import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useCollections';
import { useSiteSettings } from '../hooks/useSiteSettings';
import NewsCard from '../components/features/NewsCard';
import SearchBar from '../components/layout/SearchBar';
import { resolveImageUrl } from '../services/api';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';

export default function News() {
    const { data: news, isLoading, error } = useNews();
    const { raw: settingsRaw } = useSiteSettings();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
 
    // Parse categories from settings or fallback to defaults
    const categories = (() => {
        const defaults = [
            { id: 'All', label: 'Tümü' },
            { id: 'Help', label: 'İnsani Yardım' },
            { id: 'Education', label: 'Eğitim & Gönüllülük' },
            { id: 'Environment', label: 'Çevre & Doğa' },
            { id: 'Business', label: 'Kadın & Girişimcilik' }
        ];
        if (!settingsRaw?.news_categories) return defaults;
        try {
            const parsed = typeof settingsRaw.news_categories === 'string'
                ? JSON.parse(settingsRaw.news_categories)
                : settingsRaw.news_categories;
            if (Array.isArray(parsed)) {
                return [{ id: 'All', label: 'Tümü' }, ...parsed];
            }
        } catch (e) {
            console.error('Failed to parse news_categories:', e);
        }
        return defaults;
    })();

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(categoryId);
    };

    // Filtreleme fonksiyonu
    const filteredNews = (news || []).filter((item: any) => {
        // Arama sorgusu
        const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = item.summary?.toLowerCase().includes(searchQuery.toLowerCase());
        const queryPass = titleMatch || descMatch;

        if (!queryPass) return false;

        // Kategori filtresi
        if (activeCategory === 'All') return true;
        
        const itemCategory = item.category_id || item.dynamicProperties?.category_id || item.category;
        return String(itemCategory || '').toLowerCase() === activeCategory.toLowerCase();
    });

    // Öne çıkan haber (Manşet)
    const featuredItem = filteredNews.length > 0 ? filteredNews[0] : null;
    const remainingNews = filteredNews.slice(1);

    const featuredReadTime = featuredItem ? Math.ceil((featuredItem.content?.length || featuredItem.summary?.length || 200) / 300) : 2;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-background transition-colors duration-300">
            {/* Breadcrumb & Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Haberler</span>
                </div>
                <Link to="/" className="text-xs font-bold text-slate-700 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-700 rounded-xl px-4 py-2 transition-all bg-white dark:bg-slate-900 shadow-sm cursor-pointer">
                    Geri Dön
                </Link>
            </div>

            {/* Header Jumbotron */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 text-white rounded-3xl p-8 md:p-10 mb-8 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-white/10 px-3 py-1 rounded-full border border-white/5">BASIN AÇIKLAMALARI</span>
                    <h1 className="font-heading text-2xl md:text-4xl font-extrabold mt-3 tracking-tight">Haberler & Faaliyet Duyuruları</h1>
                    <p className="text-slate-300 text-xs md:text-sm mt-2 font-medium">Sahadaki yardım operasyonlarımız, sosyal etkinliklerimiz ve güncel haberlerimizle toplumu bilgilendiriyoruz.</p>
                </div>
            </div>

            {/* Arama ve Kategori Filtreleme */}
            <div className="mb-8 space-y-4">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Haberlerde ara..."
                />
                
                {/* Kategori Filtre Hap Butonları */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
                                activeCategory === cat.id
                                    ? 'bg-primary text-white dark:text-slate-950 border-primary shadow-md'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                        >
                             {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <svg className="animate-spin h-8 w-8 text-emerald-600 mb-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Yükleniyor...</span>
                </div>
            )}

            {error && (
                <div className="text-center py-12 px-4 bg-rose-50 dark:bg-rose-955/20 rounded-2xl border border-rose-100 dark:border-rose-900/35 max-w-md mx-auto my-8">
                    <span className="text-3xl block mb-2">⚠️</span>
                    <p className="text-sm font-semibold text-rose-800 dark:text-rose-455">Haberler yüklenirken bir sorun oluştu.</p>
                </div>
            )}

            {!isLoading && !error && (
                filteredNews.length > 0 ? (
                    <div>
                        {/* 1. ÖNE ÇIKAN MANŞET HABER (EDİTORYAL DÜZEN) */}
                        {featuredItem && !searchQuery && activeCategory === 'All' && (
                            <div className="border-b border-slate-200 dark:border-slate-800/80 pb-10 md:pb-12">
                                <Link to={`/sayfa/${featuredItem.slug || ''}`} className="group block">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                        {/* Büyük Görsel */}
                                        {featuredItem.image && (
                                            <div className="lg:col-span-7 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm bg-slate-100 dark:bg-slate-900">
                                                <img
                                                    src={resolveImageUrl(featuredItem.image)}
                                                    alt={featuredItem.title}
                                                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
                                                />
                                            </div>
                                        )}
                                        {/* Detay Metinleri */}
                                        <div className="lg:col-span-5 space-y-4">
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                                                <span className="text-emerald-600 dark:text-emerald font-extrabold flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                                    ÖNE ÇIKAN HABER
                                                </span>
                                                {featuredItem.date && (
                                                    <span className="flex items-center gap-1">
                                                        <FaCalendarAlt />
                                                        {new Date(featuredItem.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald transition-colors">
                                                {featuredItem.title}
                                            </h2>
                                            {featuredItem.summary && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                    {featuredItem.summary}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 dark:text-slate-555 font-bold">
                                                <span className="flex items-center gap-1">
                                                    <FaClock />
                                                    {featuredReadTime} dk okuma
                                                </span>
                                                <span className="text-emerald-600 dark:text-emerald group-hover:translate-x-1.5 transition-transform font-bold flex items-center gap-1">
                                                    Devamını Oku <span className="text-sm">→</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* 2. DİĞER HABERLER (EDİTORYAL SATIR LISTESI) */}
                        <div className="space-y-2">
                            {(searchQuery || activeCategory !== 'All' ? filteredNews : remainingNews).map((item) => (
                                <NewsCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-400 dark:text-slate-550 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                        Yayınlanmış haber bulunmamaktadır.
                    </div>
                )
            )}

        </div>
    );
}
