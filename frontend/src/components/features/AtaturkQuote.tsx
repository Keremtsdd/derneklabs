export default function AtaturkQuote() {
    return (
        <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-sm p-5 flex flex-col md:flex-row items-center gap-4">
                <blockquote className="flex-1 text-center md:text-left">
                    <p className="text-gray-700 italic text-base leading-relaxed">
                        "Çalışmadan, yorulmadan ve üretmeden rahat yaşamak isteyen toplumlar, evvela
                        haysiyetlerini sonra hürriyetlerini daha sonra da istiklal ve istikballerini
                        kaybetmeye mahkûmdurlar."
                    </p>
                    <footer className="mt-2 text-right">
                        <cite className="text-primary font-heading font-bold text-sm not-italic">
                            Mustafa Kemal Atatürk
                        </cite>
                    </footer>
                </blockquote>
                <img
                    src="/images/ataturk.png"
                    alt="Atatürk"
                    className="w-32 md:w-40 object-contain"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
