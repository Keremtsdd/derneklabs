import HeroSlider from '../components/features/HeroSlider';
import NewsAndDuyurular from '../components/features/NewsAndDuyurular';
import PhotoGalleryGrid from '../components/features/PhotoGalleryGrid';
import FaqAccordion from '../components/features/FaqAccordion';

export default function Home() {
    return (
        <div className="bg-background transition-colors duration-300">
            {/* 1. Full-Width Premium Slayt Alanı (Koyu Renk) */}
            <HeroSlider />

            {/* 2. Haberler & Duyurular Bölümü (Hafif Bej Arka Plan - Hero'yu Üstten Kavisli Kapatır) */}
            <section className="w-full bg-background -mt-12 md:-mt-16 relative z-20 rounded-t-[40px] md:rounded-t-[60px] pt-16 md:pt-24 pb-20 border-b border-slate-100/50 dark:border-slate-800/80 transition-colors duration-300">
                <NewsAndDuyurular />
            </section>

            {/* 3. Fotoğraf Galerisi Bölümü (Zengin Koyu Lacivert Arka Plan - Üstten ve Alttan Eğik Kesim) */}
            <section className="w-full bg-slate-900 dark:bg-slate-950 pt-28 pb-32 relative overflow-hidden transition-colors duration-300">
                {/* Üst Eğik Bölücü (News'ten Geçiş - fill-white) */}
                <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-[-1px] pointer-events-none">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[80px]">
                        <path d="M0,0 L1200,0 L0,120 Z" className="fill-background transition-colors duration-300"></path>
                    </svg>
                </div>

                {/* Arka Plan Dekoratif Blur Işıkları */}
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                
                <PhotoGalleryGrid />

                {/* Alt Eğik Bölücü (FAQ'e Geçiş - fill-slate-50) */}
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-[1px] pointer-events-none">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[80px]">
                        <path d="M1200,120 L0,120 L1200,0 Z" className="fill-slate-50 dark:fill-slate-900 transition-colors duration-300"></path>
                    </svg>
                </div>
            </section>

            {/* 4. Sıkça Sorulan Sorular Bölümü (Zengin Sıcak Keten Bej Arka Plan - Düz Bitiş) */}
            <section className="w-full bg-slate-50 dark:bg-slate-900 pt-20 pb-20 relative overflow-hidden transition-colors duration-300">
                <FaqAccordion />
            </section>
        </div>
    );
}
