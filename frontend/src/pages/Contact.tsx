import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFax } from 'react-icons/fa';

export default function Contact() {
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
                                <p className="text-sm text-gray-600">
                                    Yenidoğan Mahallesi Abdi İpekçi Caddesi No:2<br />
                                    Bayrampaşa/İstanbul/Türkiye
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <FaEnvelope className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-heading font-bold text-primary text-sm mb-1">E-posta</h3>
                                <a href="mailto:iletisim@orhanpasa.bel.tr" className="text-sm text-primary hover:text-accent transition-colors">
                                    iletisim@orhanpasa.bel.tr
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <FaPhoneAlt className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-heading font-bold text-primary text-sm mb-1">Telefon</h3>
                                <a href="tel:+902124671900" className="text-sm text-primary hover:text-accent transition-colors">
                                    +90 212 467 19 00 / 444 1 990
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <FaFax className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-heading font-bold text-primary text-sm mb-1">Faks</h3>
                                <p className="text-sm text-gray-600">+90 212 467 19 89</p>
                            </div>
                        </div>
                    </div>

                    {/* Harita */}
                    <div className="rounded-lg overflow-hidden shadow-sm">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6019.129994581453!2d28.912395!3d41.034772!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2f2f759065a8afbc!2sT.C%20Bayrampa%C5%9Fa%20Belediyesi!5e0!3m2!1str!2str!4v1625232148007!5m2!1str!2str"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Belediye Konumu"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
