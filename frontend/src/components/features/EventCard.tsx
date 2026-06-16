import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../services/api';
import { formatDate } from '../../lib/utils';
import type { Event } from '../../types';

interface EventCardProps {
    item: Event;
}

export default function EventCard({ item }: EventCardProps) {
    return (
        <Link
            to={`/etkinlikler/${item.id}`}
            className="block group"
            aria-label={`Etkinlik: ${item.title}`}
        >
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="overflow-hidden h-48 relative">
                    <img
                        src={resolveImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-accent text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        ETKİNLİK
                    </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <h5 className="font-heading text-slate-800 font-extrabold text-base leading-snug group-hover:text-accent transition-colors line-clamp-2">
                            {item.title}
                        </h5>
                        {item.summary && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{item.summary}</p>
                        )}
                    </div>
                    {item.date && (
                        <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-accent uppercase tracking-wider">
                            <span>📅</span>
                            <time dateTime={item.date}>{formatDate(item.date)}</time>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
