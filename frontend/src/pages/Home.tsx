import { FaNewspaper, FaCalendarAlt, FaYoutube, FaBullhorn, FaFile, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SearchBar from '../components/layout/SearchBar';
import AtaturkQuote from '../components/features/AtaturkQuote';
import HeroSlider from '../components/features/HeroSlider';
import QuickActionGrid from '../components/features/QuickActionGrid';
import TabGroup from '../components/ui/TabGroup';
import Carousel from '../components/ui/Carousel';
import NewsCard from '../components/features/NewsCard';
import EventCard from '../components/features/EventCard';
import AnnouncementItem from '../components/features/AnnouncementItem';
import DocumentItem from '../components/features/DocumentItem';
import ProjectCard from '../components/features/ProjectCard';
import { useNews, useEvents, useAnnouncements, useDocuments, useProjects } from '../hooks/useCollections';

export default function Home() {
    const { data: news } = useNews();
    const { data: events } = useEvents();
    const { data: announcements } = useAnnouncements();
    const { data: documents } = useDocuments();
    const { data: projects } = useProjects();

    const multimediaTabs = [
        { id: 'news', label: 'HABERLER', icon: <FaNewspaper /> },
        { id: 'events', label: 'ETKİNLİKLER', icon: <FaCalendarAlt /> },
        { id: 'videos', label: 'VİDEOLAR', icon: <FaYoutube /> },
    ];

    const announcementTabs = [
        { id: 'announcements', label: 'DUYURULAR', icon: <FaBullhorn /> },
        { id: 'documents', label: 'BELGELER', icon: <FaFile /> },
    ];

    return (
        <div className="pt-6">
            <SearchBar />
            <AtaturkQuote />
            <HeroSlider />
            <QuickActionGrid />

            {/* Haberler / Etkinlikler / Videolar */}
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <TabGroup tabs={multimediaTabs} defaultTabId="news">
                        {(activeId) => (
                            <>
                                {activeId === 'news' && (
                                    <div>
                                        <Link to="/haberler" className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent font-medium mb-3">
                                            <FaArrowRight className="text-xs" /> Tüm Haberler
                                        </Link>
                                        <Carousel slidesPerView={4} showDots>
                                            {(news || []).slice(0, 8).map((item) => (
                                                <NewsCard key={item.id} item={item} />
                                            ))}
                                        </Carousel>
                                        {(!news || news.length === 0) && (
                                            <p className="text-center text-text-muted py-6 text-sm">Henüz haber bulunamadı.</p>
                                        )}
                                    </div>
                                )}

                                {activeId === 'events' && (
                                    <div>
                                        <Link to="/etkinlikler" className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent font-medium mb-3">
                                            <FaArrowRight className="text-xs" /> Tüm Etkinlikler
                                        </Link>
                                        <Carousel slidesPerView={4} showDots>
                                            {(events || []).slice(0, 8).map((item) => (
                                                <EventCard key={item.id} item={item} />
                                            ))}
                                        </Carousel>
                                        {(!events || events.length === 0) && (
                                            <p className="text-center text-text-muted py-6 text-sm">Henüz etkinlik bulunamadı.</p>
                                        )}
                                    </div>
                                )}

                                {activeId === 'videos' && (
                                    <p className="text-center text-text-muted py-6 text-sm">Henüz video bulunamadı.</p>
                                )}
                            </>
                        )}
                    </TabGroup>
                </div>
            </div>

            {/* Duyurular / Belgeler + Tanıtım */}
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Duyurular / Belgeler Tab */}
                        <div className="lg:col-span-2">
                            <TabGroup tabs={announcementTabs} defaultTabId="announcements">
                                {(activeId) => (
                                    <>
                                        {activeId === 'announcements' && (
                                            <ul className="divide-y divide-gray-100">
                                                {(announcements || []).slice(0, 5).map((item) => (
                                                    <AnnouncementItem key={item.id} item={item} />
                                                ))}
                                                {(!announcements || announcements.length === 0) && (
                                                    <li className="py-3 text-sm text-text-muted">Duyuru bulunamadı.</li>
                                                )}
                                                <li className="pt-2">
                                                    <Link to="/duyurular" className="text-sm text-accent font-bold flex items-center gap-1 hover:underline">
                                                        <FaArrowRight className="text-xs" /> Tüm Duyurular
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}

                                        {activeId === 'documents' && (
                                            <ul className="divide-y divide-gray-100">
                                                {(documents || []).slice(0, 5).map((item) => (
                                                    <DocumentItem key={item.id} item={item} />
                                                ))}
                                                {(!documents || documents.length === 0) && (
                                                    <li className="py-3 text-sm text-text-muted">Belge bulunamadı.</li>
                                                )}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </TabGroup>
                        </div>

                        {/* Tanıtım Slider */}
                        <div className="lg:col-span-3">
                            <Carousel autoplay autoplayDelay={5000} loop showDots>
                                {[
                                    '/images/31-1287298.jpg',
                                    '/images/31-1287728.jpg',
                                    '/images/08-0186825.jpg',
                                    '/images/31-1285071.jpg',
                                ].map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt={`Tanıtım ${i + 1}`}
                                        className="w-full h-64 lg:h-80 object-cover rounded-lg"
                                        loading="lazy"
                                    />
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projeler */}
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-center mb-4">
                        <h2 className="font-heading text-primary font-bold text-2xl">PROJELER</h2>
                        <Link to="/projeler" className="inline-flex items-center gap-1 text-sm text-accent font-bold hover:underline mt-1">
                            <FaArrowRight className="text-xs" /> Tüm Projeler
                        </Link>
                    </div>
                    <Carousel slidesPerView={4} showDots>
                        {(projects || []).slice(0, 8).map((item) => (
                            <ProjectCard key={item.id} item={item} />
                        ))}
                    </Carousel>
                    {(!projects || projects.length === 0) && (
                        <p className="text-center text-text-muted py-6 text-sm">Henüz proje bulunamadı.</p>
                    )}
                </div>
            </div>

            {/* Logolar */}
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 text-center border-t">
                    <img src="/images/logolar.jpg" alt="Logolar" className="inline-block max-w-full h-auto" loading="lazy" />
                </div>
            </div>
        </div>
    );
}
