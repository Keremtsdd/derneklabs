import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../services/api';
import type { Project } from '../../types';
import { FaHeart, FaArrowRight } from 'react-icons/fa';

interface ProjectCardProps {
    item: Project;
}

export default function ProjectCard({ item }: ProjectCardProps) {
    const isExternal = item.link?.startsWith('http');
    const href = isExternal ? item.link : `/sayfa/${item.slug || ''}`;

    const title = item.title;
    const summary = item.summary || '';

    const cardContent = (
        <div className="relative h-[390px] rounded-[2rem] overflow-hidden border border-slate-100/80 dark:border-slate-800/80 shadow-sm shadow-slate-100/50 dark:shadow-black/20 bg-slate-50 dark:bg-slate-900 flex flex-col justify-end">
            {/* Arka Plan Görseli */}
            <div className="absolute inset-0">
                <img
                    src={resolveImageUrl(item.image)}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
                {/* Karartma Gradyanı */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            </div>

            {/* Üst Kısım: Proje Rozeti */}
            <div className="absolute top-4 left-4 bg-slate-950/85 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm z-10">
                AKTİF PROJE
            </div>

            {/* Yüzen İçerik Paneli */}
            <div className="relative z-10 m-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-800/60 shadow-lg dark:shadow-black/20 group-hover:-translate-y-1 transition-all duration-355 ease-out">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald flex items-center gap-1 mb-1">
                    <FaHeart className="text-[10px] shrink-0 animate-pulse" />
                    Sosyal Proje
                </span>
                
                <h4 className="font-heading text-slate-800 dark:text-slate-100 font-extrabold text-sm md:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald transition-colors">
                    {title}
                </h4>
                
                {summary && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {summary}
                    </p>
                )}
                
                {/* Alt Aksiyon Çizgisi */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] font-extrabold text-slate-400 dark:text-slate-550 group-hover:text-emerald-700 dark:group-hover:text-emerald transition-colors uppercase tracking-widest">
                    <span>Detayları İncele</span>
                    <span className="w-5 h-5 rounded-full bg-slate-900/5 dark:bg-slate-800 group-hover:bg-primary dark:group-hover:bg-emerald group-hover:text-white dark:group-hover:text-slate-900 flex items-center justify-center transition-all">
                        <FaArrowRight className="text-[8px]" />
                    </span>
                </div>
            </div>
        </div>
    );

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block group h-full"
                aria-label={`Proje: ${title}`}
            >
                {cardContent}
            </a>
        );
    }

    return (
        <Link
            to={href}
            className="block group h-full"
            aria-label={`Proje: ${title}`}
        >
            {cardContent}
        </Link>
    );
}
