import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqTabProps {
    data: Record<string, unknown> | undefined;
    onSave: (payload: Record<string, unknown>) => void;
    saving: boolean;
}

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 outline-none text-slate-800 text-sm";
const submitButtonClass = "px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function FaqTab({ data, onSave, saving }: FaqTabProps) {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    
    // Form state (both for new and editing)
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (data && data.faq) {
            try {
                const parsed = typeof data.faq === 'string'
                    ? JSON.parse(data.faq)
                    : data.faq;
                if (Array.isArray(parsed)) {
                    setFaqs(parsed);
                }
            } catch (err) {
                console.error('FAQ ayrıştırılamadı:', err);
            }
        }
    }, [data]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = question.trim();
        const a = answer.trim();
        if (!q || !a) return;

        if (editingIndex !== null) {
            // Edit existing
            const updated = [...faqs];
            updated[editingIndex] = { question: q, answer: a };
            setFaqs(updated);
            setEditingIndex(null);
        } else {
            // Add new
            setFaqs([...faqs, { question: q, answer: a }]);
        }

        // Reset form
        setQuestion('');
        setAnswer('');
    };

    const handleEdit = (index: number) => {
        const item = faqs[index];
        setQuestion(item.question);
        setAnswer(item.answer);
        setEditingIndex(index);
    };

    const handleCancelEdit = () => {
        setQuestion('');
        setAnswer('');
        setEditingIndex(null);
    };

    const handleDelete = (index: number) => {
        if (confirm('Bu soru ve cevabı silmek istediğinize emin misiniz?')) {
            setFaqs(faqs.filter((_, i) => i !== index));
            if (editingIndex === index) {
                handleCancelEdit();
            }
        }
    };

    const handleSave = () => {
        onSave({
            faq: faqs
        });
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Soru & Cevap (SSS) Yönetimi</h3>
                <p className="text-xs text-slate-500 mb-4">Sıkça Sorulan Sorular sayfasındaki soru ve cevapları buradan yönetin. Değişiklikleri kaydetmek için en alttaki "Ayarları Kaydet" butonuna tıklamalısınız.</p>
            </div>

            {/* Soru Ekleme / Düzenleme Formu */}
            <form onSubmit={handleFormSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    {editingIndex !== null ? 'Soru Düzenle' : 'Yeni Soru & Cevap Ekle'}
                </h4>
                
                <div>
                    <label className={labelClass}>Soru</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className={inputClass}
                        placeholder="Örn: Derneğe nasıl üye olabilirim?"
                        required
                    />
                </div>
                
                <div>
                    <label className={labelClass}>Cevap</label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={3}
                        className={inputClass}
                        placeholder="Örn: Üyelik formunu doldurarak merkezimize teslim etmelisiniz..."
                        required
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    {editingIndex !== null && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <FaTimes size={10} />
                            İptal
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-5 py-2 bg-[#0d2137] text-white font-bold rounded-xl text-xs hover:bg-[#1a3a5c] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        {editingIndex !== null ? <FaSave size={10} /> : <FaPlus size={10} />}
                        {editingIndex !== null ? 'Güncelle' : 'Ekle'}
                    </button>
                </div>
            </form>

            {/* Soru-Cevap Listesi */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kayıtlı Sorular ({faqs.length})</h4>
                
                {faqs.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-500 text-xs">
                        ❓ Henüz eklenmiş soru ve cevap bulunmuyor.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`p-5 rounded-2xl border transition-all ${
                                    editingIndex === index 
                                        ? 'border-blue-300 bg-blue-50/10 shadow-inner' 
                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <span className="text-sm font-bold text-slate-800 block">Q: {faq.question}</span>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">A: {faq.answer}</p>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(index)}
                                            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-xl transition-colors cursor-pointer border border-slate-200/50"
                                            title="Düzenle"
                                        >
                                            <FaEdit size={11} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(index)}
                                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer border border-rose-100"
                                            title="Sil"
                                        >
                                            <FaTrash size={11} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className={submitButtonClass}
                >
                    {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
                </button>
            </div>
        </div>
    );
}
