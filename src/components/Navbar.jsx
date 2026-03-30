import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layout as LayoutIcon, User, PlusCircle, Sun, Moon, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="flex items-center group">
                            <div className="bg-primary-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <LayoutIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-['Outfit'] font-bold text-slate-800 dark:text-white tracking-tight">ResumIQ</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        
                        {user ? (
                            <>
                                <Link to="/creator" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">New Resume</Link>
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Edit Existing</Link>
                                <button
                                    onClick={() => navigate('/creator', { state: { activeSection: 'analyze' }})}
                                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 hover:shadow-lg transition-all active:scale-95"
                                >
                                    <Sparkles size={18} />
                                    <span>Analyze Resume</span>
                                </button>
                                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                                <div className="flex items-center space-x-2 group cursor-pointer px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => navigate('/dashboard')}>
                                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                        <User size={18} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{user?.username ? user.username.split(' ')[0] : 'User'}</span>
                                </div>
                                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Log in</Link>
                                <Link to="/register" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all font-medium whitespace-nowrap">
                                    Sign up free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
