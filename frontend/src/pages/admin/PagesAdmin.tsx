import { useState } from 'react';
import { useAdminCollection } from '../../hooks/useAdmin';
import DataTable from '../../components/admin/DataTable';
import ImageUpload from '../../components/admin/ImageUpload';
import RichTextEditor from '../../components/admin/RichTextEditor';
import Toast from '../../components/ui/Toast';

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
    const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'success' | 'error' }>({ message: '', visible: false });

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
        if (imageFile) {
            fd.append('image', imageFile);
        } else if (editing) {
            fd.append('image', editing.image || '');
        }

        try {
            if (editing) {
                await update({ id: editing.id, data: fd });
                setToast({ message: 'Sayfa başarıyla güncellendi.', visible: true, type: 'success' });
            } else {
                await create(fd);
                setToast({ message: 'Sayfa başarıyla oluşturuldu.', visible: true, type: 'success' });
            }
            setShowForm(false);
            setEditing(null);
        } catch (err: any) {
            setToast({ message: err.message || 'İşlem sırasında bir hata oluştu.', visible: true, type: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu sayfayı silmek istediğinize emin misiniz?')) {
            try {
                await remove(id);
                setToast({ message: 'Sayfa başarıyla silindi.', visible: true, type: 'success' });
            } catch (err: any) {
                setToast({ message: err.message || 'Silme işlemi sırasında hata oluştu.', visible: true, type: 'error' });
            }
        }
    };

    const columns = [
        { key: 'slug', label: 'Slug' },
        { key: 'title', label: 'Başlık' },
        { key: 'summary', label: 'Özet', render: (item: PageItem) => (item.summary || '').substring(0, 60) + (item.summary && item.summary.length > 60 ? '...' : '') },
    ];    return (
        <>
            {showForm ? (
                <div className="space-y-6 max-w-4xl">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-800 text-xl font-bold transition-colors">
                            ← Geri Dön
                        </button>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            {editing ? 'Sayfayı Düzenle' : 'Yeni Sayfa Oluştur'}
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100/80 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug / URL</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                                    placeholder="ornek-sayfa-adresi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sayfa Başlığı</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                                    placeholder="Sayfa Başlığı"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Özet / Kısa Açıklama</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                rows={2}
                                placeholder="Arama sonuçlarında görünecek kısa açıklama..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sayfa İçeriği</label>
                            <div className="min-h-[400px] border border-slate-200 rounded-xl overflow-hidden">
                                <RichTextEditor
                                    value={formData.body}
                                    onChange={(html) => setFormData({ ...formData, body: html })}
                                    placeholder="Sayfa içeriğini zengin metin düzenleyici ile buraya giriniz..."
                                />
                            </div>
                        </div>
                        <ImageUpload currentImage={editing?.image} onFileSelect={setImageFile} onClear={() => { if (editing) setEditing({ ...editing, image: '' }); }} label="Sayfa Görseli" />
                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button 
                                type="submit" 
                                className="px-6 py-3 bg-[#0d2137] text-white rounded-xl font-semibold hover:bg-[#1a3a5c] transition-all shadow-md"
                            >
                                {editing ? '💾 Sayfayı Güncelle' : '✨ Sayfa Oluştur'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowForm(false)} 
                                className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <DataTable
                    title="Sayfa Yönetimi"
                    items={items}
                    columns={columns}
                    isLoading={isLoading}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onCreate={openCreate}
                    isDeleting={isDeleting}
                />
            )}
            <Toast
                message={toast.message}
                visible={toast.visible}
                onClose={() => setToast((t) => ({ ...t, visible: false }))}
                type={toast.type}
            />
        </>
    );
}
