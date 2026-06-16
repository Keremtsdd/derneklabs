import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../services/api';
import type { Project } from '../../types';

interface ProjectCardProps {
    item: Project;
}

export default function ProjectCard({ item }: ProjectCardProps) {
    const href = item.link || `/projeler/${item.id}`;
    const isExternal = item.link?.startsWith('http');

    const content = (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group p-2">
            <div className="overflow-hidden rounded-xl h-48 relative">
                <img
                    src={resolveImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    PROJE
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h5 className="font-heading text-slate-800 font-extrabold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                    </h5>
                    {item.summary && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{item.summary}</p>
                    )}
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-primary transition-colors uppercase tracking-wider">
                    <span>Detayları İncele</span>
                    <span className="text-sm">→</span>
                </div>
            </div>
        </div>
    );

    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block" aria-label={item.title}>
                {content}
            </a>
        );
    }

    return (
        <Link to={href} className="block" aria-label={item.title}>
            {content}
        </Link>
    );
}
