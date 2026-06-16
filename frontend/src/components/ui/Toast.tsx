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

    const typeStyles = {
        success: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100',
        error: 'bg-rose-950/80 border-rose-500/30 text-rose-100',
        info: 'bg-slate-900/80 border-slate-700/30 text-slate-100',
    };
    const colors = typeStyles[type];

    return (
        <div
            className="fixed top-6 right-6 z-[9999] max-w-sm animate-in slide-in-from-right-5 fade-in duration-300"
            role="alert"
        >
            <div className={`${colors} backdrop-blur-md px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 font-semibold text-xs tracking-wide`}>
                {type === 'success' && <span className="text-emerald-400 text-base">✓</span>}
                {type === 'error' && <span className="text-rose-400 text-base">✕</span>}
                <span>{message}</span>
            </div>
        </div>
    );
}
