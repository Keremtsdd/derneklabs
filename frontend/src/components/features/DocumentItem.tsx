import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { formatDate } from '../../lib/utils';
import type { Document as DocType } from '../../types';

interface DocumentItemProps {
    item: DocType;
}

export default function DocumentItem({ item }: DocumentItemProps) {
    const isExternal = item.link?.startsWith('http');

    const content = (
        <li className="border-b border-gray-100 last:border-0">
            <div className="py-3 px-1 hover:bg-gray-50 transition-colors rounded">
                <p className="text-sm font-medium text-primary hover:text-accent transition-colors">
                    {item.title}
                </p>
                {(item.date || item.created_at) && (
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                        <FaClock className="text-[10px]" />
                        <time dateTime={item.date || item.created_at}>
                            {formatDate(item.date || item.created_at)}
                        </time>
                    </div>
                )}
            </div>
        </li>
    );

    if (isExternal) {
        return (
            <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`Belge: ${item.title}`}>
                {content}
            </a>
        );
    }

    return (
        <Link to={`/belgeler/${item.id}`} aria-label={`Belge: ${item.title}`}>
            {content}
        </Link>
    );
}
