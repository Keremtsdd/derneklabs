import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    value?: string;
    onChange?: (val: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value = '', onChange, placeholder }: SearchBarProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 mb-8">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-primary/15 focus-within:border-primary/20 transition-all duration-300">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder ?? "Size nasıl yardımcı olabiliriz? (Arama yapın...)"}
                        className="flex-1 px-6 py-4.5 text-base border-0 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 bg-transparent"
                        aria-label="Arama kutusuna bir kelime giriniz"
                    />
                    <button
                        type="submit"
                        className="px-6 py-4.5 text-accent dark:text-emerald hover:text-primary dark:hover:text-emerald-light transition-all duration-200 cursor-pointer flex items-center justify-center border-0 bg-transparent outline-none"
                        aria-label="Arama yap"
                    >
                        <FaSearch size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
