import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { formatDate } from '../../lib/utils';
import type { Announcement } from '../../types';

interface AnnouncementItemProps {
    item: Announcement;
}

export default function AnnouncementItem({ item }: AnnouncementItemProps) {
    return (
        <li className="border-b border-gray-100 last:border-0">
            <Link
                to={`/duyurular/${item.id}`}
                className="block py-3 px-1 hover:bg-gray-50 transition-colors rounded"
                aria-label={`Duyuru: ${item.title}`}
            >
                <p className="text-sm font-medium text-primary hover:text-accent transition-colors">
                    {item.title}
                </p>
                {item.date && (
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                        <FaClock className="text-[10px]" />
                        <time dateTime={item.date}>{formatDate(item.date)}</time>
                    </div>
                )}
            </Link>
        </li>
    );
}
