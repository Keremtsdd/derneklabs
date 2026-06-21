import { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface CategoryItem {
    id: string;
    label: string;
}

interface CategoriesTabProps {
    data: Record<string, unknown> | undefined;
    onSave: (payload: Record<string, unknown>) => void;
    saving: boolean;
}

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

function slugify(text: string): string {
    const trMap: Record<string, string> = {
        'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
    };
    let slug = text.toLowerCase();
    for (const [key, value] of Object.entries(trMap)) {
        slug = slug.replaceAll(key, value);
    }
    return slug
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export default function CategoriesTab({ data, onSave, saving }: CategoriesTabProps) {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [newLabel, setNewLabel] = useState('');

    useEffect(() => {
        if (data && data.news_categories) {
            try {
                const parsed = typeof data.news_categories === 'string'
                    ? JSON.parse(data.news_categories)
                    : data.news_categories;
                if (Array.isArray(parsed)) {
                    setCategories(parsed);
                }
            } catch (err) {
                console.error('Kategoriler ayrıştırılamadı:', err);
            }
        }
    }, [data]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newLabel.trim();
        if (!trimmed) return;

        // Benzersiz bir ID/Slug oluştur
        const slug = slugify(trimmed);
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        const id = `${slug}-${randomSuffix}`;

        setCategories([...categories, { id, label: trimmed }]);
        setNewLabel('');
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye ait haberler "Tümü" altında görünmeye devam eder ancak kategori etiketi silinecektir.')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleSave = () => {
        onSave({
            news_categories: categories
        });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Haber Kategorileri</h3>
                <p className="text-xs text-slate-500 mb-4">Haber eklerken seçilecek faaliyet kategorilerini buradan yönetin. Değişikliklerin kaydedilmesi için en alttaki "Ayarları Kaydet" butonuna tıklamalısınız.</p>
            </div>

            {/* Yeni Ekleme Formu */}
            <form onSubmit={handleAdd} className="flex gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 items-end">
                <div className="flex-1">
                    <label className={labelClass}>Yeni Kategori Adı</label>
                    <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className={inputClass}
                        placeholder="Örn: Gençlik & Spor"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-5 py-3 bg-[#0d2137] text-white font-bold rounded-xl text-xs hover:bg-[#1a3a5c] transition-colors flex items-center gap-2 cursor-pointer h-[42px]"
                >
                    <FaPlus size={10} />
                    Ekle
                </button>
            </form>

            {/* Kategori Listesi */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                {categories.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                        🏷️ Henüz eklenmiş haber kategorisi bulunmuyor.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                                <div>
                                    <span className="font-bold text-slate-800 text-sm block">{category.label}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">ID: {category.id}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition-colors cursor-pointer"
                                    title="Kategoriyi Sil"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={submitButtonClass}
            >
                {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
            </button>
        </div>
    );
}
