import { useState } from 'react';
import { resolveImageUrl } from '../../services/api';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
    title: string;
    items: T[];
    columns: Column<T>[];
    isLoading: boolean;
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
    isDeleting?: boolean;
}

export default function DataTable<T extends { id: string }>({
    title,
    items,
    columns,
    isLoading,
    onEdit,
    onDelete,
    onCreate,
    isDeleting,
}: DataTableProps<T>) {
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        if (deleteId === id) {
            onDelete(id);
            setDeleteId(null);
        } else {
            setDeleteId(id);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <button
                    onClick={onCreate}
                    className="px-4 py-2 bg-[#0d2137] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors text-sm font-medium"
                >
                    + Yeni Ekle
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Henüz kayıt yok</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                {columns.map((col) => (
                                    <th key={String(col.key)} className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                                        {col.label}
                                    </th>
                                ))}
                                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 w-36">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-700">
                                            {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isDeleting}
                                                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${deleteId === item.id
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    }`}
                                            >
                                                {deleteId === item.id ? 'Emin misin?' : 'Sil'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

/** Görsel/İkon kolonu için yardımcı */
export function imageColumn<T>(key: keyof T, columnLabel?: string) {
    return {
        key: key as string,
        label: columnLabel ?? 'Görsel',
        render: (item: T) => {
            const src = String((item as Record<string, unknown>)[key as string] || '');
            return src ? (
                <img src={resolveImageUrl(src)} alt="" className="w-12 h-12 object-cover rounded" />
            ) : (
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">Yok</div>
            );
        },
    };
}
