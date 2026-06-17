import { FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useProjects } from '../../hooks/useCollections';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { resolveImageUrl } from '../../services/api';
import { Link } from 'react-router-dom';

export default function HeroImpact() {
    const { data: projects } = useProjects();
    const { siteDescription } = useSiteSettings();
    
    // Get latest project image
    const latestProject = projects && projects.length > 0 ? projects[0] : null;
    const projectImage = latestProject ? resolveImageUrl(latestProject.image) : '/images/kutuphanelerimiz4332.jpg';
    const projectTitle = latestProject 
        ? latestProject.title
        : 'Sosyal Projelerimiz';

    return (
        <div className="relative w-full min-h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden flex items-center mb-12 py-10 md:py-0">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-people-raising-their-hands-in-a-volunteer-event-40019-large.mp4" type="video/mp4" />
                    {/* Fallback image */}
                    <img src="/images/background.webp" className="w-full h-full object-cover" alt="Background fallback" />
                </video>
                {/* Darkened overlay */}
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Side: Beautifully rounded project image card (rounded-3xl) */}
                    <div className="lg:col-span-6 flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-md lg:max-w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-slate-950/50 group">
                            <img
                                src={projectImage}
                                alt={projectTitle}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                                <div>
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20">
                                        AKTİF PROJE
                                    </span>
                                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-white mt-1.5 line-clamp-1">
                                        {projectTitle}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Date, slogan, descriptions, and button */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left lg:pl-6">
                        {/* Dynamic/Static date */}
                        <div className="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 mb-4">
                            <FaCalendarAlt className="text-emerald text-[11px]" />
                            <span>16 Haziran 2026</span>
                        </div>

                        {/* Bold dynamic slogan */}
                        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight tracking-tight uppercase mb-4 text-white">
                            Çukurca İçin El Ele
                        </h1>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-6 max-w-xl">
                            {siteDescription || ''}
                        </p>

                        {/* Action Button */}
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/sayfa/hakkimizda"
                                className="px-6.5 py-3 bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-colors shadow-lg cursor-pointer"
                            >
                                HAKKIMIZDA
                            </Link>
                            <Link
                                to="/destek"
                                className="px-6.5 py-3 bg-accent text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-accent-hover transition-colors shadow-lg cursor-pointer"
                            >
                                BAĞIŞ YAP
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical Navigation Indicators (Right edge as in hero.jpg) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 hidden lg:flex z-20">
                <button className="text-white/60 hover:text-white transition-colors cursor-pointer" aria-label="Yukarı Git">
                    <FaChevronUp size={12} />
                </button>
                <div className="flex flex-col gap-1.5 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="w-1.5 h-6 rounded-full bg-white" />
                </div>
                <button className="text-white/60 hover:text-white transition-colors cursor-pointer" aria-label="Down">
                    <FaChevronDown size={12} />
                </button>
            </div>
        </div>
    );
}
