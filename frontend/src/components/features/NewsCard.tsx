import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../services/api';
import type { News } from '../../types';

interface NewsCardProps {
    item: News;
}

export default function NewsCard({ item }: NewsCardProps) {
    return (
        <Link
            to={`/haberler/${item.id}`}
            className="block group"
            aria-label={`Haber: ${item.title}`}
        >
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="overflow-hidden h-48 relative">
                    <img
                        src={resolveImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        HABER
                    </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <h5 className="font-heading text-slate-800 font-extrabold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                        </h5>
                        {item.summary && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{item.summary}</p>
                        )}
                    </div>
                    {item.date && (
                        <div className="text-[10px] font-semibold text-slate-400 mt-4 uppercase tracking-wider">
                            {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
