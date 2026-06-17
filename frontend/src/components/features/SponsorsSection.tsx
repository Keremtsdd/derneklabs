import { FaHandshake, FaAward } from 'react-icons/fa';

const SPONSORS = [
    {
        name: "Derneksoft Yazılım",
        category: "Teknoloji Destekçisi",
        initials: "DS",
        color: "from-emerald to-emerald-dark text-white",
        glow: "shadow-emerald/10",
        description: "Platformumuzun tüm dijital, bulut altyapı ve yazılım koordinasyon desteğini ücretsiz sağlamaktadır."
    },
    {
        name: "Kardeşler Lojistik",
        category: "Lojistik Ortağı",
        initials: "KL",
        color: "from-blue-500 to-sky-600 text-white",
        glow: "shadow-blue-500/10",
        description: "Saha insani yardım operasyonlarımızın tüm nakliye, depolama ve dağıtım süreçlerini üstlenmektedir."
    },
    {
        name: "Anadolu Gıda A.Ş.",
        category: "Gıda Sponsoru",
        initials: "AG",
        color: "from-amber-500 to-orange-600 text-white",
        glow: "shadow-amber-500/10",
        description: "Ramazan ayı gıda kolileri, aşevi destekleri ve acil gıda paketleri tedarik süreçlerimizi fonlamaktadır."
    },
    {
        name: "Hilal Medya",
        category: "Tanıtım & Basın",
        initials: "HM",
        color: "from-rose-500 to-pink-600 text-white",
        glow: "shadow-rose-500/10",
        description: "Faaliyetlerimizin ve kamu yararı projelerimizin basında, televizyonlarda ve sosyal mecralarda tanıtımını yapmaktadır."
    },
    {
        name: "Erciyes Tekstil",
        category: "Giyim Destekçisi",
        initials: "ET",
        color: "from-teal-500 to-cyan-600 text-white",
        glow: "shadow-teal-500/10",
        description: "Kış yardımı kampanyalarımızda ihtiyaç sahibi çocuklara mont, bot ve atkı/bere tedarik desteği sunmaktadır."
    },
    {
        name: "Yıldız Eğitim Vakfı",
        category: "Eğitim & Burs Ortağı",
        initials: "YV",
        color: "from-purple-500 to-indigo-600 text-white",
        glow: "shadow-purple-500/10",
        description: "Üniversite ve lise öğrencilerimize yönelik burs fonumuzun koordinasyonunu ve eğitim seminerlerini yürütmektedir."
    }
];

export default function SponsorsSection() {
    const items = SPONSORS;
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4 mb-10">
                <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20">
                        DESTEKÇİLERİMİZ
                    </span>
                    <h2 className="font-heading text-2.5xl font-black text-white tracking-tight mt-2.5 uppercase">
                        KURUMSAL ORTAKLAR & DESTEKÇİLER
                    </h2>
                </div>
                <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                    <FaHandshake className="text-emerald text-sm" />
                    <span>Birlikte Güçlüyüz</span>
                </div>
            </div>

            {/* Interactive Grid of Corporate Partner Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((sponsor, idx) => (
                    <div 
                        key={idx}
                        className="group bg-white/5 border border-white/10 hover:border-emerald/30 hover:bg-white/10 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                    >
                        {/* Soft background glow */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald/5 rounded-full blur-2xl group-hover:bg-emerald/10 transition-all duration-500" />
                        
                        <div>
                            {/* Logo Space & Category Badge */}
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sponsor.color} flex items-center justify-center font-heading font-black text-sm tracking-wider shadow-lg ${sponsor.glow} group-hover:scale-105 transition-transform duration-300`}>
                                    {sponsor.initials}
                                </div>
                                <span className="text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald/10 text-emerald border border-emerald/20/50 flex items-center gap-1">
                                    <FaAward className="text-[8px]" />
                                    {sponsor.category}
                                </span>
                            </div>

                            {/* Name & Description */}
                            <h4 className="font-heading font-extrabold text-slate-100 group-hover:text-white transition-colors text-base sm:text-lg mb-2">
                                {sponsor.name}
                            </h4>
                            <p className="text-slate-400 group-hover:text-slate-300 transition-colors text-xs font-medium leading-relaxed">
                                {sponsor.description}
                            </p>
                        </div>

                        {/* Interactive underline link */}
                        <div className="pt-5 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            İş Birliği Detayları
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
