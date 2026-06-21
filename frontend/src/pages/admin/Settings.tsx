import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from '../../components/ui/Toast';
import { fetchSettings, updateSettings } from '../../services/adminApi';

import GeneralTab from './settings/GeneralTab';
import HeaderTab from './settings/HeaderTab';
import ContactTab from './settings/ContactTab';
import FooterTab from './settings/FooterTab';
import CategoriesTab from './settings/CategoriesTab';
import FaqTab from './settings/FaqTab';
import AracCubuguTab from './settings/AracCubuguTab';

// Shared hook to manage fetching and saving settings
function useSettingsData() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => fetchSettings(),
    });

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
        },
    });

    return {
        data,
        isLoading,
        save: mutation.mutate,
        saving: mutation.isPending,
        error: mutation.error,
    };
}

// Wrapper component to apply standard layout, loading spinner and toast
function SettingsPageWrapper({ 
    title, 
    description, 
    isLoading, 
    error,
    onToastClose,
    isToastVisible,
    toastMessage,
    toastType,
    children 
}: { 
    title: string; 
    description: string; 
    isLoading: boolean; 
    error: Error | null;
    onToastClose: () => void;
    isToastVisible: boolean;
    toastMessage: string;
    toastType?: 'success' | 'error';
    children: React.ReactNode;
}) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-500">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-primary tracking-tight">{title}</h1>
                <p className="text-sm text-text-muted mt-1">{description}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-6 md:p-8">
                {children}
            </div>

            <Toast 
                message={error?.message || toastMessage} 
                visible={isToastVisible || !!error} 
                onClose={onToastClose} 
                type={error ? 'error' : toastType} 
            />
        </div>
    );
}

// ─── Individual Page Components ───

export function LogoBaslikPage() {
    const { data, isLoading, save, saving, error } = useSettingsData();
    const [toastShow, setToastShow] = useState(false);

    const handleSave = (payload: Record<string, unknown>) => {
        save(payload, {
            onSuccess: () => setToastShow(true),
        });
    };

    return (
        <SettingsPageWrapper
            title="Logo & Başlık Ayarları"
            description="Sivil toplum portalının logo, favicon, site adı ve alt başlığını buradan yönetin."
            isLoading={isLoading}
            error={error as Error | null}
            isToastVisible={toastShow}
            toastMessage="Logo ve başlık ayarları başarıyla güncellendi."
            toastType="success"
            onToastClose={() => setToastShow(false)}
        >
            <GeneralTab data={data} onSave={handleSave} saving={saving} />
        </SettingsPageWrapper>
    );
}

export function UstMenuPage() {
    const { data, isLoading, save, saving, error } = useSettingsData();
    const [toastShow, setToastShow] = useState(false);

    const handleSave = (payload: Record<string, unknown>) => {
        save(payload, {
            onSuccess: () => setToastShow(true),
        });
    };

    return (
        <SettingsPageWrapper
            title="Üst Menü & Sosyal Medya Ayarları"
            description="Üst bar telefon numarası, WhatsApp destek ve sosyal medya hesap linklerinizi yönetin."
            isLoading={isLoading}
            error={error as Error | null}
            isToastVisible={toastShow}
            toastMessage="Üst menü ve sosyal medya ayarları başarıyla güncellendi."
            toastType="success"
            onToastClose={() => setToastShow(false)}
        >
            <HeaderTab data={data} onSave={handleSave} saving={saving} />
        </SettingsPageWrapper>
    );
}

export function IletisimAyarlariPage() {
    const { data, isLoading, save, saving, error } = useSettingsData();
    const [toastShow, setToastShow] = useState(false);

    const handleSave = (payload: Record<string, unknown>) => {
        save(payload, {
            onSuccess: () => setToastShow(true),
        });
    };

    return (
        <SettingsPageWrapper
            title="İletişim & Harita Ayarları"
            description="İletişim bilgilerini ve Google Maps konum haritası iframe kodunu buradan düzenleyin."
            isLoading={isLoading}
            error={error as Error | null}
            isToastVisible={toastShow}
            toastMessage="İletişim ve harita ayarları başarıyla güncellendi."
            toastType="success"
            onToastClose={() => setToastShow(false)}
        >
            <ContactTab data={data} onSave={handleSave} saving={saving} />
        </SettingsPageWrapper>
    );
}

export function FooterAyarlariPage() {
    const { data, isLoading, save, saving, error } = useSettingsData();
    const [toastShow, setToastShow] = useState(false);

    const handleSave = (payload: Record<string, unknown>) => {
        save(payload, {
            onSuccess: () => setToastShow(true),
        });
    };

    return (
        <SettingsPageWrapper
            title="Footer & Copyright Yönetimi"
            description="Footer alanı açıklaması, logo altı yazısı ve copyright telif hakkı metnini yönetin."
            isLoading={isLoading}
            error={error as Error | null}
            isToastVisible={toastShow}
            toastMessage="Footer ve copyright ayarları başarıyla güncellendi."
            toastType="success"
            onToastClose={() => setToastShow(false)}
        >
            <FooterTab data={data} onSave={handleSave} saving={saving} />
        </SettingsPageWrapper>
    );
}

export function KategoriYonetimiPage() {
    const { data, isLoading, save, saving, error } = useSettingsData();
    const [toastShow, setToastShow] = useState(false);

    const handleSave = (payload: Record<string, unknown>) => {
        save(payload, {
            onSuccess: () => setToastShow(true),
        });
    };

    return (
        <SettingsPageWrapper
            title="Kategori Yönetimi"
            description="Haber yüklerken atanacak faaliyet kategorilerini ekleyin veya silin."
            isLoading={isLoading}
            error={error as Error | null}
            isToastVisible={toastShow}
            toastMessage="Kategori ayarları başarıyla güncellendi."
            toastType="success"
            onToastClose={() => setToastShow(false)}
        >
            <CategoriesTab data={data} onSave={handleSave} saving={saving} />
        </SettingsPageWrapper>
    );
}

export function SssPage() {
    const { data, isLoading, save, saving, error } = useSettingsData();
    const [toastShow, setToastShow] = useState(false);

    const handleSave = (payload: Record<string, unknown>) => {
        save(payload, {
            onSuccess: () => setToastShow(true),
        });
    };

    return (
        <SettingsPageWrapper
            title="Soru & Cevap (SSS) Yönetimi"
            description="Sıkça sorulan soruları ve yanıtlarını buradan yönetin."
            isLoading={isLoading}
            error={error as Error | null}
            isToastVisible={toastShow}
            toastMessage="Soru ve cevap ayarları başarıyla güncellendi."
            toastType="success"
            onToastClose={() => setToastShow(false)}
        >
            <FaqTab data={data} onSave={handleSave} saving={saving} />
        </SettingsPageWrapper>
    );
}

export function AracCubuguPage() {
    const { data, isLoading, save, saving, error } = useSettingsData();
    const [toastShow, setToastShow] = useState(false);

    const handleSave = (payload: Record<string, unknown>) => {
        save(payload, {
            onSuccess: () => setToastShow(true),
        });
    };

    return (
        <SettingsPageWrapper
            title="Araç Çubuğu (Sekme) Yönetimi"
            description="Tarayıcı sekmesindeki logoyu (favicon), sekme başlığını ve sekme açıklamasını yönetin."
            isLoading={isLoading}
            error={error as Error | null}
            isToastVisible={toastShow}
            toastMessage="Araç çubuğu ayarları başarıyla güncellendi."
            toastType="success"
            onToastClose={() => setToastShow(false)}
        >
            <AracCubuguTab data={data} onSave={handleSave} saving={saving} />
        </SettingsPageWrapper>
    );
}
