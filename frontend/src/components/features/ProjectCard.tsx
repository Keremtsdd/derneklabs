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
        <div className="bg-transparent rounded-lg overflow-hidden group">
            <img
                src={resolveImageUrl(item.image)}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
            />
            <div className="pt-3">
                <h5 className="font-heading text-primary font-bold text-lg leading-snug group-hover:text-accent transition-colors">
                    {item.title}
                </h5>
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
