import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary to-primary-light text-white hidden xl:block">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20 gap-6">
                    {/* Başkan */}
                    <div className="shrink-0">
                        <h3 className="font-heading text-sm opacity-80">İbrahim AKIN</h3>
                        <p className="text-xs opacity-60">Orhanpaşa Belediye Başkan V.</p>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    {/* Belediye */}
                    <div className="shrink-0">
                        <p className="text-xs opacity-70 font-heading">T.C. Orhanpaşa Belediye Başkanlığı</p>
                        <p className="text-xs opacity-50">Tüm hakları saklıdır.</p>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    {/* İletişim */}
                    <div className="shrink-0 space-y-0.5">
                        <p className="text-xs opacity-70 flex items-center gap-1.5">
                            <FaEnvelope className="text-[10px]" />
                            <a href="mailto:iletisim@orhanpasa.bel.tr" className="hover:underline">iletisim@orhanpasa.bel.tr</a>
                        </p>
                        <p className="text-xs opacity-50 flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-[10px]" />
                            Orhanpaşa Meydanı, No: 1, İstanbul
                        </p>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    {/* Sosyal Medya */}
                    <div className="shrink-0">
                        <p className="text-xs opacity-70 font-heading mb-1">Bizi Takip Edin</p>
                        <div className="flex gap-1.5">
                            {[
                                { icon: FaTwitter, href: 'https://twitter.com/bpasabelediyesi' },
                                { icon: FaFacebookF, href: 'https://tr-tr.facebook.com/bpasabelediyesi' },
                                { icon: FaInstagram, href: 'https://www.instagram.com/bayrampasabeltr/' },
                                { icon: FaYoutube, href: 'https://www.youtube.com/user/bayrampasabld' },
                            ].map(({ icon: Icon, href }) => (
                                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-accent transition-colors text-xs">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    {/* Telefon */}
                    <div className="shrink-0 text-right">
                        <p className="text-xs opacity-70 font-heading flex items-center gap-1.5">
                            <FaPhoneAlt className="text-[10px]" />
                            Bize Ulaşın
                        </p>
                        <p className="font-heading font-bold text-lg">444 1 990</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
