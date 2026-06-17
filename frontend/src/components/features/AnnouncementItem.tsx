import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { formatDate } from '../../lib/utils';
import type { Announcement } from '../../types';

interface AnnouncementItemProps {
    item: Announcement;
}

export default function AnnouncementItem({ item }: AnnouncementItemProps) {
    const title = item.title;
    const summary = item.summary || '';

    return (
        <li className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
            <Link
                to={`/sayfa/${item.slug || ''}`}
                className="block py-4 px-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all duration-200 rounded-2xl group"
                aria-label={`Duyuru: ${title}`}
            >
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-accent dark:group-hover:text-emerald transition-colors leading-snug">
                        {title}
                    </p>
                    {summary && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal font-medium">{summary}</p>
                    )}
                    {item.date && (
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-550 mt-1 uppercase tracking-wider">
                            <FaClock className="text-[9px]" />
                            <time dateTime={item.date}>{formatDate(item.date)}</time>
                        </div>
                    )}
                </div>
            </Link>
        </li>
    );
}
