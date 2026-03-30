import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Layout, CheckCircle, Zap, Shield, Rocket, FileText, 
    ChevronRight, ArrowRight, Play, Star, Users, PlusCircle 
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen font-['Outfit'] overflow-hidden transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[140px] opacity-30 animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-5 py-2 rounded-full font-bold text-sm mb-8 border border-primary-100 dark:border-primary-800 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-800"
                    >
                        <Zap size={16} fill="currentColor" />
                        <span>The Future of Resume Building is Here</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8"
                    >
                        Build a resume that <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 animate-gradient">gets you hired.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
                    >
                        ResumIQ provides professional templates designed to beat Applicant Tracking Systems (ATS) and impress technical recruiters.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link to="/register" className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-primary-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary-700 hover:shadow-[0_20px_40px_-15px_rgba(14,165,233,0.5)] transition-all active:scale-95 group shadow-xl">
                            <PlusCircle size={24} className="group-hover:rotate-90 transition-transform" />
                            <span>Build Your Resume Now</span>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-10 py-5 rounded-2xl text-lg font-bold border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary-500 transition-all active:scale-95 shadow-sm">
                            <Users size={18} />
                            <span>Sign In to Your Account</span>
                        </Link>
                    </motion.div>

                    {/* Trust Proof */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                        className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center"
                    >
                        <div className="flex items-center -space-x-3 mb-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold overflow-hidden`}>
                                    <Users size={20} />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Trusted by 10,000+ top developers worldwide</p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-[#fafbfc] dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.4em]">Features</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Everything you need, none of the fluff.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Rocket size={24} />} 
                            title="ATS-Optimized" 
                            description="Our templates are specifically engineered to pass through automated keyword filters effortlessly."
                            color="bg-primary-500"
                        />
                        <FeatureCard 
                            icon={<Shield size={24} />} 
                            title="Zero-Privacy Risk" 
                            description="Your data is encrypted and secure. We never sell your personal information to third parties."
                            color="bg-slate-900"
                        />
                        <FeatureCard 
                            icon={<Layout size={24} />} 
                            title="Live Preview" 
                            description="Edit sections, change colors and toggle templates with a real-time responsive preview."
                            color="bg-blue-600"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-primary-600 rounded-[56px] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-3xl -z-0 translate-x-40 -translate-y-40"></div>
                    <div className="relative z-10 text-center">
                        <Star size={48} className="text-white/40 mb-8 mx-auto animate-float" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                            Ready to land your dream job?
                        </h2>
                        <Link to="/register" className="inline-flex items-center space-x-3 bg-white text-primary-600 px-12 py-5 rounded-2xl text-xl font-black hover:bg-slate-50 hover:shadow-2xl transition-all active:scale-95 shadow-xl">
                            <span>Create Your Resume</span>
                            <ChevronRight size={24} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase transition-colors">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-6">
                    <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
                        <div className="bg-primary-600 p-1.5 rounded-lg">
                            <FileText size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-black">ResumIQ</span>
                    </div>
                    <p>&copy; 2024 ResumIQ Professional Inc.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">GitHub</a>
                        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, color }) => (
    <div className="bg-white dark:bg-slate-800/50 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 hover:border-primary-100 dark:hover:border-primary-900/50 hover:shadow-2xl transition-all group">
        <div className={`w-16 h-16 ${color} text-white flex items-center justify-center rounded-[20px] mb-8 shadow-lg group-hover:scale-110 transition-transform font-bold`}>
            {icon}
        </div>
        <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">{title}</h4>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
