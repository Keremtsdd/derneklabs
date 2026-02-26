import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            console.info('Search:', query);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 mb-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Size nasıl yardımcı olabiliriz?"
                        className="flex-1 px-5 py-5 text-base border-0 outline-none placeholder:text-gray-400"
                        aria-label="Arama kutusuna bir kelime giriniz"
                    />
                    <button
                        type="submit"
                        className="px-6 py-5 text-accent hover:text-primary transition-colors"
                        aria-label="Arama yap"
                    >
                        <FaSearch size={22} />
                    </button>
                </div>
            </form>
        </div>
    );
}
