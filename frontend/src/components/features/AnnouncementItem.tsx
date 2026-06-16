import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { formatDate } from '../../lib/utils';
import type { Announcement } from '../../types';

interface AnnouncementItemProps {
    item: Announcement;
}

export default function AnnouncementItem({ item }: AnnouncementItemProps) {
    return (
        <li className="border-b border-slate-100 last:border-0">
            <Link
                to={`/duyurular/${item.id}`}
                className="block py-4 px-2 hover:bg-slate-50/80 transition-all duration-200 rounded-2xl group"
                aria-label={`Duyuru: ${item.title}`}
            >
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-accent transition-colors leading-snug">
                        {item.title}
                    </p>
                    {item.summary && (
                        <p className="text-xs text-slate-500 line-clamp-1 leading-normal font-medium">{item.summary}</p>
                    )}
                    {item.date && (
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                            <FaClock className="text-[9px]" />
                            <time dateTime={item.date}>{formatDate(item.date)}</time>
                        </div>
                    )}
                </div>
            </Link>
        </li>
    );
}
