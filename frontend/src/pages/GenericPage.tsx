import { useParams, Link } from 'react-router-dom';
import { usePageBySlug } from '../hooks/useCollections';
import { resolveImageUrl } from '../services/api';

export default function GenericPage() {
    const { slug = '' } = useParams<{ slug: string }>();
    const { data: page, isLoading, error } = usePageBySlug(slug);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center text-text-muted">
                    Yükleniyor...
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="max-w-7xl mx-auto px-4 pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <h1 className="font-heading text-primary text-xl font-bold mb-2">Sayfa Bulunamadı</h1>
                    <p className="text-text-muted text-sm mb-4">Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.</p>
                    <Link to="/" className="text-accent hover:underline font-medium text-sm">Ana Sayfa'ya Dön</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Breadcrumb */}
                <nav className="mb-4 text-sm">
                    <ol className="flex items-center gap-2">
                        <li><Link to="/" className="text-primary hover:text-accent">Ana Sayfa</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-text-muted">{page.title}</li>
                    </ol>
                </nav>

                <h1 className="font-heading text-primary text-2xl font-bold mb-4">{page.title}</h1>

                {page.image && (
                    <img
                        src={resolveImageUrl(page.image)}
                        alt={page.title}
                        className="w-full max-h-96 object-cover rounded-lg mb-6"
                    />
                )}

                {page.summary && (
                    <p className="text-primary font-heading font-bold text-lg mb-4 leading-relaxed">
                        {page.summary}
                    </p>
                )}

                {page.body && (
                    <div
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: page.body }}
                    />
                )}
            </div>
        </div>
    );
}
