import { useState } from 'react';
import { useAdminCollection } from '../../hooks/useAdmin';
import DataTable, { imageColumn } from '../../components/admin/DataTable';
import ImageUpload from '../../components/admin/ImageUpload';
import Toast from '../../components/ui/Toast';
import { useSiteSettings } from '../../hooks/useSiteSettings';

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
    type: 'text' | 'textarea' | 'date' | 'url' | 'number' | 'checkbox' | 'select';
    required?: boolean;
    options?: { value: string; label: string }[];
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
        const { raw: settingsRaw } = useSiteSettings();
        const [editing, setEditing] = useState<CrudItem | null>(null);
        const [showForm, setShowForm] = useState(false);
        const [imageFile, setImageFile] = useState<File | null>(null);
        const [formData, setFormData] = useState<Record<string, string>>({});
        const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'success' | 'error' }>({ message: '', visible: false });

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
            if (imageFile) {
                fd.append('image', imageFile);
            } else if (editing) {
                fd.append('image', editing.image || '');
            }

            try {
                if (editing) {
                    await update({ id: editing.id, data: fd });
                    setToast({ message: 'Kayıt başarıyla güncellendi.', visible: true, type: 'success' });
                } else {
                    await create(fd);
                    setToast({ message: 'Kayıt başarıyla oluşturuldu.', visible: true, type: 'success' });
                }
                setShowForm(false);
                setEditing(null);
            } catch (err: any) {
                setToast({ message: err.message || 'Kayıt sırasında bir hata oluştu.', visible: true, type: 'error' });
            }
        };

        const handleDelete = async (id: string) => {
            if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
                try {
                    await remove(id);
                    setToast({ message: 'Kayıt başarıyla silindi.', visible: true, type: 'success' });
                } catch (err: any) {
                    setToast({ message: err.message || 'Silme işlemi sırasında hata oluştu.', visible: true, type: 'error' });
                }
            }
        };

        const columns = [
            imageColumn<CrudItem>('image', config.imageLabel),
            { key: 'title', label: 'Başlık' },
            ...config.fields
                .filter((f) => f.key !== 'title' && f.key !== 'image')
                .slice(0, 3)
                .map((f) => ({ key: f.key, label: f.label })),
        ];

        return (
            <>
                {showForm ? (
                    <div className="space-y-6 max-w-3xl">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-800 text-xl font-bold transition-colors">← Geri Dön</button>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {editing ? 'Düzenle' : 'Yeni Ekle'} — {config.title}
                            </h1>
                        </div>
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100/80 space-y-6">
                            {config.fields.map((field) => (
                                <div key={field.key}>
                                    {field.type === 'checkbox' ? (
                                        <label className="flex items-center gap-3.5 cursor-pointer py-1 select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData[field.key] === '1'}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked ? '1' : '0' })}
                                                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0 focus:ring-2"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                                        </label>
                                    ) : (
                                        <>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    value={formData[field.key] || ''}
                                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                    required={field.required}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                                                />
                                            ) : field.type === 'select' ? (
                                                <select
                                                    value={formData[field.key] || ''}
                                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                    required={field.required}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 bg-white"
                                                >
                                                    <option value="">Seçiniz...</option>
                                                    {field.key === 'category_id' ? (() => {
                                                        try {
                                                            const cats = typeof settingsRaw?.news_categories === 'string'
                                                                ? JSON.parse(settingsRaw.news_categories)
                                                                : settingsRaw?.news_categories;
                                                            if (Array.isArray(cats)) {
                                                                return cats.map((c: any) => (
                                                                    <option key={c.id} value={c.id}>{c.label}</option>
                                                                ));
                                                            }
                                                        } catch(e) {}
                                                        return [
                                                            { id: 'Help', label: 'İnsani Yardım' },
                                                            { id: 'Education', label: 'Eğitim & Gönüllülük' },
                                                            { id: 'Environment', label: 'Çevre & Doğa' },
                                                            { id: 'Business', label: 'Kadın & Girişimcilik' }
                                                        ].map(c => <option key={c.id} value={c.id}>{c.label}</option>);
                                                    })() : (field.options || []).map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
                                                    value={formData[field.key] || ''}
                                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                    required={field.required}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                            <ImageUpload currentImage={editing?.image} onFileSelect={setImageFile} onClear={() => { if (editing) setEditing({ ...editing, image: '' }); }} label={config.imageLabel || 'Görsel Seç'} />
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button type="submit" className="px-6 py-3 bg-[#0d2137] text-white rounded-xl font-semibold hover:bg-[#1a3a5c] transition-all shadow-md">
                                    {editing ? '💾 Değişiklikleri Kaydet' : '✨ Kayıt Oluştur'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 border border-slate-200 transition-all">
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
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
                )}
                <Toast
                    message={toast.message}
                    visible={toast.visible}
                    onClose={() => setToast((t) => ({ ...t, visible: false }))}
                    type={toast.type}
                />
            </>
        );
    };
}

// ─── Koleksiyon Sayfaları ───

export const NewsPage = createCollectionPage({
    collection: 'news',
    title: 'Haberler',
    fields: [
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'category_id', label: 'Haber Kategorisi', type: 'select', required: true },
        { key: 'summary', label: 'Özet', type: 'textarea' },
        { key: 'date', label: 'Tarih', type: 'date' },
        { key: 'link', label: 'Link (Opsiyonel)', type: 'url' },
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
    title: 'Hero Slider',
    fields: [
        { key: 'title', label: 'Slayt Başlığı', type: 'text' },
        { key: 'summary', label: 'Slayt Açıklaması', type: 'textarea' },
        { key: 'link', label: 'Buton 1 Yönlendirme Linki (URL)', type: 'url' },
        { key: 'button_text', label: 'Buton 1 Yazısı (Varsayılan: İncele)', type: 'text' },
        { key: 'show_button', label: 'Buton 1 Gösterilsin mi?', type: 'checkbox' },
        { key: 'show_donate_button', label: 'Bağış Yap Butonu Gösterilsin mi?', type: 'checkbox' },
    ],
});

export const PhotoGalleryPage = createCollectionPage({
    collection: 'photo-gallery',
    title: 'Fotoğraf Galerisi',
    fields: [
        { key: 'title', label: 'Görsel Başlığı / Açıklaması', type: 'text', required: true },
        { key: 'sort_order', label: 'Sıra No (Küçük önce görünür)', type: 'number' },
    ],
});

export const NoticesPage = createCollectionPage({
    collection: 'notices',
    title: 'Basın Açıklamaları',
    fields: [
        { key: 'title', label: 'Açıklama Başlığı', type: 'text', required: true },
        { key: 'summary', label: 'Kısa Özet', type: 'textarea' },
        { key: 'date', label: 'Yayın Tarihi', type: 'date' },
        { key: 'link', label: 'Basın Linki (Opsiyonel)', type: 'url' },
    ],
});

export function SupportTicketsPage() {
    const { items, isLoading, update, remove, isUpdating } = useAdminCollection<any>('support-tickets');
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'success' | 'error' }>({ message: '', visible: false });

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const result = await update({ id, data: { status: newStatus } });
            // Backend'den dönen veriyi frontend formatına eşle (adminApi'deki mapping'e benzer)
            const mappedResult = result ? {
                ...result,
                id: result.id,
                title: result.title,
                summary: result.shortDescription || '',
                content: result.content || '',
                date: result.dynamicProperties?.date || result.dynamicProperties?.eventDate || '',
                image: result.image || '',
                link: result.link || '',
                published: result.isActive,
                status: result.status
            } : null;

            if (mappedResult && selectedTicket?.id === id) {
                setSelectedTicket(mappedResult);
            }
            setToast({ message: 'Talep durumu başarıyla güncellendi.', visible: true, type: 'success' });
        } catch (err: any) {
            setToast({ message: err.message || 'Durum güncellenirken bir hata oluştu.', visible: true, type: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu destek talebini silmek istediğinize emin misiniz?')) {
            try {
                await remove(id);
                setToast({ message: 'Talep başarıyla silindi.', visible: true, type: 'success' });
                setSelectedTicket(null);
            } catch (err: any) {
                setToast({ message: err.message || 'Silme işlemi sırasında hata oluştu.', visible: true, type: 'error' });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-extrabold text-primary tracking-tight">Destek Talepleri & İletişim Mesajları</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-16 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
                            <p className="text-slate-500 text-sm">Talepler yükleniyor...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="p-16 text-center text-slate-500 text-sm">
                            📭 Henüz destek talebi bulunmuyor.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100">
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gönderen</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Konu</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item: any) => (
                                        <tr 
                                            key={item.id} 
                                            className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${selectedTicket?.id === item.id ? 'bg-slate-50' : ''}`}
                                            onClick={() => setSelectedTicket(item)}
                                        >
                                            <td className="px-6 py-4 text-xs font-bold text-slate-800 truncate max-w-[150px]">{item.userContact}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-600 truncate max-w-[200px]">{item.subject}</td>
                                            <td className="px-6 py-4 text-xs">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                                    item.status === 'Resolved' 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : item.status === 'Pending'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                        : 'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                    {item.status === 'Resolved' ? 'Çözüldü' : item.status === 'Pending' ? 'Bekliyor' : 'Açık'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-4">
                    <h3 className="font-heading text-slate-800 font-extrabold text-sm uppercase tracking-tight border-b border-slate-50 pb-2">Talep Detayları</h3>
                    {selectedTicket ? (
                        <div className="space-y-4 text-xs">
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gönderen</span>
                                <span className="font-bold text-slate-800 block p-2.5 bg-slate-50 rounded-xl border border-slate-100 select-all">{selectedTicket.userContact}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Konu</span>
                                <span className="font-bold text-slate-800 block p-2.5 bg-slate-50 rounded-xl border border-slate-100">{selectedTicket.subject}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mesaj</span>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">{selectedTicket.message}</div>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Talep Durumu</span>
                                <select
                                    value={selectedTicket.status}
                                    onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-slate-800 text-xs font-semibold cursor-pointer"
                                >
                                    <option value="Open">Açık (Yeni)</option>
                                    <option value="Pending">İşlemde (Bekliyor)</option>
                                    <option value="Resolved">Çözüldü (Tamamlandı)</option>
                                </select>
                            </div>
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <button
                                    onClick={() => handleDelete(selectedTicket.id)}
                                    className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 hover:text-rose-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                    Talebi Sil
                                </button>
                                <button
                                    onClick={() => handleStatusChange(selectedTicket.id, selectedTicket.status)}
                                    disabled={isUpdating}
                                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-200 disabled:opacity-50 disabled:shadow-none cursor-pointer"
                                >
                                    {isUpdating ? 'Güncelleniyor...' : 'Durumu Güncelle'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400 text-xs font-medium">
                            📝 Detayları görüntülemek ve durum güncellemek için soldan bir talep seçin.
                        </div>
                    )}
                </div>
            </div>
            <Toast
                message={toast.message}
                visible={toast.visible}
                onClose={() => setToast((t) => ({ ...t, visible: false }))}
                type={toast.type}
            />
        </div>
    );
}
