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

// Modern input, textarea, and label class constants for premium SaaS aesthetic
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className={labelClass}>Site Adı</label>
                <input
                    type="text"
                    value={String(form.site_name ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>Site Açıklaması</label>
                <textarea
                    value={String(form.site_description ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, site_description: e.target.value }))}
                    rows={3}
                    className={inputClass}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <ImageUpload
                        label="Logo"
                        currentImage={String(form.logo ?? '')}
                        onFileSelect={setLogoFile}
                        onClear={() => setForm(f => ({ ...f, logo: '' }))}
                    />
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <ImageUpload
                        label="Favicon"
                        currentImage={String(form.favicon ?? '')}
                        onFileSelect={setFaviconFile}
                        onClear={() => setForm(f => ({ ...f, favicon: '' }))}
                    />
                </div>
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydediliyor...
                    </>
                ) : 'Ayarları Kaydet'}
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className={labelClass}>Adres</label>
                <textarea
                    value={String(form.address ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    rows={2}
                    className={inputClass}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Telefon</label>
                    <input
                        type="text"
                        value={String(form.phone ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>E-posta</label>
                    <input
                        type="email"
                        value={String(form.email ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputClass}
                    />
                </div>
            </div>
            <div>
                <label className={labelClass}>Harita embed kodu (HTML)</label>
                <textarea
                    value={String(form.map_embed ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, map_embed: e.target.value }))}
                    rows={4}
                    className={`${inputClass} font-mono text-xs`}
                    placeholder="<iframe ...></iframe>"
                />
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydediliyor...
                    </>
                ) : 'İletişim Bilgilerini Kaydet'}
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className={labelClass}>Meta Başlık</label>
                <input
                    type="text"
                    value={String(form.meta_title ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>Meta Açıklama</label>
                <textarea
                    value={String(form.meta_description ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                    rows={3}
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>Meta Anahtar Kelimeler</label>
                <input
                    type="text"
                    value={String(form.meta_keywords ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, meta_keywords: e.target.value }))}
                    className={inputClass}
                    placeholder="sivil toplum, dernek, vakıf, yardım, projeler"
                />
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <ImageUpload
                    label="OG Görsel (Sosyal Medya Paylaşımı)"
                    currentImage={String(form.og_image ?? '')}
                    onFileSelect={setOgFile}
                    onClear={() => setForm(f => ({ ...f, og_image: '' }))}
                />
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydediliyor...
                    </>
                ) : 'SEO Ayarlarını Kaydet'}
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <label className={labelClass}>SMTP Sunucu</label>
                    <input
                        type="text"
                        value={String(form.host ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
                        placeholder="smtp.example.com"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Port</label>
                    <input
                        type="text"
                        value={String(form.port ?? '587')}
                        onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))}
                        className={inputClass}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Kullanıcı Adı</label>
                    <input
                        type="text"
                        value={String(form.user ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, user: e.target.value }))}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Şifre</label>
                    <input
                        type="password"
                        value={String(form.password ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        className={inputClass}
                        autoComplete="off"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Gönderen E-posta</label>
                    <input
                        type="email"
                        value={String(form.from_email ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, from_email: e.target.value }))}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Gönderen Adı</label>
                    <input
                        type="text"
                        value={String(form.from_name ?? '')}
                        onChange={(e) => setForm((f) => ({ ...f, from_name: e.target.value }))}
                        className={inputClass}
                    />
                </div>
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydediliyor...
                    </>
                ) : 'SMTP Ayarlarını Kaydet'}
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className={labelClass}>Google Maps API Anahtarı</label>
                <input
                    type="text"
                    value={String(form.google_maps_key ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, google_maps_key: e.target.value }))}
                    className={inputClass}
                    placeholder="AIzaSy..."
                />
            </div>
            <div>
                <label className={labelClass}>Google Analytics ID</label>
                <input
                    type="text"
                    value={String(form.analytics_id ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, analytics_id: e.target.value }))}
                    className={inputClass}
                    placeholder="G-XXXXXXXXXX"
                />
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydediliyor...
                    </>
                ) : 'API Ayarlarını Kaydet'}
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <button
                    type="button"
                    role="switch"
                    aria-checked={!!form.enabled}
                    onClick={toggle}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${form.enabled ? 'bg-primary' : 'bg-slate-200'}`}
                >
                    <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${form.enabled ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>
                <div>
                    <label className="text-sm font-semibold text-slate-800 block">Bakım Modunu Etkinleştir</label>
                    <span className="text-xs text-slate-500">Etkinleştirildiğinde, ziyaretçiler sitenin bakımda olduğunu belirten mesajı göreceklerdir.</span>
                </div>
            </div>
            <div>
                <label className={labelClass}>Bakım Mesajı</label>
                <textarea
                    value={String(form.message ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={3}
                    className={inputClass}
                    placeholder="Sitemiz kısa bir süreliğine güncelleme çalışması nedeniyle bakımdadır. En kısa sürede tekrar yayında olacağız."
                />
            </div>
            <button type="submit" disabled={saving} className={submitButtonClass}>
                {saving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydediliyor...
                    </>
                ) : 'Bakım Ayarlarını Kaydet'}
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
            <div className="flex items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-500">Ayarlar yükleniyor...</span>
                </div>
            </div>
        );
    }

    const tabs = GROUPS.map((g) => ({ id: g.id, label: g.label, icon: <span>{g.icon}</span> }));

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-primary tracking-tight">Site Ayarları</h1>
                <p className="text-sm text-text-muted mt-1">Sivil toplum portalının genel ayarlarını, iletişim kanallarını, SEO yapılandırmalarını ve sistem durumunu buradan yönetin.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-6 md:p-8">
                <TabGroup tabs={tabs} defaultTabId="general">
                    {(activeId) => (
                        <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            {activeId === 'general' && <GeneralTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                            {activeId === 'contact' && <ContactTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                            {activeId === 'seo' && <SeoTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                            {activeId === 'smtp' && <SmtpTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                            {activeId === 'api' && <ApiTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                            {activeId === 'maintenance' && <MaintenanceTab data={allData} onSave={handleSave} saving={mutation.isPending} />}
                        </div>
                    )}
                </TabGroup>
            </div>
            <Toast message={toast.message} visible={showToast} onClose={closeToast} type={toast.type || 'success'} />
        </div>
    );
}
