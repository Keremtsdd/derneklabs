import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaSave, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import MenuTreeContainer from '../../components/admin/menu/MenuTreeContainer';
import { removeItem, setProperty } from '../../components/admin/menu/utils';
import type { MenuItem } from '../../components/admin/menu/types';
import { fetchSettings, updateSettings } from '../../services/adminApi';
import Toast from '../../components/ui/Toast';

const DEFAULT_MENU_ITEMS: MenuItem[] = [
    {
        id: 'kurumsal',
        title: 'Kurumsal',
        url: '/sayfa/hakkimizda',
        children: [
            { id: 'hakkimizda', title: 'Hakkımızda', url: '/sayfa/hakkimizda', children: [] },
            { id: 'yonetim-kurulu', title: 'Yönetim Kurulu', url: '/sayfa/yonetim-kurulu', children: [] },
            { id: 'dernek-tuzugu', title: 'Dernek Tüzüğü', url: '/sayfa/dernek-tuzugu', children: [] },
            { id: 'gonulluluk', title: 'Gönüllülük', url: '/sayfa/gonulluluk', children: [] },
        ],
    },
    { id: 'haberler', title: 'Haberler', url: '/haberler', children: [] },
    { id: 'duyurular', title: 'Duyurular', url: '/duyurular', children: [] },
    { id: 'etkinlikler', title: 'Etkinlikler', url: '/etkinlikler', children: [] },
    { id: 'projeler', title: 'Projeler', url: '/projeler', children: [] },
    { id: 'iletisim', title: 'Destek Talebi', url: '/iletisim', children: [] },
];

// Helper: Serializes tree into nested items containing id, title, link, parent_id, sort_order
function serializeMenuTree(menuItems: MenuItem[], parentId: string | null = null): any[] {
    return menuItems.map((item, index) => {
        const children = Array.isArray(item.children) ? item.children : [];
        return {
            id: item.id,
            title: item.title,
            link: item.url, // SaaS format requirement
            url: item.url,  // Backwards compatibility for public pages
            parent_id: parentId,
            sort_order: index,
            children: serializeMenuTree(children, item.id)
        };
    });
}

export default function MenuManager() {
    const queryClient = useQueryClient();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'success' | 'error' }>({
        message: '',
        visible: false,
    });

    const { data: allData, isLoading } = useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => fetchSettings(),
    });

    const mutation = useMutation({
        mutationFn: (newItems: MenuItem[]) => {
            const serialized = serializeMenuTree(newItems);
            return updateSettings({ navbar_menu: serialized });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
            queryClient.invalidateQueries({ queryKey: ['public', 'settings'] });
            setToast({ message: 'Menü yapısı başarıyla kaydedildi.', visible: true, type: 'success' });
        },
        onError: (err: Error) => {
            setToast({ message: err.message || 'Kaydetme sırasında bir hata oluştu.', visible: true, type: 'error' });
        },
    });

    useEffect(() => {
        if (allData && allData.navbar_menu) {
            try {
                const menu = typeof allData.navbar_menu === 'string'
                    ? JSON.parse(allData.navbar_menu)
                    : allData.navbar_menu;

                const parseMenu = (list: any[]): MenuItem[] => {
                    if (!Array.isArray(list)) return [];
                    return list.map(item => ({
                        id: item.id || crypto.randomUUID(),
                        title: item.title || '',
                        url: item.url || item.link || '',
                        collapsed: !!item.collapsed,
                        children: parseMenu(item.children || [])
                    }));
                };

                setItems(Array.isArray(menu) ? parseMenu(menu) : DEFAULT_MENU_ITEMS);
            } catch (err) {
                console.error('Failed to parse navbar_menu from settings:', err);
                setItems(DEFAULT_MENU_ITEMS);
            }
        } else if (allData) {
            setItems(DEFAULT_MENU_ITEMS);
        }
    }, [allData]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newUrl.trim()) return;

        const newItem: MenuItem = {
            id: crypto.randomUUID(),
            title: newTitle.trim(),
            url: newUrl.trim(),
            children: [],
            collapsed: false,
        };

        setItems((prev) => [...prev, newItem]);
        setNewTitle('');
        setNewUrl('');
    };

    const handleRemove = (id: string) => {
        if (confirm('Bu menü öğesini ve varsa alt menülerini silmek istediğinize emin misiniz?')) {
            setItems((prev) => removeItem(prev, id));
        }
    };

    const handleUpdate = (id: string, updates: { title?: string; url?: string }) => {
        if (updates.title !== undefined) {
            setItems((prev) => setProperty(prev, id, 'title', () => updates.title ?? ''));
        }
        if (updates.url !== undefined) {
            setItems((prev) => setProperty(prev, id, 'url', () => updates.url ?? ''));
        }
    };

    const handleCollapse = (id: string) => {
        setItems((prev) => setProperty(prev, id, 'collapsed', (val) => !val));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <FaSpinner className="animate-spin text-3xl text-emerald-600" />
                <span className="text-sm font-medium text-slate-500">Menü yapısı yükleniyor...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Sidebar: Add Item & Save */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Yeni Bağlantı Ekle</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Menü Başlığı</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Örn: Hakkımızda"
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bağlantı URL'i</label>
                            <input
                                type="text"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="Örn: /hakkimizda veya https://..."
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newTitle.trim() || !newUrl.trim()}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaPlus className="text-xs" /> Listeye Ekle
                        </button>
                    </form>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <button
                            onClick={() => mutation.mutate(items)}
                            disabled={mutation.isPending}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? (
                                <>
                                    <FaSpinner className="animate-spin text-sm" /> Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <FaSave className="text-sm" /> Değişiklikleri Kaydet
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 p-4.5 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-800">
                        <div className="flex gap-2 font-bold mb-1.5">
                            <FaInfoCircle className="text-sm shrink-0" />
                            <span>Kullanım Rehberi:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1.5 pl-0.5 leading-relaxed">
                            <li>Öğeleri ☰ butonundan tutup sürükleyerek sıralayabilirsiniz.</li>
                            <li>Butonlar (🔼, 🔽) yardımıyla da yukarı/aşağı taşıyabilirsiniz.</li>
                            <li>Sağa kaydırarak (▶️) veya sağa sürükleyerek alt menü yapabilirsiniz.</li>
                            <li>Sola kaydırarak (◀️) veya sola sürükleyerek üst seviyeye çıkarabilirsiniz.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main: Drag Area */}
            <div className="flex-1">
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 min-h-[500px]">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Navigasyon Hiyerarşisi</h2>

                    {items.length > 0 ? (
                        <MenuTreeContainer
                            items={items}
                            setItems={setItems}
                            onRemove={handleRemove}
                            onUpdate={handleUpdate}
                            onCollapse={handleCollapse}
                        />
                    ) : (
                        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white select-none">
                            Henüz menü öğesi eklenmemiş. Soldaki formdan eklemeye başlayabilirsiniz.
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
