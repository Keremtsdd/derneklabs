import { useCallback, useEffect, useRef } from 'react';
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
    const dotsRef = useRef<number[]>([]);

    useEffect(() => {
        if (!emblaApi) return;
        dotsRef.current = emblaApi.scrollSnapList().map((_, i) => i);
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const slideWidth = `${100 / slidesPerView}%`;

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

            {showNav && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:text-accent transition-colors z-10"
                        aria-label="Önceki"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:text-accent transition-colors z-10"
                        aria-label="Sonraki"
                    >
                        <FaChevronRight />
                    </button>
                </>
            )}

            {showDots && emblaApi && (
                <div className="flex justify-center gap-1.5 mt-3">
                    {dotsRef.current.map((i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi.scrollTo(i)}
                            className={`w-3 h-1.5 rounded-full transition-all ${emblaApi.selectedScrollSnap() === i ? 'bg-accent w-6' : 'bg-gray-300'
                                }`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
