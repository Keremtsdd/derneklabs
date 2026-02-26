import Carousel from '../ui/Carousel';
import { useBanners } from '../../hooks/useCollections';
import { resolveImageUrl } from '../../services/api';

/** Statik fallback slider görselleri */
const FALLBACK_SLIDES = [
    { image: '/images/02-0287874.jpg', alt: 'Banner 1' },
    { image: '/images/30-0187541.jpg', alt: 'Banner 2' },
    { image: '/images/31-0187610.jpg', alt: 'Banner 3' },
    { image: '/images/31-0186733.jpg', alt: 'Banner 4' },
    { image: '/images/31-1283794.jpg', alt: 'Banner 5' },
];

export default function HeroSlider() {
    const { data: banners } = useBanners();

    const slides = banners && banners.length > 0
        ? banners.map((b) => ({ image: resolveImageUrl(b.image), alt: b.title || 'Banner' }))
        : FALLBACK_SLIDES;

    return (
        <div className="max-w-7xl mx-auto px-4 mb-6">
            <Carousel autoplay autoplayDelay={3500} loop showNav showDots>
                {slides.map((slide, i) => (
                    <img
                        key={i}
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-lg"
                        loading={i === 0 ? 'eager' : 'lazy'}
                    />
                ))}
            </Carousel>
        </div>
    );
}
