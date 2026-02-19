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
                    {item.date && (
                        <p className="text-xs text-text-muted mt-1">
                            <time dateTime={item.date}>{formatDate(item.date)}</time>
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
