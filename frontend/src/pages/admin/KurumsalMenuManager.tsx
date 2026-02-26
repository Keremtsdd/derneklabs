import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from '../../components/ui/Toast';
import { fetchSettings, updateSettings } from '../../services/adminApi';

export interface MenuLink {
    title: string;
    url: string;
}

export interface SocialLink {
    label: string;
    url: string;
    icon: string;
}

export interface ContactInfo {
    address?: string;
    email?: string;
    phone?: string;
    fax?: string;
    kep?: string;
    uets?: string;
}

export interface KurumsalColumn {
    title: string;
    imageUrl?: string;
    imageCaption?: string;
    socialLinks?: SocialLink[];
    menuItems?: MenuLink[];
    mapEmbedUrl?: string;
    contact?: ContactInfo;
}

export interface KurumsalMegamenuData {
    column1: KurumsalColumn;
    column2: KurumsalColumn;
    column3: KurumsalColumn;
}

const DEFAULT_DATA: KurumsalMegamenuData = {
    column1: {
        title: 'Orhanpaşa Belediyesi',
        imageUrl: 'images/menu_baskan.png',
        imageCaption: 'Orhanpaşa Belediyesi Başkan V.',
        socialLinks: [
            { label: 'Twitter', url: 'https://x.com/Ibrahimakn', icon: 'twitter' },
            { label: 'Instagram', url: 'https://www.instagram.com/ibrahimakinbb/', icon: 'instagram' },
        ],
        menuItems: [
            { title: 'Hizmet Merkezleri', url: 'pages/hizmet-merkezleri.html' },
            { title: 'Belediye Başkan V.', url: 'pages/baskan.html' },
            { title: 'Başkan Yardımcıları', url: 'pages/baskan-yardimcilari.html' },
            { title: 'Koordinatörler', url: 'pages/koordinatorler.html' },
            { title: 'Belediye Meclisi', url: 'pages/meclis.html' },
            { title: 'Müdürlükler', url: 'pages/mudurlukler.html' },
            { title: 'Belediye Encümeni', url: 'pages/encumen.html' },
            { title: 'Organizasyon Şeması', url: 'pages/organizasyon-semasi.html' },
            { title: 'İç Denetim', url: 'pages/denetim.html' },
            { title: 'KVKK Bilgilendirmesi', url: 'pages/kvkk.html' },
        ],
    },
    column2: {
        title: 'Orhanpaşa',
        imageUrl: 'images/menu_belediye.jpg',
        menuItems: [
            { title: 'Orhanpaşa Hakkında', url: 'pages/about.html' },
            { title: 'Kent Konseyi', url: 'pages/kent-konseyi.html' },
            { title: 'Stratejik Plan ve Raporlar', url: 'pages/stratejik.html' },
            { title: 'Kurumsal Kimlik', url: 'pages/kurumsal-kimlik.html' },
            { title: 'Banka Hesap No', url: 'pages/banka-hesap-numarasi.html' },
            { title: 'Kamu Hizmeti Standartı', url: 'pages/kamuhizmet-standarti.html' },
            { title: 'Etik İlkeler', url: 'pages/etik-ilkeler.html' },
            { title: 'İletişim Bilgileri', url: 'pages/iletisim.html' },
        ],
    },
    column3: {
        title: 'İletişim',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6019.129994581453!2d28.912395!3d41.034772!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2f2f759065a8afbc!2sT.C%20Bayrampa%C5%9Fa%20Belediyesi!5e0!3m2!1str!2str!4v1625232148007!5m2!1str!2str',
        contact: {
            address: 'Yenidoğan Mahallesi Abdi İpekçi Caddesi No:2 Bayrampaşa/İstanbul/Türkiye',
            email: 'bayrampasa@bayrampasa.bel.tr',
            phone: '+90 212 467 19 00 / 444 1 990',
            fax: '+90 212 467 19 89',
            kep: 'bayrampasabelediyesi@hs01.kep.tr',
            uets: '35419-69147-33683',
        },
    },
};

function deepMerge<T>(target: T, source: Partial<T>): T {
    const out = { ...target };
    for (const key of Object.keys(source) as (keyof T)[]) {
        const v = source[key];
        if (v != null && typeof v === 'object' && !Array.isArray(v) && typeof (target as Record<string, unknown>)[key as string] === 'object') {
            (out as Record<string, unknown>)[key as string] = deepMerge(
                (target as Record<string, unknown>)[key as string] as object,
                v as object
            );
        } else if (v !== undefined) {
            (out as Record<string, unknown>)[key as string] = v;
        }
    }
    return out;
}

export default function KurumsalMenuManager() {
    const queryClient = useQueryClient();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [data, setData] = useState<KurumsalMegamenuData>(DEFAULT_DATA);
    const [activeTab, setActiveTab] = useState<'col1' | 'col2' | 'col3'>('col1');

    const { data: settings, isLoading } = useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => fetchSettings(),
    });

    const mutation = useMutation({
        mutationFn: (payload: KurumsalMegamenuData) => updateSettings({ kurumsal_megamenu: payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
            setToast({ message: 'Kurumsal menü kaydedildi.', type: 'success' });
        },
        onError: (err: Error) => {
            setToast({ message: err.message || 'Kaydetme hatası', type: 'error' });
        },
    });

    useEffect(() => {
        const raw = settings?.kurumsal_megamenu;
        if (raw && typeof raw === 'object' && raw !== null) {
            setData(deepMerge(DEFAULT_DATA, raw as Partial<KurumsalMegamenuData>));
        }
    }, [settings]);

    const handleSave = () => {
        mutation.mutate(data);
    };

    const updateColumn = (col: 'column1' | 'column2' | 'column3', field: keyof KurumsalColumn, value: unknown) => {
        setData((prev) => ({
            ...prev,
            [col]: { ...prev[col], [field]: value },
        }));
    };

    const updateContact = (field: keyof ContactInfo, value: string) => {
        setData((prev) => ({
            ...prev,
            column3: {
                ...prev.column3,
                contact: { ...(prev.column3.contact || {}), [field]: value },
            },
        }));
    };

    const addMenuItem = (col: 'column1' | 'column2') => {
        const list = data[col].menuItems || [];
        updateColumn(col, 'menuItems', [...list, { title: '', url: '' }]);
    };

    const updateMenuItem = (col: 'column1' | 'column2', index: number, field: 'title' | 'url', value: string) => {
        const list = [...(data[col].menuItems || [])];
        list[index] = { ...list[index], [field]: value };
        updateColumn(col, 'menuItems', list);
    };

    const removeMenuItem = (col: 'column1' | 'column2', index: number) => {
        const list = (data[col].menuItems || []).filter((_, i) => i !== index);
        updateColumn(col, 'menuItems', list);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Yükleniyor...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'col1' as const, label: '1. Sütun (Belediye)', icon: '🏛️' },
        { id: 'col2' as const, label: '2. Sütun (İlçe)', icon: '🏙️' },
        { id: 'col3' as const, label: '3. Sütun (İletişim)', icon: '📞' },
    ];

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kurumsal Menü Yönetimi</h1>
                    <p className="text-sm text-gray-500 mt-1">Navbar’da &quot;Kurumsal&quot; tıklandığında açılan mega menünün başlık ve menü yapısını buradan düzenleyin.</p>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    className="px-4 py-2 bg-[#0d2137] text-white rounded-lg hover:bg-[#0a1929] disabled:opacity-50"
                >
                    {mutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <div className="flex gap-2 mb-4 border-b border-gray-200">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        className={`px-4 py-2 rounded-t-lg text-sm font-medium ${activeTab === t.id ? 'bg-[#0d2137] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                {activeTab === 'col1' && (
                    <>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Sütun — Belediye</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={data.column1.title}
                                    onChange={(e) => updateColumn('column1', 'title', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                                <input
                                    type="text"
                                    value={data.column1.imageUrl || ''}
                                    onChange={(e) => updateColumn('column1', 'imageUrl', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="images/menu_baskan.png"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel alt yazı</label>
                                <input
                                    type="text"
                                    value={data.column1.imageCaption || ''}
                                    onChange={(e) => updateColumn('column1', 'imageCaption', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sosyal medya (URL)</label>
                                <div className="space-y-2">
                                    {(data.column1.socialLinks || []).map((s, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <span className="text-gray-500 w-24">{s.label}</span>
                                            <input
                                                type="url"
                                                value={s.url}
                                                onChange={(e) => {
                                                    const next = [...(data.column1.socialLinks || [])];
                                                    next[i] = { ...next[i], url: e.target.value };
                                                    updateColumn('column1', 'socialLinks', next);
                                                }}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Menü bağlantıları</label>
                                    <button type="button" onClick={() => addMenuItem('column1')} className="text-sm text-[#0d2137] hover:underline">+ Ekle</button>
                                </div>
                                <div className="space-y-2">
                                    {(data.column1.menuItems || []).map((item, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => updateMenuItem('column1', i, 'title', e.target.value)}
                                                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="Başlık"
                                            />
                                            <input
                                                type="text"
                                                value={item.url}
                                                onChange={(e) => updateMenuItem('column1', i, 'url', e.target.value)}
                                                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="URL"
                                            />
                                            <button type="button" onClick={() => removeMenuItem('column1', i)} className="text-red-600 text-sm">Sil</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'col2' && (
                    <>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Sütun — İlçe / Bölge</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={data.column2.title}
                                    onChange={(e) => updateColumn('column2', 'title', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                                <input
                                    type="text"
                                    value={data.column2.imageUrl || ''}
                                    onChange={(e) => updateColumn('column2', 'imageUrl', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Menü bağlantıları</label>
                                    <button type="button" onClick={() => addMenuItem('column2')} className="text-sm text-[#0d2137] hover:underline">+ Ekle</button>
                                </div>
                                <div className="space-y-2">
                                    {(data.column2.menuItems || []).map((item, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => updateMenuItem('column2', i, 'title', e.target.value)}
                                                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="Başlık"
                                            />
                                            <input
                                                type="text"
                                                value={item.url}
                                                onChange={(e) => updateMenuItem('column2', i, 'url', e.target.value)}
                                                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="URL"
                                            />
                                            <button type="button" onClick={() => removeMenuItem('column2', i)} className="text-red-600 text-sm">Sil</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'col3' && (
                    <>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">3. Sütun — İletişim</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={data.column3.title}
                                    onChange={(e) => updateColumn('column3', 'title', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harita embed URL (Google Maps)</label>
                                <input
                                    type="url"
                                    value={data.column3.mapEmbedUrl || ''}
                                    onChange={(e) => updateColumn('column3', 'mapEmbedUrl', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="https://www.google.com/maps/embed?..."
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {(['address', 'email', 'phone', 'fax', 'kep', 'uets'] as const).map((key) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {key === 'address' && 'Adres'}
                                            {key === 'email' && 'E-posta'}
                                            {key === 'phone' && 'Telefon'}
                                            {key === 'fax' && 'Faks'}
                                            {key === 'kep' && 'KEP Adresi'}
                                            {key === 'uets' && 'UETS Adresi'}
                                        </label>
                                        <input
                                            type={key === 'email' ? 'email' : 'text'}
                                            value={data.column3.contact?.[key] || ''}
                                            onChange={(e) => updateContact(key, e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
