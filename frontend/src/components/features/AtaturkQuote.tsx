export default function AtaturkQuote() {
    return (
        <div className="max-w-7xl mx-auto px-4 mb-10">
            <div className="bg-gradient-to-r from-[#0C1425] via-[#111F36] to-primary text-white rounded-3xl shadow-xl shadow-slate-900/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden relative border border-slate-800">
                {/* Subtle light effect top right */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl pointer-events-none" />
                
                <blockquote className="flex-1 text-center md:text-left relative z-10">
                    <span className="text-4xl text-slate-600 block mb-1 font-serif select-none">“</span>
                    <p className="text-slate-100 italic text-base md:text-lg leading-relaxed -mt-3 font-medium">
                        Çalışmadan, yorulmadan ve üretmeden rahat yaşamak isteyen toplumlar, evvela
                        haysiyetlerini sonra hürriyetlerini daha sonra da istiklal ve istikballerini
                        kaybetmeye mahkûmdurlar.
                    </p>
                    <footer className="mt-4 flex items-center justify-center md:justify-start gap-2">
                        <div className="h-px w-6 bg-slate-500" />
                        <cite className="text-primary-light font-heading font-extrabold text-sm not-italic uppercase tracking-wider">
                            Mustafa Kemal Atatürk
                        </cite>
                    </footer>
                </blockquote>
                
                <div className="shrink-0 relative z-10">
                    <div className="bg-slate-800/40 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-inner">
                        <img
                            src="/images/ataturk.png"
                            alt="Mustafa Kemal Atatürk"
                            className="w-28 md:w-36 object-contain rounded-xl"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
