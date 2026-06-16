import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CarouselProps {
    children: React.ReactNode;
    slidesPerView?: number;
    autoplay?: boolean;
    autoplayDelay?: number;
    loop?: boolean;
    showNav?: boolean;
    showDots?: boolean;
    className?: string;
}

export default function Carousel({
    children,
    slidesPerView = 1,
    autoplay = false,
    autoplayDelay = 4000,
    loop = true,
    showNav = false,
    showDots = true,
    className = '',
}: CarouselProps) {
    const plugins = autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : [];
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop, align: 'start', slidesToScroll: 1 },
        plugins
    );
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const updateSnaps = useCallback(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    const activeSlidesPerView = (() => {
        if (windowWidth < 640) return 1.25; // Mobile-first swipe hint
        if (windowWidth < 1024) return 2.5;  // Tablet columns
        return slidesPerView;                // Desktop columns fallback
    })();

    useEffect(() => {
        if (!emblaApi) return;
        
        emblaApi.reInit();
        updateSnaps();

        emblaApi.on('select', updateSnaps);
        emblaApi.on('reInit', updateSnaps);

        return () => {
            emblaApi.off('select', updateSnaps);
            emblaApi.off('reInit', updateSnaps);
        };
    }, [emblaApi, children, updateSnaps, activeSlidesPerView]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const slideWidth = `${100 / activeSlidesPerView}%`;

    return (
        <div className={`relative ${className}`}>
            <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                    {Array.isArray(children)
                        ? children.map((child, i) => (
                            <div key={i} className="embla__slide px-1.5" style={{ flex: `0 0 ${slideWidth}` }}>
                                {child}
                            </div>
                        ))
                        : children}
                </div>
            </div>

            {showNav && scrollSnaps.length > 1 && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:text-accent transition-colors z-10 cursor-pointer"
                        aria-label="Önceki"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:text-accent transition-colors z-10 cursor-pointer"
                        aria-label="Sonraki"
                    >
                        <FaChevronRight />
                    </button>
                </>
            )}

            {showDots && scrollSnaps.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                    {scrollSnaps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className={`w-3 h-1.5 rounded-full transition-all cursor-pointer ${selectedIndex === i ? 'bg-accent w-6' : 'bg-gray-300'
                                }`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
