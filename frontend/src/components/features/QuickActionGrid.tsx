import { useFastLinks } from '../../hooks/useCollections';
import { resolveImageUrl } from '../../services/api';

/** Statik fallback hızlı işlem linkleri */
const FALLBACK_LINKS = [
    { title: 'T.C No ile Ödeme', image: '/images/online-odeme42.png', link: '#' },
    { title: 'Afet Toplanma Alanı', image: '/images/afet-ve-acil-durum-toplanma-alani-sorgulama77182.png', link: '#' },
    { title: 'Fotoğraf Galeri', image: '/images/fotograf-galeri61051.png', link: '#' },
    { title: 'Çözüm Merkezi', image: '/images/istek-ve-sikayet598.png', link: '#' },
    { title: 'Kent Konseyi', image: '/images/bayrampasa-kent-konseyi75286.png', link: '#' },
    { title: 'E-Veteriner', image: '/images/e-veteriner66357.png', link: '#' },
    { title: 'İmar Durumu Sorgulama', image: '/images/hizli-islemler128.png', link: '#' },
    { title: 'Kent Bilgi Sistemi', image: '/images/cografi-bilgi-sistemi9881.png', link: '#' },
];

export default function QuickActionGrid() {
    const { data: fastLinks } = useFastLinks();

    const items = fastLinks && fastLinks.length > 0
        ? fastLinks.map((fl) => ({
            title: fl.title,
            image: resolveImageUrl(fl.image),
            link: fl.link || '#',
        }))
        : FALLBACK_LINKS;

    return (
        <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-heading text-primary font-bold text-lg mb-4">HIZLI İŞLEMLER</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {items.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:border-accent/30 hover:shadow-sm transition-all group"
                            aria-label={`Hızlı işlem: ${item.title}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 object-contain mb-2"
                                loading="lazy"
                            />
                            <h3 className="text-xs sm:text-sm text-primary font-heading font-bold text-center group-hover:text-accent transition-colors leading-tight">
                                {item.title}
                            </h3>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
