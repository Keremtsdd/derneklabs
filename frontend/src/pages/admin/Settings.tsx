import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TabGroup from '../../components/ui/TabGroup';
import Toast from '../../components/ui/Toast';
import ImageUpload from '../../components/admin/ImageUpload';
import { fetchSettings, updateSettings, uploadFile } from '../../services/adminApi';

const GROUPS = [
    { id: 'general', label: 'Genel Ayarlar', icon: '⚙️' },
    { id: 'contact', label: 'İletişim', icon: '📞' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'smtp', label: 'SMTP', icon: '📧' },
    { id: 'api', label: "API'ler", icon: '🔑' },
    { id: 'maintenance', label: 'Bakım Modu', icon: '🔧' },
] as const;

type GroupId = (typeof GROUPS)[number]['id'];

function useSettingsForm(group: GroupId, allData: Record<string, unknown> | undefined) {
    const prefix = `${group}_`;
    const initial: Record<string, string | boolean> = {};
    const defaults: Record<string, string | boolean> = {};

    if (group === 'general') {
        defaults.site_name = '';
        defaults.site_description = '';
        defaults.logo = '';
        defaults.favicon = '';
    } else if (group === 'contact') {
        defaults.address = '';
        defaults.phone = '';
        defaults.email = '';
        defaults.map_embed = '';
    } else if (group === 'seo') {
        defaults.meta_title = '';
        defaults.meta_description = '';
        defaults.meta_keywords = '';
        defaults.og_image = '';
    } else if (group === 'smtp') {
        defaults.host = '';
        defaults.port = '587';
        defaults.user = '';
        defaults.password = '';
        defaults.from_email = '';
        defaults.from_name = '';
    } else if (group === 'api') {
        defaults.google_maps_key = '';
        defaults.analytics_id = '';
    } else if (group === 'maintenance') {
        defaults.enabled = false;
        defaults.message = '';
    }

    if (allData) {
        for (const [k, v] of Object.entries(allData)) {
            if (k.startsWith(prefix)) {
                const field = k.slice(prefix.length);
                initial[field] = typeof v === 'boolean' ? v : String(v ?? '');
                if (defaults[field] === undefined) defaults[field] = initial[field];
            }
        }
    }
    Object.keys(defaults).forEach((k) => {
        if (initial[k] === undefined) initial[k] = defaults[k];
    });

    return { initial, defaults };
}

function GeneralTab({ data, onSave, saving }: { data: Record<string, unknown> | undefined; onSave: (s: Record<string, unknown>) => void; saving: boolean }) {
    const { initial } = useSettingsForm('general', data);
    const [form, setForm] = useState(initial);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Record<string, unknown> = {
            general_site_name: form.site_name,
            general_site_description: form.site_description,
            general_logo: form.logo,
            general_favicon: form.favicon,
        };
        if (logoFile) {
            const { url } = await uploadFile(logoFile);
            payload.general_logo = url;
        }
        if (faviconFile) {
            const { url } = await uploadFile(faviconFile);
            payload.general_favicon = url;
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Adı</label>
                <input
                    type="text"
                    value={String(form.site_name ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması</label>
                <textarea
                    value={String(form.site_description ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, site_description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <ImageUpload
                label="Logo"
                currentImage={String(form.logo ?? '')}
                onFileSelect={setLogoFile}
            />
            <ImageUpload
                label="Favicon"
                currentImage={String(form.favicon ?? '')}
                onFileSelect={setFaviconFile}
            />
            <button type="submit" disabled={saving} className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
        </form>
    );
}

function ContactTab({ data, onSave, saving }: { data: Record<string, unknown> | undefined; onSave: (s: Record<string, unknown>) => void; saving: boolean }) {
    const { initial } = useSettingsForm('contact', data);
    const [form, setForm] = useState(initial);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            contact_address: form.address,
            contact_phone: form.phone,
            contact_email: form.email,
            contact_map_embed: form.map_embed,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <textarea
                    value={String(form.address ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                    type="text"
                    value={String(form.phone ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                    type="email"
                    value={String(form.email ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harita embed kodu (HTML)</label>
                <textarea
                    value={String(form.map_embed ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, map_embed: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                    placeholder="<iframe ...></iframe>"
                />
            </div>
            <button type="submit" disabled={saving} className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
        </form>
    );
}

function SeoTab({ data, onSave, saving }: { data: Record<string, unknown> | undefined; onSave: (s: Record<string, unknown>) => void; saving: boolean }) {
    const { initial } = useSettingsForm('seo', data);
    const [form, setForm] = useState(initial);
    const [ogFile, setOgFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Record<string, unknown> = {
            seo_meta_title: form.meta_title,
            seo_meta_description: form.meta_description,
            seo_meta_keywords: form.meta_keywords,
            seo_og_image: form.og_image,
        };
        if (ogFile) {
            const { url } = await uploadFile(ogFile);
            payload.seo_og_image = url;
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Başlık</label>
                <input
                    type="text"
                    value={String(form.meta_title ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Açıklama</label>
                <textarea
                    value={String(form.meta_description ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Anahtar Kelimeler</label>
                <input
                    type="text"
                    value={String(form.meta_keywords ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, meta_keywords: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="kelime1, kelime2"
                />
            </div>
            <ImageUpload
                label="OG Görsel (sosyal paylaşım)"
                currentImage={String(form.og_image ?? '')}
                onFileSelect={setOgFile}
            />
            <button type="submit" disabled={saving} className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
        </form>
    );
}

function SmtpTab({ data, onSave, saving }: { data: Record<string, unknown> | undefined; onSave: (s: Record<string, unknown>) => void; saving: boolean }) {
    const { initial } = useSettingsForm('smtp', data);
    const [form, setForm] = useState(initial);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            smtp_host: form.host,
            smtp_port: form.port,
            smtp_user: form.user,
            smtp_password: form.password,
            smtp_from_email: form.from_email,
            smtp_from_name: form.from_name,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Sunucu</label>
                    <input
                        type="text"
                        value={String(form.host ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
                        placeholder="smtp.example.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                    <input
                        type="text"
                        value={String(form.port ?? '587')}
                        onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı</label>
                <input
                    type="text"
                    value={String(form.user ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, user: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <input
                    type="password"
                    value={String(form.password ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    autoComplete="off"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gönderen E-posta</label>
                <input
                    type="email"
                    value={String(form.from_email ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, from_email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gönderen Adı</label>
                <input
                    type="text"
                    value={String(form.from_name ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, from_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
            </div>
            <button type="submit" disabled={saving} className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
        </form>
    );
}

function ApiTab({ data, onSave, saving }: { data: Record<string, unknown> | undefined; onSave: (s: Record<string, unknown>) => void; saving: boolean }) {
    const { initial } = useSettingsForm('api', data);
    const [form, setForm] = useState(initial);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            api_google_maps_key: form.google_maps_key,
            api_analytics_id: form.analytics_id,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps API Anahtarı</label>
                <input
                    type="text"
                    value={String(form.google_maps_key ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, google_maps_key: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="AIza..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                <input
                    type="text"
                    value={String(form.analytics_id ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, analytics_id: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="G-XXXXXXXXXX"
                />
            </div>
            <button type="submit" disabled={saving} className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
        </form>
    );
}

function MaintenanceTab({ data, onSave, saving }: { data: Record<string, unknown> | undefined; onSave: (s: Record<string, unknown>) => void; saving: boolean }) {
    const { initial } = useSettingsForm('maintenance', data);
    const [form, setForm] = useState(initial);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            maintenance_enabled: form.enabled,
            maintenance_message: form.message,
        });
    };

    const toggle = () => setForm((f) => ({ ...f, enabled: !f.enabled }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    role="switch"
                    aria-checked={!!form.enabled}
                    onClick={toggle}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${form.enabled ? 'bg-accent' : 'bg-gray-200'}`}
                >
                    <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition-transform ${form.enabled ? 'translate-x-5' : 'translate-x-1'}`}
                        style={{ top: '2px' }}
                    />
                </button>
                <label className="text-sm font-medium text-gray-700">Bakım modu açık</label>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bakım mesajı</label>
                <textarea
                    value={String(form.message ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Site kısa süreliğine bakımdadır."
                />
            </div>
            <button type="submit" disabled={saving} className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
        </form>
    );
}

export default function Settings() {
    const queryClient = useQueryClient();
    const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'success' | 'error' }>({ message: '', visible: false });

    const { data: allData, isLoading } = useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => fetchSettings(),
    });

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
            setToast({ message: 'Ayarlar başarıyla güncellendi.', visible: true, type: 'success' });
        },
        onError: (err: Error) => {
            setToast({ message: err.message || 'Kayıt sırasında hata oluştu.', visible: true, type: 'error' });
        },
    });

    const handleSave = useCallback(
        (payload: Record<string, unknown>) => {
            mutation.mutate(payload);
        },
        [mutation]
    );

    const showToast = toast.visible;
    const closeToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="text-gray-500">Yükleniyor…</span>
            </div>
        );
    }

    const tabs = GROUPS.map((g) => ({ id: g.id, label: g.label, icon: <span>{g.icon}</span> }));

    return (
        <div>
            <h1 className="text-2xl font-bold text-primary mb-6">Site Ayarları</h1>
            <TabGroup tabs={tabs} defaultTabId="general">
                {(activeId) => (
                    <>
                        {activeId === 'general' && <GeneralTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                        {activeId === 'contact' && <ContactTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                        {activeId === 'seo' && <SeoTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                        {activeId === 'smtp' && <SmtpTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                        {activeId === 'api' && <ApiTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                        {activeId === 'maintenance' && <MaintenanceTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                    </>
                )}
            </TabGroup>
            <Toast message={toast.message} visible={showToast} onClose={closeToast} type={toast.type || 'success'} />
        </div>
    );
}
