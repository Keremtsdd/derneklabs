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
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                    src={resolveImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <div className="p-3">
                    <h5 className="font-heading text-primary font-bold text-base leading-snug group-hover:text-accent transition-colors line-clamp-2">
                        {item.title}
                    </h5>
                    {item.summary && (
                        <p className="text-sm text-text-muted mt-1 line-clamp-2">{item.summary}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
