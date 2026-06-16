import { useParams, Link } from 'react-router-dom';
import { usePageBySlug } from '../hooks/useCollections';
import { resolveImageUrl } from '../services/api';

export default function GenericPage() {
    const { slug = '' } = useParams<{ slug: string }>();
    const { data: page, isLoading, error } = usePageBySlug(slug);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-500">Sayfa yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="max-w-xl mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <span className="text-4xl block mb-2">⚠️</span>
                    <h1 className="font-heading text-slate-800 text-xl font-bold mb-2">Sayfa Bulunamadı</h1>
                    <p className="text-slate-555 text-xs mb-6">Aradığınız kurumsal sayfa mevcut değil veya taşınmış olabilir.</p>
                    <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl shadow hover:bg-slate-800 transition-colors">
                        Ana Sayfa'ya Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-[#F8FAFC]">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center justify-between">
                <nav className="text-xs font-semibold text-slate-400">
                    <ol className="flex items-center gap-2">
                        <li><Link to="/" className="hover:text-emerald-600 transition-colors">Ana Sayfa</Link></li>
                        <li>/</li>
                        <li className="text-slate-800 font-bold">{page.title}</li>
                    </ol>
                </nav>
                <Link to="/" className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-350 rounded-xl px-4 py-2 transition-all bg-white shadow-sm cursor-pointer">
                    ← Geri Dön
                </Link>
            </div>

            {/* Main Article Container */}
            <article className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 p-6 md:p-10 border border-slate-100 space-y-6">
                <header className="space-y-4">
                    <h1 className="font-heading text-slate-800 text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                        {page.title}
                    </h1>
                    {page.summary && (
                        <p className="text-slate-600 font-heading font-bold text-base md:text-lg leading-relaxed border-l-4 border-emerald-500 pl-4 py-1">
                            {page.summary}
                        </p>
                    )}
                </header>

                {page.image && (
                    <div className="rounded-2xl overflow-hidden shadow-md max-h-96 border border-slate-100">
                        <img
                            src={resolveImageUrl(page.image)}
                            alt={page.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {page.body && (
                    <div
                        className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed space-y-4
                            [&>p]:leading-relaxed [&>p]:mb-4
                            [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:my-4
                            [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:my-4
                            [&>h2]:text-lg [&>h2]:md:text-xl [&>h2]:font-extrabold [&>h2]:text-slate-800 [&>h2]:mt-6 [&>h2]:mb-3
                            [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-4 [&>h3]:mb-2"
                        dangerouslySetInnerHTML={{ __html: page.body }}
                    />
                )}
            </article>
        </div>
    );
}
