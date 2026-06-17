import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { formatDate } from '../../lib/utils';
import type { Document as DocType } from '../../types';

interface DocumentItemProps {
    item: DocType;
}

export default function DocumentItem({ item }: DocumentItemProps) {
    const isExternal = item.link?.startsWith('http');

    const title = item.title;
    const summary = item.summary || '';

    const content = (
        <li className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
            <div className="py-4 px-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all duration-200 rounded-2xl group flex items-start gap-3">
                <span className="text-2xl select-none pt-0.5">📄</span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-emerald transition-colors leading-snug truncate">
                        {title}
                    </p>
                    {summary && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-normal">{summary}</p>
                    )}
                    {(item.date || item.created_at) && (
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-wider">
                            <FaClock className="text-[9px]" />
                            <time dateTime={item.date || item.created_at}>
                                {formatDate(item.date || item.created_at)}
                            </time>
                        </div>
                    )}
                </div>
                {isExternal && (
                    <span className="text-xs text-slate-400 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700 px-2 py-1 rounded-md ml-auto shrink-0 transition-colors uppercase tracking-wider">
                        Aç
                    </span>
                )}
            </div>
        </li>
    );

    if (isExternal) {
        return (
            <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`Belge: ${item.title}`} className="block">
                {content}
            </a>
        );
    }

    return (
        <Link to={`/belgeler/${item.id}`} aria-label={`Belge: ${item.title}`} className="block">
            {content}
        </Link>
    );
}
