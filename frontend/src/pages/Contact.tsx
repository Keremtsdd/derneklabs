import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFax } from 'react-icons/fa';
import { useSiteSettings } from '../hooks/useSiteSettings';

const DEFAULT_FAX = '+90 212 467 19 89';
const DEFAULT_MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6019.129994581453!2d28.912395!3d41.034772!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2f2f759065a8afbc!2sT.C%20Bayrampa%C5%9Fa%20Belediyesi!5e0!3m2!1str!2str!4v1625232148007!5m2!1str!2str';

export default function Contact() {
    const { address, email, phone, mapEmbed } = useSiteSettings();

    const hasMapHtml = mapEmbed && mapEmbed.trim().length > 0;
    const mapContent = hasMapHtml
        ? { __html: mapEmbed }
        : undefined;

    return (
        <div className="max-w-7xl mx-auto px-4 pt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="font-heading text-primary text-2xl font-bold">İletişim</h1>
                        <p className="text-text-muted text-sm">Bize ulaşın</p>
                    </div>
                    <Link to="/" className="text-sm text-primary border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        Ana Sayfa
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* İletişim Bilgileri */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <FaMapMarkerAlt className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-heading font-bold text-primary text-sm mb-1">Adres</h3>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <FaEnvelope className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-heading font-bold text-primary text-sm mb-1">E-posta</h3>
                                <a href={`mailto:${email}`} className="text-sm text-primary hover:text-accent transition-colors">
                                    {email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <FaPhoneAlt className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-heading font-bold text-primary text-sm mb-1">Telefon</h3>
                                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm text-primary hover:text-accent transition-colors">
                                    {phone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <FaFax className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-heading font-bold text-primary text-sm mb-1">Faks</h3>
                                <p className="text-sm text-gray-600">{DEFAULT_FAX}</p>
                            </div>
                        </div>
                    </div>

                    {/* Harita: Site ayarlarından embed HTML veya varsayılan iframe */}
                    <div className="rounded-lg overflow-hidden shadow-sm min-h-[400px]">
                        {hasMapHtml ? (
                            <div className="[&>iframe]:w-full [&>iframe]:h-[400px] [&>iframe]:border-0" dangerouslySetInnerHTML={mapContent} />
                        ) : (
                            <iframe
                                src={DEFAULT_MAP_SRC}
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Belediye Konumu"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
