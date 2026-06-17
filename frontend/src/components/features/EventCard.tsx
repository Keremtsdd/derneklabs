import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../services/api';
import type { Event } from '../../types';
import { FaMapMarkerAlt, FaCalendarDay, FaArrowRight } from 'react-icons/fa';

interface EventCardProps {
    item: Event;
}

export default function EventCard({ item }: EventCardProps) {
    const location = item.dynamicProperties?.location || 'Çukurca STK Gençlik Merkezi';
    const eventDate = item.dynamicProperties?.eventDate || item.date || 'Tarih Belirtilmedi';

    const title = item.title;
    const summary = item.summary || '';

    return (
        <Link
            to={`/sayfa/${item.slug || ''}`}
            className="block group h-full"
            aria-label={`Etkinlik: ${title}`}
        >
            <div className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-3 transition-all duration-300 h-full flex flex-col hover:shadow-xl dark:hover:shadow-black/20 hover:-translate-y-1">
                {/* Görsel Alanı */}
                <div className="overflow-hidden rounded-2xl h-52 relative bg-slate-200 dark:bg-slate-950">
                    <img
                        src={resolveImageUrl(item.image)}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                    />
                    
                    {/* Modern Rozet */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                        ETKİNLİK
                    </div>
                </div>

                {/* Metin İçeriği */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        {/* Tarih */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald">
                            <FaCalendarDay className="text-[11px]" />
                            <span>{eventDate}</span>
                        </div>

                        <h4 className="font-heading text-slate-800 dark:text-slate-100 font-extrabold text-base md:text-lg leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald transition-colors line-clamp-2">
                            {title}
                        </h4>
                        
                        {summary && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {summary}
                            </p>
                        )}
                    </div>

                    {/* Konum & Ok Butonu */}
                    <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-3 flex items-center justify-between gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-550 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        <span className="flex items-center gap-1 min-w-0">
                            <FaMapMarkerAlt className="text-emerald-500 shrink-0" />
                            <span className="truncate">{location}</span>
                        </span>
                        <span className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 group-hover:bg-primary dark:group-hover:bg-emerald group-hover:text-white dark:group-hover:text-slate-900 flex items-center justify-center transition-all shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                            <FaArrowRight className="text-[10px]" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
