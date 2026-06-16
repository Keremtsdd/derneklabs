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
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter((item) => {
        return columns.some((col) => {
            const val = (item as any)[col.key];
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(searchQuery.toLowerCase());
        });
    });

    const handleDelete = (id: string) => {
        if (deleteId === id) {
            onDelete(id);
            setDeleteId(null);
        } else {
            setDeleteId(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
                <button
                    onClick={onCreate}
                    className="px-5 py-2.5 bg-[#0d2137] text-white rounded-xl hover:bg-[#1a3a5c] transition-all text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-1.5"
                >
                    ✨ Yeni Ekle
                </button>
            </div>

            {(items.length > 0 || searchQuery) && (
                <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-100/80 flex items-center gap-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tabloda ara..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-xs font-semibold text-slate-800"
                    />
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100/80">
                {isLoading ? (
                    <div className="p-16 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-slate-500 text-sm">Veriler yükleniyor...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 text-sm">
                        {searchQuery ? '🔍 Arama sonucuna uygun kayıt bulunamadı.' : '📭 Henüz kayıt bulunmuyor.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100">
                                    {columns.map((col) => (
                                        <th key={String(col.key)} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        {columns.map((col) => (
                                            <td key={String(col.key)} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                                                {col.render ? (
                                                    col.render(item)
                                                ) : col.key === 'published' ? (
                                                    (item as any)[col.key] ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                            Yayında
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                            Taslak
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="font-medium text-slate-800">
                                                        {String((item as Record<string, unknown>)[col.key as string] ?? '')}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="px-3.5 py-1.5 text-xs bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={isDeleting}
                                                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${deleteId === item.id
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
                    </div>
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
                <img src={resolveImageUrl(src)} alt="" className="w-10 h-10 object-cover rounded-xl border border-slate-100 shadow-sm" />
            ) : (
                <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">Yok</div>
            );
        },
    };
}
