import { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaChevronUp, FaChevronDown, FaHeart } from 'react-icons/fa';
import { useBanners, useProjects } from '../../hooks/useCollections';
import { resolveImageUrl } from '../../services/api';
import { Link } from 'react-router-dom';

interface SlideItem {
    title: string;
    summary: string;
    image: string;
    date: string;
    link: string;
    videoUrl?: string;
    buttonText?: string;
    showButton?: boolean;
    showDonateButton?: boolean;
    slug?: string;
}

const FALLBACK_SLIDES: SlideItem[] = [
    {
        title: "BİRLİKTE DAHA FAZLASINI BAŞARABİLİRİZ",
        summary: "DernekWEB ile, kullanıcı dostu bir deneyim sunarken mobil uyumluluk ve yönetim paneli kolaylığı sayesinde her yaştan dernek yöneticisine hitap eden bir sistem sunuyoruz. Temamız sayesinde dijital dünyada görünürlüğünüzü artırabilir, destekçilerinize güven veren bir vitrin oluşturabilirsiniz.",
        image: "/images/kutuphanelerimiz4332.jpg",
        date: "16 Haziran 2026",
        link: "/sayfa/hakkimizda",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-group-of-people-raising-their-hands-in-a-volunteer-event-40019-large.mp4",
        buttonText: "Hakkımızda",
        slug: "birlikte-daha-fazlasini-basarabiliriz"
    },
    {
        title: "EĞİTİMDE FIRSAT EŞİTLİĞİ DESTEĞİ",
        summary: "Kırsal kesimde eğitim gören çocuklarımızın kırtasiye, kitap ve teknoloji ihtiyaçlarını karşılayarak eğitimde fırsat eşitliği yaratmayı hedefliyoruz. Geleceğimiz olan çocuklarımıza hep birlikte destek olalım.",
        image: "/images/30-0187541.jpg",
        date: "20 Haziran 2026",
        link: "/projeler",
        buttonText: "İncele",
        slug: "egitimde-firsat-esitligi"
    },
    {
        title: "GELECEĞİ BİRLİKTE İNŞA EDİYORUZ",
        summary: "Toplumsal kalkınmayı artıracak aktif proje operasyonlarımız, saha buluşmalarımız ve eğitim seminerlerimizle ihtiyaç sahiplerine sürdürülebilir yardım ulaştırıyoruz.",
        image: "/images/02-0287874.jpg",
        date: "24 Haziran 2026",
        link: "/projeler",
        buttonText: "Projelerimiz",
        slug: "gelecegi-birlikte-insa-ediyoruz"
    },
    {
        title: "KADIN GİRİŞİMCİLERİMİZE TAM DESTEK",
        summary: "Kadınların üretime katılımını artırmak, el emeği ürünlerini e-ticaret pazarlarına ulaştırmak ve ekonomik özgürlüklerini kazanmalarını sağlamak amacıyla kalkınma atölyemizi kurduk.",
        image: "/images/08-0186825.jpg",
        date: "28 Haziran 2026",
        link: "/projeler",
        buttonText: "Atölyeleri İncele",
        slug: "kirsal-kalkinma-kadin-emegi"
    }
];

export default function HeroSlider() {
    const { data: banners } = useBanners();
    const { data: projects } = useProjects();
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        } catch (e) {}
        return dateStr;
    };

    // Map dynamic banners from database or fallback, ensuring exactly 4 slides for preview
    const slides: SlideItem[] = (() => {
        let list: SlideItem[] = [];

        if (banners && banners.length > 0) {
            list = banners.map((b, i) => {
                const projectThumb = projects && projects[i] ? resolveImageUrl(projects[i].image) : resolveImageUrl(b.image);
                return {
                    title: b.title || "BİRLİKTE DAHA FAZLASINI BAŞARABİLİRİZ",
                    summary: b.summary || "Güçlü toplumlar, paylaşılan değerler ve şeffaf yardımlaşma ağları ile inşa edilir.",
                    image: resolveImageUrl(b.image) || projectThumb,
                    date: b.date || "16 Haziran 2026",
                    link: b.link || "/sayfa/hakkimizda",
                    videoUrl: i === 0 ? "https://assets.mixkit.co/videos/preview/mixkit-group-of-people-raising-their-hands-in-a-volunteer-event-40019-large.mp4" : undefined,
                    buttonText: b.dynamicProperties?.button_text || (b.title ? "İncele" : "Hakkımızda"),
                    showButton: b.dynamicProperties?.show_button !== undefined ? (b.dynamicProperties.show_button === true || b.dynamicProperties.show_button === '1' || b.dynamicProperties.show_button === 1) : true,
                    showDonateButton: b.dynamicProperties?.show_donate_button !== undefined ? (b.dynamicProperties.show_donate_button === true || b.dynamicProperties.show_donate_button === '1' || b.dynamicProperties.show_donate_button === 1) : true,
                    slug: b.slug
                };
            });
        } else if (projects && projects.length > 0) {
            list = projects.slice(0, 4).map((p, i) => ({
                title: p.title.toUpperCase(),
                summary: p.summary || "Aktif sosyal yardımlaşma ve dayanışma projemiz.",
                image: resolveImageUrl(p.image),
                date: p.date || "16 Haziran 2026",
                link: `/sayfa/${p.slug || ''}`,
                videoUrl: i === 0 ? "https://assets.mixkit.co/videos/preview/mixkit-group-of-people-raising-their-hands-in-a-volunteer-event-40019-large.mp4" : undefined,
                buttonText: "Projeyi İncele",
                showButton: true,
                showDonateButton: true,
                slug: p.slug
            }));
        }

        // Fill remaining slots with fallbacks if database has fewer than 4 entries
        if (list.length < 4) {
            const needed = 4 - list.length;
            const padding = FALLBACK_SLIDES.slice(list.length, list.length + needed);
            list = [...list, ...padding];
        }

        return list.slice(0, 4);
    })();

    const startTimer = () => {
        stopTimer();
        timerRef.current = setInterval(() => {
            setPrevIndex(activeIndex);
            setActiveIndex(prev => (prev + 1) % slides.length);
        }, 5000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [activeIndex, slides.length]);

    const handleNext = () => {
        stopTimer();
        setPrevIndex(activeIndex);
        setActiveIndex(prev => (prev + 1) % slides.length);
        startTimer();
    };

    const handlePrev = () => {
        stopTimer();
        setPrevIndex(activeIndex);
        setActiveIndex(prev => (prev - 1 + slides.length) % slides.length);
        startTimer();
    };

    const handleDotClick = (index: number) => {
        if (index === activeIndex) return;
        stopTimer();
        setPrevIndex(activeIndex);
        setActiveIndex(index);
        startTimer();
    };

    // Calculate vertical translation classes for the slides
    const getSlidePositionClass = (idx: number) => {
        if (idx === activeIndex) {
            return 'translate-y-0 opacity-100 z-10';
        }
        if (idx === prevIndex) {
            return 'translate-y-full opacity-0 z-0';
        }
        return '-translate-y-full opacity-0 z-0';
    };

    return (
        <div className="relative w-full h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden flex items-center justify-center bg-slate-950">
            {/* Slide Background Container */}
            {slides.map((slide, idx) => {
                const positionClass = getSlidePositionClass(idx);
                return (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${positionClass}`}
                    >
                        {slide.videoUrl ? (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src={slide.videoUrl} type="video/mp4" />
                                <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
                            </video>
                        ) : (
                            <img
                                src={slide.image}
                                className="w-full h-full object-cover"
                                alt={slide.title}
                            />
                        )}
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />
                    </div>
                );
            })}

            {/* Split Content Layer */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column (5 Cols): Fixed aspect ratio box containing absolutely positioned thumbnails to prevent jumpiness */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-sm lg:max-w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/40">
                            {slides.map((slide, idx) => {
                                const isActive = idx === activeIndex;
                                return (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${
                                            isActive 
                                                ? 'opacity-100 scale-100 translate-y-0 z-10' 
                                                : 'opacity-0 scale-95 translate-y-8 z-0 pointer-events-none'
                                        }`}
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                            loading="eager"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20">
                                                ÖNE ÇIKAN
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column (7 Cols): Date, Title, Slogan description, and Button */}
                    <div className="lg:col-span-7 text-left text-white flex flex-col items-start lg:pl-4 relative h-[360px] lg:h-[395px] justify-center">
                        {slides.map((slide, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <div
                                    key={idx}
                                    className={`w-full transition-all duration-700 ease-in-out transform absolute ${
                                        isActive 
                                            ? 'opacity-100 translate-y-0 z-10' 
                                            : 'opacity-0 translate-y-6 z-0 pointer-events-none'
                                    }`}
                                >
                                    {isActive && (
                                        <>
                                            {/* Dynamic Date Badge */}
                                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-200 mb-3">
                                                <FaCalendarAlt className="text-emerald" />
                                                <span>{formatDate(slide.date)}</span>
                                            </div>

                                            {/* Slogan / Main Heading */}
                                            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-4.5xl font-black leading-tight tracking-tight uppercase mb-3 text-white">
                                                {slide.title}
                                            </h1>

                                            {/* Slogan Description */}
                                            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-5 max-w-xl line-clamp-3">
                                                {slide.summary}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3 items-center">
                                                {slide.showButton !== false && (
                                                    <Link
                                                        to={slide.link}
                                                        className="px-5 py-2.5 bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-all shadow-lg cursor-pointer"
                                                    >
                                                        {slide.buttonText || "Hakkımızda"}
                                                    </Link>
                                                )}
                                                
                                                {slide.showDonateButton !== false && (
                                                    <Link
                                                        to="/destek"
                                                        className="px-5 py-2.5 bg-accent text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-accent-hover transition-all shadow-lg inline-flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <FaHeart className="text-[10px] text-white animate-pulse" />
                                                        BAĞIŞ YAP
                                                    </Link>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Replicated Vertical Navigation Indicators */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 hidden lg:flex z-20">
                <button 
                    onClick={handlePrev}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer p-1" 
                    aria-label="Önceki Slayt"
                >
                    <FaChevronUp size={12} />
                </button>
                
                {/* Vertical dot indicators with active dash height stretch */}
                <div className="flex flex-col gap-2 py-2 items-center">
                    {slides.map((_, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleDotClick(idx)}
                                className={`w-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    isActive ? 'bg-white h-6' : 'bg-white/40 h-1.5 hover:bg-white/70'
                                }`}
                                aria-label={`Slayt ${idx + 1}`}
                            />
                        );
                    })}
                </div>
                
                <button 
                    onClick={handleNext}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer p-1" 
                    aria-label="Sonraki Slayt"
                >
                    <FaChevronDown size={12} />
                </button>
            </div>
        </div>
    );
}
