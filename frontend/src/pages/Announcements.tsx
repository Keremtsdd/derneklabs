import { Link } from 'react-router-dom';
import { useAnnouncements } from '../hooks/useCollections';
import AnnouncementItem from '../components/features/AnnouncementItem';

export default function Announcements() {
    const { data: announcements, isLoading, error } = useAnnouncements();

    return (
        <div className="max-w-7xl mx-auto px-4 pt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="font-heading text-primary text-2xl font-bold">Duyurular</h1>
                        <p className="text-text-muted text-sm">Tüm duyurular</p>
                    </div>
                    <Link to="/" className="text-sm text-primary border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        Ana Sayfa
                    </Link>
                </div>

                {isLoading && <p className="text-center text-text-muted py-8">Yükleniyor...</p>}
                {error && <p className="text-center text-accent py-8">Veriler yüklenirken hata oluştu.</p>}

                {announcements && announcements.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {announcements.map((item) => (
                            <AnnouncementItem key={item.id} item={item} />
                        ))}
                    </ul>
                ) : (
                    !isLoading && <p className="text-center text-text-muted py-8">Kayıt bulunamadı.</p>
                )}
            </div>
        </div>
    );
}
