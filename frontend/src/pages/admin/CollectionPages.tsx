import { useState } from 'react';
import { useAdminCollection } from '../../hooks/useAdmin';
import DataTable, { imageColumn } from '../../components/admin/DataTable';
import ImageUpload from '../../components/admin/ImageUpload';

interface CrudItem {
    [key: string]: unknown;
    id: string;
    title: string;
    summary?: string;
    date?: string;
    image?: string;
    link?: string;
    published?: boolean;
}

interface FieldConfig {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'url' | 'number' | 'checkbox';
    required?: boolean;
}

interface CollectionPageConfig {
    collection: string;
    title: string;
    fields: FieldConfig[];
    /** Görsel alanı etiketi (örn. "İkon"); Hızlı Bağlantılar için kullanılır */
    imageLabel?: string;
}

/** Genel CRUD sayfa fabrikası */
export function createCollectionPage(config: CollectionPageConfig) {
    return function CollectionPage() {
        const { items, isLoading, create, update, remove, isDeleting } = useAdminCollection<CrudItem>(config.collection);
        const [editing, setEditing] = useState<CrudItem | null>(null);
        const [showForm, setShowForm] = useState(false);
        const [imageFile, setImageFile] = useState<File | null>(null);
        const [formData, setFormData] = useState<Record<string, string>>({});

        const openCreate = () => {
            setEditing(null);
            const defaults: Record<string, string> = {};
            config.fields.filter((f) => f.type === 'checkbox').forEach((f) => { defaults[f.key] = '1'; });
            setFormData(defaults);
            setImageFile(null);
            setShowForm(true);
        };

        const openEdit = (item: CrudItem) => {
            setEditing(item);
            const data: Record<string, string> = {};
            config.fields.forEach((f) => {
                const raw = (item as Record<string, unknown>)[f.key];
                if (f.type === 'checkbox') {
                    data[f.key] = raw === 1 || raw === true || raw === '1' ? '1' : '0';
                } else {
                    data[f.key] = String(raw ?? '');
                }
            });
            setFormData(data);
            setImageFile(null);
            setShowForm(true);
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            const fd = new FormData();
            config.fields.forEach((f) => {
                fd.append(f.key, formData[f.key] || '');
            });
            if (imageFile) fd.append('image', imageFile);
            else if (editing?.image) fd.append('image', editing.image);

            if (editing) {
                await update({ id: editing.id, data: fd });
            } else {
                await create(fd);
            }
            setShowForm(false);
            setEditing(null);
        };

        const handleDelete = async (id: string) => {
            await remove(id);
        };

        const columns = [
            imageColumn<CrudItem>('image', config.imageLabel),
            { key: 'title', label: 'Başlık' },
            ...config.fields
                .filter((f) => f.key !== 'title' && f.key !== 'image')
                .slice(0, 3)
                .map((f) => ({ key: f.key, label: f.label })),
        ];

        if (showForm) {
            return (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-800 text-xl">←</button>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {editing ? 'Düzenle' : 'Yeni Ekle'} — {config.title}
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl space-y-5">
                        {config.fields.map((field) => (
                            <div key={field.key}>
                                {field.type === 'checkbox' ? (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData[field.key] === '1'}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked ? '1' : '0' })}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{field.label}</span>
                                    </label>
                                ) : (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                value={formData[field.key] || ''}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                required={field.required}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        ) : (
                                            <input
                                                type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
                                                value={formData[field.key] || ''}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                required={field.required}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        <ImageUpload currentImage={editing?.image} onFileSelect={setImageFile} label={config.imageLabel} />
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="px-6 py-2.5 bg-[#0d2137] text-white rounded-lg font-medium hover:bg-[#1a3a5c] transition-colors">
                                {editing ? 'Güncelle' : 'Oluştur'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <DataTable
                title={config.title}
                items={items}
                columns={columns}
                isLoading={isLoading}
                onEdit={openEdit}
                onDelete={handleDelete}
                onCreate={openCreate}
                isDeleting={isDeleting}
            />
        );
    };
}

// ─── Koleksiyon Sayfaları ───

export const NewsPage = createCollectionPage({
    collection: 'news',
    title: 'Haberler',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'summary', label: 'Özet', type: 'textarea' },
        { key: 'date', label: 'Tarih', type: 'date' },
        { key: 'link', label: 'Link', type: 'url' },
    ],
});

export const AnnouncementsPage = createCollectionPage({
    collection: 'announcements',
    title: 'Duyurular',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'summary', label: 'Özet', type: 'textarea' },
        { key: 'date', label: 'Tarih', type: 'date' },
        { key: 'link', label: 'Link', type: 'url' },
    ],
});

export const EventsPage = createCollectionPage({
    collection: 'events',
    title: 'Etkinlikler',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'summary', label: 'Özet', type: 'textarea' },
        { key: 'date', label: 'Tarih', type: 'text' },
        { key: 'link', label: 'Link', type: 'url' },
    ],
});

export const ProjectsPage = createCollectionPage({
    collection: 'projects',
    title: 'Projeler',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'summary', label: 'Özet', type: 'textarea' },
        { key: 'date', label: 'Tarih', type: 'date' },
        { key: 'link', label: 'Link', type: 'url' },
    ],
});

export const BannersPage = createCollectionPage({
    collection: 'banners',
    title: 'Banner / Slider',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text' },
        { key: 'link', label: 'Link', type: 'url' },
        { key: 'summary', label: 'Açıklama', type: 'textarea' },
    ],
});

export const FastLinksPage = createCollectionPage({
    collection: 'fast_links',
    title: 'Hızlı Bağlantılar',
    imageLabel: 'İkon',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'link', label: 'Bağlantı adresi (URL)', type: 'url', required: true },
        { key: 'sort_order', label: 'Sıra (küçük numara önce görünür)', type: 'number' },
        { key: 'published', label: 'Yayında göster', type: 'checkbox' },
    ],
});

export const DocumentsPage = createCollectionPage({
    collection: 'documents',
    title: 'Belgeler',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'link', label: 'Dosya Linki', type: 'url' },
        { key: 'date', label: 'Tarih', type: 'text' },
    ],
});
