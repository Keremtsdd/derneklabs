import { useState } from 'react';
import { usePhotoGallery } from '../../hooks/useCollections';
import { resolveImageUrl } from '../../services/api';
import { FaTimes, FaChevronLeft, FaChevronRight, FaImage } from 'react-icons/fa';

export default function PhotoGalleryGrid() {
    const { data: photos, isLoading } = usePhotoGallery();
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const safePhotos = photos || [];

    const openLightbox = (idx: number) => {
        setSelectedIdx(idx);
    };

    const closeLightbox = () => {
        setSelectedIdx(null);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIdx === null || safePhotos.length === 0) return;
        setSelectedIdx(prev => (prev! - 1 + safePhotos.length) % safePhotos.length);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIdx === null || safePhotos.length === 0) return;
        setSelectedIdx(prev => (prev! + 1) % safePhotos.length);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-450 font-bold">
                Galeri yükleniyor...
            </div>
        );
    }

    if (safePhotos.length === 0) {
        return null; // Don't render if empty
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4 mb-8">
                <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20">
                        Faaliyet Alanlarımız
                    </span>
                    <h2 className="font-heading text-2.5xl font-black text-white tracking-tight mt-2.5">
                        Fotoğraf Galerisi
                    </h2>
                </div>
                <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                    <FaImage className="text-emerald" />
                    <span>Sahadan Kareler</span>
                </div>
            </div>

            {/* Premium Grid with hover overlays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {safePhotos.slice(0, 6).map((item, idx) => (
                    <div 
                        key={item.id}
                        onClick={() => openLightbox(idx)}
                        className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-white/5 shadow-lg cursor-pointer group"
                    >
                        <img
                            src={resolveImageUrl(item.image)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Interactive sliding overlay */}
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald mb-1">
                                Vakıf Galerisi
                            </span>
                            <h4 className="font-heading font-extrabold text-xs sm:text-sm text-white leading-snug transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {item.title}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedIdx !== null && (
                <div 
                    onClick={closeLightbox}
                    className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    {/* Close Button */}
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full cursor-pointer hover:scale-105 transition-all"
                        aria-label="Kapat"
                    >
                        <FaTimes size={18} />
                    </button>

                    {/* Navigation Buttons */}
                    <button 
                        onClick={handlePrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 p-3.5 rounded-full cursor-pointer hover:scale-105 transition-all"
                        aria-label="Önceki"
                    >
                        <FaChevronLeft size={16} />
                    </button>

                    <button 
                        onClick={handleNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 p-3.5 rounded-full cursor-pointer hover:scale-105 transition-all"
                        aria-label="Sonraki"
                    >
                        <FaChevronRight size={16} />
                    </button>

                    {/* Image and Title Container */}
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-4xl w-full flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300"
                    >
                        <div className="relative max-h-[75vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <img
                                src={resolveImageUrl(safePhotos[selectedIdx].image)}
                                alt={safePhotos[selectedIdx].title}
                                className="max-w-full max-h-[75vh] object-contain rounded-2xl"
                            />
                        </div>
                        <div className="text-center text-white max-w-xl">
                            <h3 className="font-heading font-extrabold text-sm sm:text-base tracking-wide uppercase text-slate-100">
                                {safePhotos[selectedIdx].title}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                                {selectedIdx + 1} / {safePhotos.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
