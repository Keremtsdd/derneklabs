import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaArrowUp, FaArrowDown, FaIndent, FaOutdent, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { FlatMenuItem } from './types';

interface SortableTreeItemProps {
    item: FlatMenuItem;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: { title?: string; url?: string }) => void;
    onCollapse: (id: string) => void;
    onMoveUp?: (id: string) => void;
    onMoveDown?: (id: string) => void;
    onIndent?: (id: string) => void;
    onOutdent?: (id: string) => void;
    depth: number;
    indentationWidth: number;
    isOverlay?: boolean;
    canIndent?: boolean;
    canOutdent?: boolean;
}

export function SortableTreeItem({
    item,
    onRemove,
    onUpdate,
    onCollapse,
    onMoveUp,
    onMoveDown,
    onIndent,
    onOutdent,
    depth,
    indentationWidth,
    isOverlay,
    canIndent = false,
    canOutdent = false,
}: SortableTreeItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        marginLeft: `${depth * indentationWidth}px`,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white border rounded-xl shadow-sm mb-3 group transition-shadow duration-205 ${
                isDragging ? 'opacity-30 border-2 border-dashed border-blue-400 bg-blue-50/50' : 'hover:shadow-md'
            } ${isOverlay ? 'shadow-xl rotate-1 scale-[1.02] cursor-grabbing border-blue-500 bg-blue-50' : ''}`}
        >
            {/* Header / Drag Handle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-t-xl border-b border-slate-100">
                <div className="flex items-center gap-3 flex-1">
                    {/* Drag Handle Icon */}
                    <div 
                        className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-200/60 rounded text-slate-400 hover:text-slate-600 transition-colors"
                        {...attributes} 
                        {...listeners}
                    >
                        <span className="text-lg select-none">☰</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-700 text-sm select-none">{item.title}</span>
                        <span className="text-xs text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs">({item.url})</span>
                    </div>
                </div>

                {/* Controls (Collapse, Nesting, Reordering, Remove) */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Manual Reordering Controls */}
                    {!isOverlay && (
                        <>
                            <button
                                type="button"
                                onClick={() => onMoveUp?.(item.id)}
                                className="p-1.5 hover:bg-slate-200/60 rounded text-slate-500 hover:text-slate-800 transition-colors"
                                title="Yukarı Taşı"
                            >
                                <FaArrowUp className="text-xs" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onMoveDown?.(item.id)}
                                className="p-1.5 hover:bg-slate-200/60 rounded text-slate-500 hover:text-slate-800 transition-colors"
                                title="Aşağı Taşı"
                            >
                                <FaArrowDown className="text-xs" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onIndent?.(item.id)}
                                disabled={!canIndent}
                                className={`p-1.5 rounded transition-colors ${
                                    canIndent 
                                        ? 'hover:bg-slate-200/60 text-slate-500 hover:text-slate-800' 
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title="İçeri Kaydır (Alt Menü Yap)"
                            >
                                <FaIndent className="text-xs" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onOutdent?.(item.id)}
                                disabled={!canOutdent}
                                className={`p-1.5 rounded transition-colors ${
                                    canOutdent 
                                        ? 'hover:bg-slate-200/60 text-slate-500 hover:text-slate-800' 
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title="Dışarı Kaydır (Üst Menü Yap)"
                            >
                                <FaOutdent className="text-xs" />
                            </button>
                        </>
                    )}

                    <div className="w-px h-5 bg-slate-200 mx-1"></div>

                    <button
                        type="button"
                        onClick={() => onCollapse(item.id)}
                        className="p-1.5 hover:bg-slate-200/60 rounded text-slate-500 hover:text-slate-800 transition-colors"
                        title={item.collapsed ? 'Detayları Göster' : 'Detayları Gizle'}
                    >
                        {item.collapsed ? <FaChevronDown className="text-xs" /> : <FaChevronUp className="text-xs" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-colors"
                        title="Öğeyi Sil"
                    >
                        <FaTrash className="text-xs" />
                    </button>
                </div>
            </div>

            {/* Body / Edit Form */}
            {!item.collapsed && (
                <div className="p-4 space-y-3 bg-white rounded-b-xl border-t border-slate-100/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Navigasyon Etiketi (Başlık)
                            </label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => onUpdate(item.id, { title: e.target.value })}
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Bağlantı URL'i
                            </label>
                            <input
                                type="text"
                                value={item.url}
                                onChange={(e) => onUpdate(item.id, { url: e.target.value })}
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
