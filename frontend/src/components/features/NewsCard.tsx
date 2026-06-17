import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../services/api';
import type { News } from '../../types';
import { FaCalendarAlt, FaShareAlt, FaClock } from 'react-icons/fa';
import { useState } from 'react';

interface NewsCardProps {
    item: News;
}

export default function NewsCard({ item }: NewsCardProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/sayfa/${item.slug || ''}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const readingTime = Math.ceil((item.content?.length || item.summary?.length || 200) / 300) || 2;
    const title = item.title;
    const summary = item.summary || '';

    return (
        <div className="relative group">
            <Link
                to={`/sayfa/${item.slug || ''}`}
                className="block border-b border-slate-100 dark:border-slate-800/60 py-6 md:py-8 transition-all duration-300 hover:bg-slate-50/60 dark:hover:bg-slate-900/60 px-4 rounded-3xl"
                aria-label={`Haber: ${title}`}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Sol Sütun (md:col-span-2): Tarih & Kategori */}
                    <div className="md:col-span-2 shrink-0 flex flex-row md:flex-col gap-3 md:gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-550 uppercase">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald font-extrabold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald" />
                            Haberler
                        </span>
                        {item.date && (
                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                                <FaCalendarAlt className="text-slate-355 dark:text-slate-500" />
                                {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {/* Orta Sütun (md:col-span-7): Başlık & Özet */}
                    <div className="md:col-span-7 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-heading text-slate-800 dark:text-slate-100 font-extrabold text-base md:text-lg leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald transition-colors duration-200 line-clamp-2">
                                {title}
                            </h3>
                            <span className="inline-block translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-emerald-700 dark:text-emerald text-base font-bold">
                                →
                            </span>
                        </div>
                        {summary && (
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                                {summary}
                            </p>
                        )}
                        
                        {/* Meta Bilgileri ve Hızlı Paylaş */}
                        <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-400 dark:text-slate-550 font-semibold">
                            <span className="flex items-center gap-1">
                                <FaClock className="text-slate-300 dark:text-slate-600" />
                                {readingTime} dk okuma
                            </span>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald transition-colors p-1 rounded hover:bg-slate-150 dark:hover:bg-slate-800 cursor-pointer"
                                title="Paylaş"
                            >
                                <FaShareAlt />
                                Paylaş
                            </button>
                        </div>
                    </div>

                    {/* Sağ Sütun (md:col-span-3): Görsel */}
                    <div className="md:col-span-3 w-full">
                        {item.image ? (
                            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm bg-slate-100 dark:bg-slate-900">
                                <img
                                    src={resolveImageUrl(item.image)}
                                    alt={title}
                                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            <div className="aspect-[16/10] w-full rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center text-slate-355 dark:text-slate-600 text-[11px] font-bold">
                                Görsel Bulunmuyor
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Paylaşıldı Toasti */}
            {copied && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-950/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/10 shadow-lg shadow-black/10 transition-all duration-300 z-50">
                    Bağlantı kopyalandı!
                </div>
            )}
        </div>
    );
}
