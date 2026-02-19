import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FlatMenuItem } from './types';

interface SortableTreeItemProps {
    item: FlatMenuItem;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: { title?: string; url?: string }) => void;
    onCollapse: (id: string) => void;
    depth: number;
    indentationWidth: number;
    isOverlay?: boolean;
}

export function SortableTreeItem({
    item,
    onRemove,
    onUpdate,
    onCollapse,
    depth,
    indentationWidth,
    isOverlay,
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

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-4 mb-2"
            >
                <div className="font-bold">{item.title}</div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white border rounded-lg shadow-sm mb-2 group ${isOverlay ? 'shadow-xl rotate-2 cursor-grabbing' : ''
                }`}
        >
            {/* Header / Drag Handle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg border-b">
                <div className="flex items-center gap-3 flex-1 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                    <span className="text-gray-400">☰</span>
                    <span className="font-medium text-gray-700">{item.title}</span>
                    <span className="text-xs text-gray-400">({item.url})</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onCollapse(item.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 text-xs"
                    >
                        {item.collapsed ? '▼' : '▲'}
                    </button>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 hover:bg-red-100 text-red-500 rounded text-xs"
                        title="Sil"
                    >
                        🗑
                    </button>
                </div>
            </div>

            {/* Body / Edit Form */}
            {!item.collapsed && (
                <div className="p-4 space-y-3 bg-white rounded-b-lg">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Başlık</label>
                        <input
                            type="text"
                            value={item.title}
                            onChange={(e) => onUpdate(item.id, { title: e.target.value })}
                            className="w-full px-3 py-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                        <input
                            type="text"
                            value={item.url}
                            onChange={(e) => onUpdate(item.id, { url: e.target.value })}
                            className="w-full px-3 py-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
