import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Mail, Lock, User, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = ({ type = 'login' }) => {
    const isLogin = type === 'login';
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                await register(formData);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error('Auth Error Details:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Authentication failed. Please check if your backend is running.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-['Outfit'] transition-colors duration-300">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 dark:bg-primary-900/20 rounded-full blur-[100px] -z-10 animate-pulse opacity-40"></div>
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary-200 dark:bg-blue-900/20 rounded-full blur-[100px] -z-10 animate-pulse opacity-40"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300"
            >
                <div className="p-10 sm:p-14">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                            {isLogin ? 'Welcome back' : 'Start your journey'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <Link to={isLogin ? '/register' : '/login'} className="ml-2 text-primary-600 dark:text-primary-400 font-bold hover:underline">
                                {isLogin ? 'Sign up free' : 'Log in here'}
                            </Link>
                        </p>
                    </div>

                    <AnimatePresence mode='wait'>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400"
                            >
                                <Lock size={18} className="mt-0.5 shrink-0" />
                                <span className="text-sm font-bold leading-snug">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Username"
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all duration-300"
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all duration-300"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 relative group">
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                                {isLogin && <a href="#" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700">Forgot password?</a>}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all duration-300"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-3 bg-primary-600 text-white py-4.5 px-6 rounded-2xl font-bold text-lg hover:bg-primary-700 hover:shadow-[0_12px_24px_-8px_rgba(14,165,233,0.5)] focus:ring-4 focus:ring-primary-100 active:scale-[0.98] transition-all disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Log into ResumIQ' : 'Create Account'}</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Proof for Registration */}
                    {!isLogin && (
                        <div className="mt-8 flex items-center justify-center space-x-3 text-slate-400 text-sm font-semibold">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>100% Free to start</span>
                            <span className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></span>
                            <span>No credit card required</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
