import Carousel from '../ui/Carousel';
import { useBanners } from '../../hooks/useCollections';
import { resolveImageUrl } from '../../services/api';

/** Statik fallback slider görselleri */
const FALLBACK_SLIDES = [
    { image: '/images/02-0287874.jpg', alt: 'Geleceği Birlikte İnşa Ediyoruz' },
    { image: '/images/30-0187541.jpg', alt: 'Eğitimde Fırsat Eşitliği Desteği' },
];

export default function HeroSlider() {
    const { data: banners } = useBanners();

    const slides = banners && banners.length > 0
        ? banners.map((b) => ({ image: resolveImageUrl(b.image), alt: b.title || 'Banner' }))
        : FALLBACK_SLIDES;

    return (
        <div className="max-w-7xl mx-auto px-4 mb-10">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 p-2 md:p-3 border border-slate-100/80 overflow-hidden">
                <div className="rounded-2xl overflow-hidden relative">
                    <Carousel autoplay autoplayDelay={4500} loop showNav showDots>
                        {slides.map((slide, i) => (
                            <div key={i} className="relative w-full h-[250px] sm:h-[350px] md:h-[480px]">
                                <img
                                    src={slide.image}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover"
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                />
                                {/* Modern gradient overlay for slide captions */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-6 md:p-8 flex items-end">
                                    <div className="text-white max-w-2xl">
                                        <p className="text-[10px] md:text-xs font-extrabold text-primary-light uppercase tracking-widest bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full w-max mb-3 border border-white/10">
                                            DERNEK DUYURUSU
                                        </p>
                                        <h3 className="font-heading font-extrabold text-lg sm:text-xl md:text-3xl leading-tight text-white drop-shadow-md">
                                            {slide.alt}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
}
