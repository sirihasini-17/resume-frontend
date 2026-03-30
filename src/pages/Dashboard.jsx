import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api';
import { PlusCircle, FileText, Calendar, Trash2, Edit2, Play, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await resumeService.getAll();
            setResumes(res.data);
        } catch (err) {
            console.error('Failed to fetch resumes', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this resume?')) {
            try {
                await resumeService.delete(id);
                fetchResumes();
            } catch (err) {
                console.error('Delete failed', err);
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-900 pt-32 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">My Resumes</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and refine your professional profiles.</p>
                    </div>
                    <Link
                        to="/creator"
                        className="group flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-primary-600 hover:shadow-[0_12px_32px_-8px_rgba(14,165,233,0.5)] transition-all font-bold active:scale-95 shadow-md"
                    >
                        <PlusCircle size={24} className="group-hover:rotate-90 transition-transform" />
                        <span>Create New Resume</span>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-200 dark:border-slate-700 shadow-sm"></div>
                        ))}
                    </div>
                ) : resumes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-[40px] p-20 border border-slate-100 dark:border-slate-800 shadow-xl text-center max-w-2xl mx-auto border-dashed border-2 transition-colors duration-300"
                    >
                        <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/40 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FileText size={48} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">No resumes yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                            Create your first professional resume today. Our templates are designed to beat applicant tracking systems (ATS).
                        </p>
                        <Link 
                            to="/creator" 
                            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-2xl hover:bg-primary-700 transition-all font-bold shadow-lg"
                        >
                            <span>Get Started</span>
                            <ChevronRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {resumes.map(resume => (
                            <motion.div
                                key={resume.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate(`/creator/${resume.id}`)}
                                className="group relative bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-2xl transition-all cursor-pointer shadow-sm p-6 flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[100px] -z-0 transition-all group-hover:scale-110"></div>
                                
                                <div className="mb-6 flex justify-between items-start">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl text-primary-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                                        <FileText size={28} />
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => handleDelete(resume.id, e)}
                                            className="p-3 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight">
                                        {resume.resumeTitle || 'Untitled Resume'}
                                    </h3>
                                    <div className="flex items-center text-slate-500 dark:text-slate-400 font-semibold text-sm mb-4 space-x-4">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-2" />
                                            <span>Just now</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                        <div className="flex items-center text-primary-500 dark:text-primary-400 font-bold uppercase tracking-wider text-[10px]">
                                            <Activity size={14} className="mr-1.5" />
                                            <span>Completing</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all font-bold text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Edit2 size={16} />
                                        <span>Edit Resume</span>
                                    </div>
                                    <Play size={16} fill="currentColor" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
