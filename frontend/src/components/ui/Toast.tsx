import { useEffect } from 'react';

interface ToastProps {
    message: string;
    visible: boolean;
    onClose: () => void;
    type?: 'success' | 'error' | 'info';
    duration?: number;
}

export default function Toast({ message, visible, onClose, type = 'success', duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (!visible || duration <= 0) return;
        const t = setTimeout(onClose, duration);
        return () => clearTimeout(t);
    }, [visible, duration, onClose]);

    if (!visible) return null;

    const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';

    return (
        <div
            className="fixed top-4 right-4 z-[9999] max-w-sm animate-in slide-in-from-right-5 fade-in duration-300"
            role="alert"
        >
            <div className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
                {type === 'success' && <span className="text-lg">✓</span>}
                {type === 'error' && <span className="text-lg">✕</span>}
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
}
