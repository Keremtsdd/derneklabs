import { useFastLinks } from '../../hooks/useCollections';
import { resolveImageUrl } from '../../services/api';

/** Statik fallback hızlı işlem linkleri */
const FALLBACK_LINKS = [
    { title: 'Destek Ol / Bağış', image: '/images/online-odeme42.png', link: '/destek' },
    { title: 'Gönüllü Ol', image: '/images/fotograf-galeri61051.png', link: '/sayfa/gonulluluk' },
    { title: 'Destek Masası', image: '/images/istek-ve-sikayet598.png', link: '/iletisim' },
];

export default function QuickActionGrid() {
    const { data: fastLinks } = useFastLinks();

    const items = fastLinks && fastLinks.length > 0
        ? fastLinks.map((fl) => ({
            title: fl.title,
            image: resolveImageUrl(fl.image),
            link: fl.link || '#',
        }))
        : FALLBACK_LINKS.map(fl => ({
            title: fl.title,
            image: fl.image,
            link: fl.link
        }));

    return (
        <div className="max-w-7xl mx-auto px-4 mb-10">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/20 p-6 md:p-8 border border-slate-100 dark:border-slate-800/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2 border-b border-slate-50 dark:border-slate-800/60 pb-4">
                    <div>
                        <h2 className="font-heading text-primary dark:text-slate-100 font-extrabold text-xl md:text-2xl uppercase tracking-tight">HIZLI İŞLEMLER</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-455 mt-0.5">Sık gerçekleştirilen işlemlere buradan kolayca erişebilirsiniz.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                    {items.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="flex flex-col items-center p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-900 hover:border-primary/20 dark:hover:border-emerald hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                            aria-label={`Hızlı işlem: ${item.title}`}
                        >
                            <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-50 dark:border-slate-800 flex items-center justify-center p-2 mb-3 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-heading font-extrabold text-center group-hover:text-primary dark:group-hover:text-emerald transition-colors leading-tight px-1">
                                {item.title}
                            </h3>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
