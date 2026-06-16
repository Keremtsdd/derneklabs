import { useState, useRef } from 'react';
import { resolveImageUrl } from '../../services/api';

interface ImageUploadProps {
    currentImage?: string;
    onFileSelect: (file: File | null) => void;
    onClear?: () => void;
    /** Örn. "İkon" — Hızlı bağlantılar için; varsayılan: "Görsel" */
    label?: string;
}

export default function ImageUpload({ currentImage, onFileSelect, onClear, label = 'Görsel' }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onFileSelect(null);
        if (onClear) onClear();
        if (inputRef.current) inputRef.current.value = '';
    };

    const displaySrc = preview || (currentImage ? resolveImageUrl(currentImage) : null);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
                {displaySrc ? (
                    <div className="relative inline-block">
                        <img src={displaySrc} alt="Önizleme" className="max-h-40 rounded" />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="text-gray-400 py-4">
                        <span className="text-3xl block mb-1">📷</span>
                        <span className="text-sm">Görsel yüklemek için tıklayın</span>
                    </div>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </div>
    );
}
