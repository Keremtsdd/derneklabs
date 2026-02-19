import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useCollections';
import EventCard from '../components/features/EventCard';

export default function Events() {
    const { data: events, isLoading, error } = useEvents();

    return (
        <div className="max-w-7xl mx-auto px-4 pt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="font-heading text-primary text-2xl font-bold">Etkinlikler</h1>
                        <p className="text-text-muted text-sm">Tüm etkinlikler</p>
                    </div>
                    <Link to="/" className="text-sm text-primary border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        Ana Sayfa
                    </Link>
                </div>

                {isLoading && <p className="text-center text-text-muted py-8">Yükleniyor...</p>}
                {error && <p className="text-center text-accent py-8">Veriler yüklenirken hata oluştu.</p>}

                {events && events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {events.map((item) => (
                            <EventCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    !isLoading && <p className="text-center text-text-muted py-8">Kayıt bulunamadı.</p>
                )}
            </div>
        </div>
    );
}
