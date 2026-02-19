import { useState } from 'react';
import { useAdminCollection } from '../../hooks/useAdmin';
import DataTable from '../../components/admin/DataTable';
import ImageUpload from '../../components/admin/ImageUpload';
import RichTextEditor from '../../components/admin/RichTextEditor';

interface PageItem {
    id: string;
    slug: string;
    title: string;
    summary: string;
    body: string;
    image: string;
    published: boolean;
}

export default function PagesAdmin() {
    const { items, isLoading, create, update, remove, isDeleting } = useAdminCollection<PageItem>('pages');
    const [editing, setEditing] = useState<PageItem | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({ slug: '', title: '', summary: '', body: '' });

    const openCreate = () => {
        setEditing(null);
        setFormData({ slug: '', title: '', summary: '', body: '' });
        setImageFile(null);
        setShowForm(true);
    };

    const openEdit = (item: PageItem) => {
        setEditing(item);
        setFormData({
            slug: item.slug,
            title: item.title,
            summary: item.summary || '',
            body: item.body || '',
        });
        setImageFile(null);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('slug', formData.slug);
        fd.append('title', formData.title);
        fd.append('summary', formData.summary);
        fd.append('body', formData.body);
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

    const columns = [
        { key: 'slug', label: 'Slug' },
        { key: 'title', label: 'Başlık' },
        { key: 'summary', label: 'Özet', render: (item: PageItem) => (item.summary || '').substring(0, 60) + (item.summary && item.summary.length > 60 ? '...' : '') },
    ];

    if (showForm) {
        return (
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-800 text-xl">←</button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {editing ? 'Sayfa Düzenle' : 'Yeni Sayfa'}
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="ornek-sayfa"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Özet</label>
                        <textarea
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">İçerik</label>
                        <div className="min-h-[400px]">
                            <RichTextEditor
                                value={formData.body}
                                onChange={(html) => setFormData({ ...formData, body: html })}
                                placeholder="Sayfa içeriğini buraya giriniz..."
                            />
                        </div>
                    </div>
                    <ImageUpload currentImage={editing?.image} onFileSelect={setImageFile} />
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
            title="Sayfalar"
            items={items}
            columns={columns}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={(id) => remove(id)}
            onCreate={openCreate}
            isDeleting={isDeleting}
        />
    );
}
