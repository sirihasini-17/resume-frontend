import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Briefcase, GraduationCap, Code, Globe, Award, Star, 
    MessageSquare, Heart, Palette, Sparkles, Save, Download, 
    ChevronRight, ArrowLeft, Plus, Trash2, X, CheckCircle, 
    Zap, Mail, Phone, MapPin, Type, Key, Loader, Target, FileText, Search
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Templates
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ATSTemplate from '../templates/ATSTemplate';
import OneColumnImpact from '../templates/OneColumnImpact';
import OneColumnCreative from '../templates/OneColumnCreative';
import TwoColumnSidebarLeft from '../templates/TwoColumnSidebarLeft';
import TwoColumnSidebarRight from '../templates/TwoColumnSidebarRight';
import TwoColumnSplit from '../templates/TwoColumnSplit';
import TwoColumnGrid from '../templates/TwoColumnGrid';
import TwoColumnModern from '../templates/TwoColumnModern';
import ElegantTemplate from '../templates/ElegantTemplate';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_RESUME = {
    resumeTitle: 'My New Resume',
    templateId: 'modern',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    usePhoto: false,
    themeColor: '#2563eb',
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
    certificates: [],
    achievements: [],
    languages: [],
    interests: [],
    customSections: [],
};

const NEW_ITEMS = {
    experiences:     { company: '', role: '', startDate: '', endDate: '', description: '' },
    educations:      { institution: '', degree: '', fieldOfStudy: '', graduationDate: '' },
    skills:          { name: '', proficiency: 'Intermediate' },
    projects:        { title: '', demoUrl: '', description: '' },
    certificates:    { title: '', issuer: '', date: '' },
    achievements:    { title: '', description: '' },
    languages:       { language: '', proficiency: 'Conversational' },
    interests:       { name: '' },
    customSections:  { title: '', content: '' },
};

const WIZARD_STEPS = [
    { id: 'options',       label: 'Foundation',    desc: 'Photo & Theme' },
    { id: 'template',      label: 'Templates',     desc: 'Choose Design' },
    { id: 'personal',      label: 'Personal',      desc: 'Contact Details' },
    { id: 'experience',    label: 'Experience',    desc: 'Work History' },
    { id: 'education',     label: 'Education',     desc: 'Academic Background' },
    { id: 'skills',        label: 'Skills',        desc: 'Core Strengths' },
    { id: 'projects',      label: 'Projects',      desc: 'Side Work' },
    { id: 'extra',         label: 'Achievements',  desc: 'Awards & Certs' },
    { id: 'summary',       label: 'AI Summary',    desc: 'Professional Intro' },
    { id: 'analyze',       label: 'Finalize',      desc: 'ATS & Export' },
];

const TEMPLATES = [
    { id: 'ats',           name: 'Harvard Standard',   color: 'bg-black' },
    { id: 'elegant',       name: 'Elegant Serif',      color: 'bg-stone-800' },
    { id: 'classic',       name: 'Executive Slate',    color: 'bg-slate-800' },
    { id: 'minimal',       name: 'Clean Standard',     color: 'bg-slate-500' },
    { id: 'modern',        name: 'Modern Professional',color: 'bg-blue-600' },
    { id: 'modern2',       name: 'Modern Split',       color: 'bg-indigo-600' },
    { id: 'impact',        name: 'Dark Impact',        color: 'bg-slate-900' },
    { id: 'creative',      name: 'Modern Center',      color: 'bg-blue-500' },
    { id: 'sidebar-left',  name: 'Logic Sidebar',      color: 'bg-indigo-700' },
    { id: 'sidebar-right', name: 'Refined Right',      color: 'bg-slate-700' },
    { id: 'split',         name: 'Dual Split',         color: 'bg-blue-800' },
    { id: 'grid',          name: 'Compact Grid',       color: 'bg-emerald-700' },
];

const SKILLS_POOL = [
    'Team Collaboration', 'Microsoft Office', 'Customer Service', 'Problem Solving',
    'Project Management', 'Data Analysis', 'Time Management', 'Research Skills',
    'Attention to Detail', 'Communication', 'Problem Resolution', 'Team Building',
    'Leadership', 'Critical Thinking', 'Adaptability', 'Public Speaking', 
    'Agile Methodology', 'SQL', 'JavaScript', 'Python', 'React', 'Java', 'UI/UX Design'
];

// ─── Main Component ───────────────────────────────────────────────────────────
const ResumeCreator = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const resumeRef = useRef();

    const [formData, setFormData] = useState(EMPTY_RESUME);
    const [wizardStep, setWizardStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
    const GEMINI_MODEL = 'gemini-1.5-flash';
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [atsLoading, setAtsLoading] = useState(false);
    const [atsResult, setAtsResult] = useState(null);
    const [atsCompany, setAtsCompany] = useState('');
    const [atsRole, setAtsRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [summaryTargetRole, setSummaryTargetRole] = useState('');
    const [summaryHighlights, setSummaryHighlights] = useState('');
    const [skillSearch, setSkillSearch] = useState('');
    const [summaryOptions, setSummaryOptions] = useState([]);
    const [showSummaryOptions, setShowSummaryOptions] = useState(false);
    const [selectedSummaryIdx, setSelectedSummaryIdx] = useState(0);
    const [activeExtraSubSection, setActiveExtraSubSection] = useState(null);
    const [isAISuggestingSkills, setIsAISuggestingSkills] = useState(false);
    const [aiSuggestedSkills, setAiSuggestedSkills] = useState([]);
    const [isProjectAILoading, setIsProjectAILoading] = useState(null); // stores index

    // ─── Persistence ───
    useEffect(() => {
        const saved = localStorage.getItem('resumiq_draft');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse draft', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('resumiq_draft', JSON.stringify(formData));
    }, [formData]);

    const activeSection = WIZARD_STEPS[wizardStep].id;

    // Load existing resume or handle navigation state
    useEffect(() => {
        if (location.state?.activeSection) {
            const stepIdx = WIZARD_STEPS.findIndex(s => s.id === location.state.activeSection);
            if (stepIdx !== -1) setWizardStep(stepIdx);
        } else if (location.state?.analyze) {
            setWizardStep(WIZARD_STEPS.length - 1); // Go to Analyze step
        }
    }, [location.state]);

    // Set field value
    const setField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    // List management
    const addListItem = (key) => {
        setFormData(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), { ...NEW_ITEMS[key], _key: Date.now() }]
        }));
    };

    const updateListItem = (key, index, field, val) => {
        const newList = [...formData[key]];
        newList[index] = { ...newList[index], [field]: val };
        setFormData(prev => ({ ...prev, [key]: newList }));
    };

    const removeListItem = (key, index) => {
        setFormData(prev => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
        }));
    };

    // AI Functions — powered by Google Gemini Flash (free tier)
    const callGemini = async (prompt) => {
        if (!GEMINI_KEY || GEMINI_KEY === 'AIzaSyD-placeholder-replace-with-real-key') {
            const lp = prompt.toLowerCase();
            console.warn('No API key. Simulating AI response.');
            
            if (lp.includes('list exactly 12 must-have professional skills')) {
                const roleMatch = prompt.match(/for a "(.*?)" role/i);
                const role = roleMatch ? roleMatch[1].toLowerCase() : '';
                
                if (role.includes('software') || role.includes('developer') || role.includes('engineer') || role.includes('coder')) {
                    return "JavaScript, Python, React.js, Node.js, Problem Solving, Git/GitHub, SQL/NoSQL Databases, Agile Methodologies, API Development, Team Collaboration, Communication, System Architecture";
                } else if (role.includes('design') || role.includes('ux') || role.includes('ui')) {
                    return "Figma, User Research, UI Design, Wireframing, Adobe Creative Suite, Empathy, Prototyping, Usability Testing, Collaboration, Typography, HTML/CSS, Visual Design";
                } else if (role.includes('data') || role.includes('analy')) {
                    return "SQL, Python, Data Visualization, Tableau, Critical Thinking, Excel, Communication, Statistics, Machine Learning, Power BI, Problem Solving, Data Cleansing";
                } else if (role.includes('market') || role.includes('sales')) {
                    return "SEO/SEM, Content Strategy, Social Media Management, Data Analytics, Communication, Google Analytics, Copywriting, Creativity, Email Marketing, Campaign Management, Lead Generation, Adaptability";
                } else {
                    return "Communication, Problem Solving, Time Management, Adaptability, Teamwork, Critical Thinking, Leadership, Project Management, Customer Focus, Tech Savviness, Organization, Creativity";
                }
            }
            
            if (lp.includes('distinct, professional resume summary paragraphs')) {
                return "Passionate and results-driven professional dedicated to delivering high-quality solutions and continuous improvement. Proven ability to thrive in collaborative environments. ### Detail-oriented specialist with deep expertise in analyzing requirements and building scalable processes. Committed to leveraging technical skills to drive project success. ### Dynamic leader and effective communicator, skilled at managing complex projects from conception to deployment while empowering team members to perform at their best.";
            }
            
            if (lp.includes('ats (applicant tracking system) resume scorer')) {
                let score = 15;
                let suggestions = [
                    "Your resume is almost completely empty! Please fill out your profile details.",
                    "Add your work experience, projects, and education in the wizard steps.",
                    "Ensure you include skills matching your target job description."
                ];
                
                try {
                    const jsonStr = prompt.substring(prompt.indexOf('{'), prompt.lastIndexOf('}') + 1);
                    const resumeData = JSON.parse(jsonStr);
                    
                    if (resumeData.name || (resumeData.skills && resumeData.skills.length > 0) || (resumeData.experience && resumeData.experience.length > 0)) {
                        score = 45;
                        suggestions = [
                            "You've started filling out your resume, but it needs significantly more detail.",
                            "Add quantifiable metrics (e.g., 'increased sales by 20%') to your experiences.",
                            "Your keywords don't fully match the job description yet. Review the required skills."
                        ];
                        
                        if (resumeData.skills && resumeData.skills.length >= 3 && resumeData.experience && resumeData.experience.length >= 1) {
                            score = 78;
                            suggestions = [
                                "Include more quantifiable metrics to prove your past impact.",
                                "Add missing technical keywords from the job description directly into your skills section.",
                                "Tailor your professional summary to mention the specific industry of the target company."
                            ];
                        }
                    }
                } catch(e) {
                    // Fallback to empty score if parsing fails
                }

                return JSON.stringify({
                    atsScore: score,
                    matchPercentage: score > 10 ? score - 7 : 5,
                    suggestions
                });
            }
            
            if (lp.includes('project description for a resume')) {
                return "Successfully architected and developed a robust system solution that streamlined internal workflows and enhanced user engagement. Played a key role in the full development lifecycle, collaborating with cross-functional teams to ensure on-time delivery.";
            }

            return "Simulated AI content. Please configure your API key for true generation.";
        }
        
        const url = `/gemini-api/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });
        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody?.error?.message || `Gemini API Error: ${response.status}`);
        }
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    };

    const handleAISuggestSkills = async () => {
        if (!skillSearch || skillSearch.length < 2) return;
        setIsAISuggestingSkills(true);
        try {
            const prompt = `List exactly 12 must-have professional skills for a "${skillSearch}" role. Mix technical (hard) and interpersonal (soft) skills. Output ONLY a comma-separated list of skill names. No numbering, no explanations, no markdown.`;
            const raw = await callGemini(prompt);
            const skills = raw.split(',').map(s => s.trim().replace(/^[-*•\d.]+\s*/, '')).filter(s => s.length > 1 && s.length < 60);
            setAiSuggestedSkills(prev => [...new Set([...prev, ...skills])]);
        } catch (err) {
            alert('AI Error: ' + err.message);
        } finally {
            setIsAISuggestingSkills(false);
        }
    };

    const handleGenerateSummary = async () => {
        if (!summaryTargetRole) return alert('Please enter your target role first!');
        setSummaryLoading(true);
        try {
            const skillsList = formData.skills.map(s => s.name).join(', ') || 'various professional skills';
            const expLine = formData.experiences[0] ? `${formData.experiences[0].role} at ${formData.experiences[0].company}` : 'relevant industry positions';
            const prompt = `Write exactly 3 distinct, professional resume summary paragraphs for a candidate applying for the role of "${summaryTargetRole}".

Candidate details:
- Name: ${formData.fullName || 'the candidate'}
- Most recent experience: ${expLine}
- Key skills: ${skillsList}
- Personal highlights to include: ${summaryHighlights || 'strong work ethic, results-driven mindset'}

Rules:
1. Each summary must be 2-3 impactful sentences
2. Each must have a different tone: Option 1 = achievement-focused, Option 2 = skills-focused, Option 3 = leadership-focused
3. Separate the 3 options with the exact delimiter: ###
4. Do NOT include labels like "Option 1" — just the summary text
5. Do NOT use markdown, bullet points, or asterisks`;
            const raw = await callGemini(prompt);
            const options = raw.split('###').map(s => s.trim().replace(/\*\*/g, '').replace(/^Option \d+[:\s]*/i, '')).filter(s => s.length > 20).slice(0, 3);
            if (options.length === 0) throw new Error('AI returned an empty response. Try again.');
            setSummaryOptions(options);
            setShowSummaryOptions(true);
        } catch (err) {
            alert('AI Error: ' + err.message);
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleAIProjectDescription = async (index) => {
        const project = formData.projects[index];
        if (!project.title) return alert('Please enter a project title first');
        setIsProjectAILoading(index);
        try {
            const prompt = `Write a concise 2-sentence professional project description for a resume. Project title: "${project.title}". Focus on the purpose, technologies/approach used, and its measurable impact or outcome. Be specific and avoid clichés. Output only the description, no labels or markdown.`;
            const description = await callGemini(prompt);
            updateListItem('projects', index, 'description', description.replace(/\*\*/g, '').trim());
        } catch (err) {
            alert('AI Error: ' + err.message);
        } finally {
            setIsProjectAILoading(null);
        }
    };

    const handleATSAnalysis = async () => {
        if (!jobDescription || !atsCompany || !atsRole) return alert('Please enter Company, Role, and Job Description');
        setAtsLoading(true);
        try {
            const resumeSummary = {
                name: formData.fullName,
                skills: formData.skills.map(s => s.name),
                experience: formData.experiences.map(e => `${e.role} at ${e.company}: ${e.description}`),
                education: formData.educations.map(e => `${e.degree} in ${e.fieldOfStudy} from ${e.institution}`),
                summary: formData.summary,
                projects: formData.projects.map(p => p.title),
            };
            const prompt = `You are an ATS (Applicant Tracking System) resume scorer.

Job Details:
- Company: ${atsCompany}
- Role: ${atsRole}
- Job Description: ${jobDescription}

Resume:
${JSON.stringify(resumeSummary, null, 2)}

Analyze the resume against the job posting and return ONLY valid JSON with this EXACT structure (no markdown, no explanation, just raw JSON):
{"atsScore": <number 0-100>, "matchPercentage": <number 0-100>, "suggestions": ["<specific actionable tip 1>", "<specific actionable tip 2>", "<specific actionable tip 3>"]}`;
            const raw = await callGemini(prompt);
            const clean = raw.replace(/```json|```/g, '').trim();
            const jsonMatch = clean.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('AI returned unexpected format. Please try again.');
            setAtsResult(JSON.parse(jsonMatch[0]));
        } catch (err) {
            alert('AI Error: ' + err.message);
        } finally {
            setAtsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await resumeService.create(formData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            alert('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

     const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
        documentTitle: formData.resumeTitle,
        pageStyle: `
            @page { 
                size: auto; 
                margin: 0mm; 
            }
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .no-print { display: none !important; }
            }
        `
    });

    const goNext = () => setWizardStep(s => Math.min(s + 1, WIZARD_STEPS.length - 1));
    const goPrev = () => setWizardStep(s => Math.max(s - 1, 0));

    return (
        <div className="min-h-screen pt-16 flex bg-white dark:bg-slate-900 overflow-hidden font-['Inter']">
            {/* ── Progress & Nav ── */}
            <aside className="w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 hidden md:flex flex-col h-[calc(100vh-64px)] fixed left-0 overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Wizard</h2>
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full" title="AI Powered by Gemini">
                            <Sparkles size={11} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">AI On</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Project Name</label>
                        <input 
                            className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            value={formData.resumeTitle || 'Untitled Resume'}
                            onChange={e => setField('resumeTitle', e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        {WIZARD_STEPS.map((step, idx) => (
                            <div 
                                key={step.id} 
                                className={`flex gap-4 group cursor-pointer p-2 rounded-2xl transition-all ${idx === wizardStep ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`} 
                                onClick={() => setWizardStep(idx)}
                            >
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                                        idx < wizardStep ? 'bg-emerald-500 border-emerald-500 text-white' : 
                                        idx === wizardStep ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40' : 
                                        'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400'
                                    }`}>
                                        {idx < wizardStep ? <CheckCircle size={14} /> : idx + 1}
                                    </div>
                                    {idx !== WIZARD_STEPS.length - 1 && (
                                        <div className={`w-0.5 flex-1 min-h-[16px] my-1 ${idx < wizardStep ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-700'}`} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-xs font-black uppercase tracking-tighter mb-0.5 transition-colors ${
                                        idx === wizardStep ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600'
                                    }`}>{step.label}</p>
                                    <p className="text-[10px] text-slate-400 font-medium leading-none">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 md:ml-64 flex flex-col lg:flex-row h-[calc(100vh-80px)]">
                {/* Editor */}
                <section className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-500 ${wizardStep < 2 ? 'bg-slate-50/30' : ''}`}>
                    <div className={`mx-auto pb-40 transition-all duration-500 ${wizardStep < 2 ? 'max-w-4xl' : 'max-w-xl'}`}>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Step: Options */}
                                {activeSection === 'options' && (
                                    <div className="space-y-10">
                                        <SectionHeader title="Let's build your base" subtitle="Start with your visual preferences" />
                                        <div className="grid grid-cols-2 gap-6">
                                            <ChoiceCard 
                                                active={formData.usePhoto} 
                                                onClick={() => { setField('usePhoto', true); setTimeout(goNext, 400); }}
                                                icon={<User size={32} />}
                                                label="Resume with Photo"
                                                desc="Ideal for creative roles"
                                            />
                                            <ChoiceCard 
                                                active={!formData.usePhoto} 
                                                onClick={() => { setField('usePhoto', false); setTimeout(goNext, 400); }}
                                                icon={<Briefcase size={32} />}
                                                label="No Photo"
                                                desc="Traditional corporate standard"
                                            />
                                        </div>

                                        <div className="pt-8">
                                            <label className="text-sm font-black text-slate-700 dark:text-slate-300 block mb-4 uppercase tracking-wider">Choose Theme Color</label>
                                            <div className="flex flex-wrap gap-4">
                                                {['#2563eb', '#059669', '#7c3aed', '#db2777', '#ea580c', '#334155'].map(c => (
                                                    <button 
                                                        key={c}
                                                        onClick={() => { setField('themeColor', c); setTimeout(goNext, 600); }}
                                                        className={`w-12 h-12 rounded-2xl border-4 transition-all ${formData.themeColor === c ? 'border-white ring-4 ring-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step: Template */}
                                {activeSection === 'template' && (
                                    <div className="space-y-8">
                                        <SectionHeader title="Pick Your Perfect Design" subtitle="Choose from 10 premium, AI-optimized layouts" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {TEMPLATES.map(t => (
                                                <div
                                                    key={t.id}
                                                    className={`group relative rounded-[40px] overflow-hidden bg-white border-4 transition-all hover:translate-y-[-10px] hover:shadow-[0_45px_70px_-20px_rgba(0,0,0,0.25)] flex flex-col ${
                                                        formData.templateId === t.id ? 'border-primary-500 shadow-2xl' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                                >
                                                    <div className="aspect-[3/4.2] relative bg-slate-100/50 p-6 overflow-hidden">
                                                        {/* Mock Resume Rendering */}
                                                        <TemplateMockup type={t.id} usePhoto={formData.usePhoto} color={formData.themeColor} />
                                                        
                                                        {/* Hover Overlay */}
                                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                                            <button 
                                                                onClick={() => { setField('templateId', t.id); setTimeout(goNext, 400); }}
                                                                className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl scale-90 group-hover:scale-100 transition-all hover:bg-primary-700"
                                                            >
                                                                Choose Template
                                                            </button>
                                                        </div>
                                                        
                                                        {formData.templateId === t.id && (
                                                            <div className="absolute top-4 right-4 bg-primary-600 text-white p-2 rounded-full shadow-lg">
                                                                <CheckCircle size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
                                                        <h5 className="text-base font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{t.name}</h5>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 font-bold uppercase">{t.id.includes('sidebar') || t.id === 'split' ? 'Professional 2-Col' : 'Classic 1-Col'}</span>
                                                            {t.id === 'ats' && <span className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md font-bold uppercase italic">ATS Ready</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step: Personal */}
                                {activeSection === 'personal' && (
                                    <div className="space-y-8">
                                        <SectionHeader title="Contact Information" subtitle="How can employers reach you?" />
                                        
                                        {formData.usePhoto && (
                                            <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700">
                                                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden text-slate-400">
                                                    <User size={40} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase mb-1">Profile Photo</h4>
                                                    <p className="text-xs text-slate-500 mb-4">Click below to upload your professional headshot</p>
                                                    <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-primary-600 hover:shadow-md transition-all">
                                                        Upload Image
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label="Full Name" value={formData.fullName} onChange={v => setField('fullName', v)} />
                                            <FormInput label="Job Title" placeholder="e.g. Senior Software Engineer" value={formData.resumeTitle} onChange={v => setField('resumeTitle', v)} />
                                            <FormInput label="Email Address" value={formData.email} onChange={v => setField('email', v)} />
                                            <FormInput label="Phone Number" value={formData.phone} onChange={v => setField('phone', v)} />
                                            <FormInput label="Location" placeholder="City, Country" value={formData.location} onChange={v => setField('location', v)} />
                                            <FormInput label="LinkedIn Profile" value={formData.linkedin} onChange={v => setField('linkedin', v)} />
                                            <div className="col-span-2">
                                                <FormInput label="Portfolio / Website" value={formData.website} onChange={v => setField('website', v)} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step: Experience */}
                                {activeSection === 'experience' && (
                                    <ListEditor
                                        title="Work History"
                                        items={formData.experiences}
                                        onAdd={() => addListItem('experiences')}
                                        onRemove={i => removeListItem('experiences', i)}
                                        renderItem={(item, i) => (
                                            <ItemCard>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormInput label="Company" value={item.company} onChange={v => updateListItem('experiences', i, 'company', v)} />
                                                    <FormInput label="Role" value={item.role} onChange={v => updateListItem('experiences', i, 'role', v)} />
                                                    <FormInput label="Start Date" value={item.startDate} onChange={v => updateListItem('experiences', i, 'startDate', v)} />
                                                    <FormInput label="End Date" value={item.endDate} onChange={v => updateListItem('experiences', i, 'endDate', v)} />
                                                    <div className="col-span-2 pt-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Description</label>
                                                        <textarea 
                                                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 rounded-2xl text-sm"
                                                            rows={4}
                                                            placeholder="Key responsibilities and achievements..."
                                                            value={item.description}
                                                            onChange={e => updateListItem('experiences', i, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </ItemCard>
                                        )}
                                    />
                                )}

                                {/* Step: Education */}
                                {activeSection === 'education' && (
                                    <ListEditor
                                        title="Academic Background"
                                        items={formData.educations}
                                        onAdd={() => addListItem('educations')}
                                        onRemove={i => removeListItem('educations', i)}
                                        renderItem={(item, i) => (
                                            <ItemCard>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormInput label="Institution" value={item.institution} onChange={v => updateListItem('educations', i, 'institution', v)} />
                                                    <FormInput label="Degree / Diploma" value={item.degree} onChange={v => updateListItem('educations', i, 'degree', v)} />
                                                    <FormInput label="Field of Study" value={item.fieldOfStudy} onChange={v => updateListItem('educations', i, 'fieldOfStudy', v)} />
                                                    <FormInput label="Graduation Date" value={item.graduationDate} onChange={v => updateListItem('educations', i, 'graduationDate', v)} />
                                                </div>
                                            </ItemCard>
                                        )}
                                    />
                                )}

                                {/* Step: Skills */}
                                {activeSection === 'skills' && (
                                    <div className="space-y-10">
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-4xl font-black text-slate-900 leading-tight">We recommend including <span className="text-blue-600 italic">6-8 skills</span></h2>
                                            <p className="text-slate-500 font-medium">Choose skills that align with job requirements. Show employers you are confident in your work!</p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            {/* Skill Recommender */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-[40px] p-8 flex flex-col h-[500px]">
                                                <div className="relative mb-6">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search by job title or skill..."
                                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-300"
                                                        value={skillSearch}
                                                        onChange={e => setSkillSearch(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && handleAISuggestSkills()}
                                                    />
                                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                </div>
                                                
                                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                                    <div className="flex flex-wrap gap-2">
                                                        {(() => {
                                                            const filtered = [...SKILLS_POOL, ...aiSuggestedSkills].filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()));
                                                            
                                                            if (filtered.length === 0 && skillSearch.length > 2) {
                                                                return (
                                                                    <div className="w-full py-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
                                                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                                                            <Sparkles size={32} />
                                                                        </div>
                                                                        <h4 className="text-slate-900 font-black mb-2">No local skills found for "{skillSearch}"</h4>
                                                                        <p className="text-slate-400 text-xs mb-6 max-w-[200px]">Want me to research the top skills for this role using AI?</p>
                                                                        <button 
                                                                            onClick={handleAISuggestSkills}
                                                                            className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-100"
                                                                        >
                                                                            Get AI Recommendations
                                                                        </button>
                                                                    </div>
                                                                );
                                                            }

                                                            return filtered.map(skill => {
                                                                const isAdded = formData.skills.some(s => s.name === skill);
                                                                return (
                                                                    <button
                                                                        key={skill}
                                                                        onClick={() => {
                                                                            if (!isAdded) {
                                                                                setFormData(prev => ({
                                                                                    ...prev,
                                                                                    skills: [...prev.skills, { name: skill, proficiency: 'Intermediate', _key: Date.now() }]
                                                                                }));
                                                                            }
                                                                        }}
                                                                        className={`px-4 py-2.5 rounded-full text-xs font-black border-2 transition-all flex items-center gap-2 ${
                                                                            isAdded 
                                                                            ? 'bg-blue-50 border-blue-200 text-blue-600 cursor-default' 
                                                                            : 'bg-white border-slate-100 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                                                                        }`}
                                                                    >
                                                                        <Plus size={14} className={isAdded ? 'hidden' : ''} />
                                                                        {isAdded && <CheckCircle size={14} />}
                                                                        {skill}
                                                                    </button>
                                                                );
                                                            });
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skill List Editor */}
                                            <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 flex flex-col h-[500px]">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-xl font-black text-slate-900">Your Selected Skills</h3>
                                                    <button onClick={() => addListItem('skills')} className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline">
                                                        <Plus size={14} /> Add Custom
                                                    </button>
                                                </div>
                                                
                                                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                                    {formData.skills.map((item, i) => (
                                                        <div key={item._key || i} className="group relative bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-transparent hover:border-blue-200 transition-all">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input 
                                                                    className="bg-transparent font-black text-slate-800 dark:text-white outline-none text-sm"
                                                                    value={item.name} 
                                                                    onChange={v => updateListItem('skills', i, 'name', v.target.value)} 
                                                                    placeholder="Skill name..."
                                                                />
                                                                <select 
                                                                    className="bg-transparent font-bold text-slate-400 text-xs outline-none cursor-pointer hover:text-blue-600"
                                                                    value={item.proficiency}
                                                                    onChange={e => updateListItem('skills', i, 'proficiency', e.target.value)}
                                                                >
                                                                    <option>Beginner</option>
                                                                    <option>Intermediate</option>
                                                                    <option>Advanced</option>
                                                                    <option>Expert</option>
                                                                </select>
                                                            </div>
                                                            <button 
                                                                onClick={() => removeListItem('skills', i)}
                                                                className="absolute -top-2 -right-2 p-1.5 bg-white text-red-500 rounded-full shadow-md border border-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {formData.skills.length === 0 && (
                                                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                                <Sparkles className="text-slate-300" size={32} />
                                                            </div>
                                                            <p className="text-slate-400 font-medium italic">Add skills from the list on the left or write your own!</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step: Projects */}
                                {activeSection === 'projects' && (
                                    <ListEditor
                                        title="Side Work & Projects"
                                        items={formData.projects}
                                        onAdd={() => addListItem('projects')}
                                        onRemove={i => removeListItem('projects', i)}
                                        renderItem={(item, i) => (
                                            <ItemCard>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormInput label="Project Title" value={item.title} onChange={v => updateListItem('projects', i, 'title', v)} />
                                                    <FormInput label="Demo Link / URL" value={item.demoUrl} onChange={v => updateListItem('projects', i, 'demoUrl', v)} />
                                                    <div className="col-span-2">
                                                         <div className="flex justify-between items-center mb-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-tighter">Project Description</label>
                                                            <button 
                                                                onClick={() => handleAIProjectDescription(i)}
                                                                disabled={isProjectAILoading === i || !item.title}
                                                                className="text-[10px] font-black text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-lg transition-all"
                                                            >
                                                                {isProjectAILoading === i ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                                AI Enhance
                                                            </button>
                                                         </div>
                                                         <textarea 
                                                             className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 font-medium placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-100"
                                                             rows={3}
                                                             placeholder="Describe what you built and the impact it had..."
                                                             value={item.description}
                                                             onChange={e => updateListItem('projects', i, 'description', e.target.value)}
                                                        />
                                                     </div>
                                                </div>
                                            </ItemCard>
                                        )}
                                    />
                                )}

                                {/* Step: Extra (Additional Details Selection) */}
                                {activeSection === 'extra' && (
                                    <div className="space-y-10">
                                        {!activeExtraSubSection ? (
                                            <>
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">You got this! Last up → Additional Details</p>
                                                    <h2 className="text-5xl font-black text-slate-900 leading-tight">Select <span className="text-blue-600 italic">(optional)</span> details to add</h2>
                                                    <p className="text-slate-500 font-medium">Pick anything you'd like to highlight that's not already on your resume.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                                                    {[
                                                        { id: 'languages',    label: 'Languages',           icon: <Globe size={32} /> },
                                                        { id: 'awards',       label: 'Awards & Honors',    icon: <Award size={32} /> },
                                                        { id: 'certificates', label: 'Certifications',     icon: <CheckCircle size={32} /> },
                                                        { id: 'interests',    label: 'Interests',           icon: <Heart size={32} /> },
                                                        { id: 'links',        label: 'Social Links',        icon: <Target size={32} /> },
                                                        { id: 'references',   label: 'References',          icon: <User size={32} /> },
                                                    ].map(extra => (
                                                        <button 
                                                            key={extra.id}
                                                            onClick={() => setActiveExtraSubSection(extra.id)}
                                                            className="p-8 bg-white border border-slate-200 rounded-[32px] hover:border-blue-600 hover:shadow-xl transition-all flex items-center gap-6 group text-left"
                                                        >
                                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                                                                {extra.icon}
                                                            </div>
                                                            <span className="text-xl font-black text-slate-800">{extra.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                                <button 
                                                    onClick={() => setActiveExtraSubSection(null)}
                                                    className="flex items-center gap-2 text-sm font-black text-blue-600 hover:underline mb-4"
                                                >
                                                    <ArrowLeft size={16} /> Back to Sections
                                                </button>

                                                {activeExtraSubSection === 'languages' && (
                                                    <ListEditor title="Languages" items={formData.languages || []} onAdd={() => addListItem('languages')} onRemove={i => removeListItem('languages', i)}
                                                        renderItem={(item, i) => (
                                                            <ItemCard>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <FormInput label="Language" value={item.language} onChange={v => updateListItem('languages', i, 'language', v)} placeholder="e.g. English, Spanish" />
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Proficiency</label>
                                                                        <select 
                                                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all appearance-none"
                                                                            value={item.proficiency || 'Conversational'}
                                                                            onChange={e => updateListItem('languages', i, 'proficiency', e.target.value)}
                                                                        >
                                                                            <option value="Basic">Basic</option>
                                                                            <option value="Moderate">Moderate</option>
                                                                            <option value="Conversational">Conversational</option>
                                                                            <option value="Fluent">Fluent</option>
                                                                            <option value="Native">Native</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </ItemCard>
                                                        )}
                                                    />
                                                )}
                                                {activeExtraSubSection === 'awards' && (
                                                    <ListEditor title="Awards & Honors" items={formData.achievements || []} onAdd={() => addListItem('achievements')} onRemove={i => removeListItem('achievements', i)}
                                                        renderItem={(item, i) => (
                                                            <ItemCard>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="col-span-2">
                                                                        <FormInput label="Award Name" value={item.title} onChange={v => updateListItem('achievements', i, 'title', v)} />
                                                                    </div>
                                                                    <div className="col-span-2 pt-2">
                                                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Description</label>
                                                                        <textarea 
                                                                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 rounded-2xl text-sm"
                                                                            rows={2}
                                                                            placeholder="Briefly describe the award or achievement..."
                                                                            value={item.description}
                                                                            onChange={e => updateListItem('achievements', i, 'description', e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </ItemCard>
                                                        )}
                                                    />
                                                )}
                                                {activeExtraSubSection === 'certificates' && (
                                                    <ListEditor title="Certifications" items={formData.certificates || []} onAdd={() => addListItem('certificates')} onRemove={i => removeListItem('certificates', i)}
                                                        renderItem={(item, i) => <ItemCard>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="col-span-2">
                                                                    <FormInput label="Certification Name" value={item.title} onChange={v => updateListItem('certificates', i, 'title', v)} />
                                                                </div>
                                                                <FormInput label="Issuer" value={item.issuer} onChange={v => updateListItem('certificates', i, 'issuer', v)} placeholder="e.g. Coursera, AWS" />
                                                                <FormInput label="Date" value={item.date} onChange={v => updateListItem('certificates', i, 'date', v)} placeholder="e.g. 2023" />
                                                            </div>
                                                        </ItemCard>} 
                                                    />
                                                )}
                                                {activeExtraSubSection === 'links' && (
                                                    <ListEditor title="Social Links" items={formData.extraLinks || []} onAdd={() => addListItem('extraLinks')} onRemove={i => removeListItem('extraLinks', i)}
                                                        renderItem={(item, i) => <ItemCard><div className="flex gap-4"><FormInput label="Platform" value={item.label} onChange={v => updateListItem('extraLinks', i, 'label', v)} /><FormInput label="URL" value={item.url} onChange={v => updateListItem('extraLinks', i, 'url', v)} /></div></ItemCard>} 
                                                    />
                                                )}
                                                {activeExtraSubSection === 'interests' && (
                                                    <ListEditor title="Interests" items={formData.interests || []} onAdd={() => addListItem('interests')} onRemove={i => removeListItem('interests', i)}
                                                        renderItem={(item, i) => <ItemCard><FormInput label="Interest" value={item.name} onChange={v => updateListItem('interests', i, 'name', v)} /></ItemCard>} 
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step: Summary & AI */}
                                {activeSection === 'summary' && !showSummaryOptions && (
                                    <div className="space-y-8">
                                        <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[32px] text-white shadow-xl">
                                            <div className="flex items-center gap-4 mb-6">
                                                <Sparkles size={32} />
                                                <h3 className="text-2xl font-black">AI Summary Builder</h3>
                                            </div>
                                            <div className="space-y-4 mb-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-80">What is your Target Role?</label>
                                                    <input 
                                                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/40"
                                                        placeholder="e.g. Lead Software Engineer"
                                                        value={summaryTargetRole}
                                                        onChange={e => setSummaryTargetRole(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-80">Key Highlights (Optional)</label>
                                                    <textarea 
                                                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/40"
                                                        placeholder="e.g. 5 projects delivered, managed 20 people..."
                                                        rows={2}
                                                        value={summaryHighlights}
                                                        onChange={e => setSummaryHighlights(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleGenerateSummary}
                                                disabled={summaryLoading || !summaryTargetRole}
                                                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {summaryLoading ? <Loader className="animate-spin" /> : <Zap size={18} />}
                                                Generate Professional Summary Options
                                            </button>
                                        </div>
                                        <label className="block text-sm font-bold text-slate-600 ml-2">Your Current Summary</label>
                                        <textarea 
                                            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[32px] text-slate-800 font-medium leading-relaxed outline-none focus:ring-4 focus:ring-blue-100"
                                            rows={8}
                                            value={formData.summary}
                                            onChange={e => setField('summary', e.target.value)}
                                        />
                                    </div>
                                )}

                                {activeSection === 'summary' && showSummaryOptions && (
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-black text-slate-900">Here are AI-generated summaries based on your experience</h2>
                                            <button onClick={() => setShowSummaryOptions(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {summaryOptions.map((opt, i) => (
                                                <div 
                                                    key={i}
                                                    onClick={() => setSelectedSummaryIdx(i)}
                                                    className={`p-6 rounded-[32px] border-4 cursor-pointer transition-all ${selectedSummaryIdx === i ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center ${selectedSummaryIdx === i ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                                                            {selectedSummaryIdx === i && <div className="w-2 h-2 bg-white rounded-full" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                                                    <Sparkles size={8} /> Personalized for you
                                                                </span>
                                                            </div>
                                                            <h4 className="font-black text-slate-900 mb-1">{i === 0 ? 'Impactful & Direct' : i === 1 ? 'Skill-Focused' : 'Leadership Orientated'}</h4>
                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{opt}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-10">
                                            <button 
                                                onClick={() => { setShowSummaryOptions(false); setField('summary', ''); }}
                                                className="text-blue-600 font-black hover:underline"
                                            >
                                                I'll add my own
                                            </button>
                                            <button 
                                                onClick={() => { setField('summary', summaryOptions[selectedSummaryIdx]); setShowSummaryOptions(false); }}
                                                className="px-10 py-5 bg-blue-600 text-white rounded-[32px] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
                                            >
                                                Use this version
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Analyze Step */}
                                {/* Step: ATS Analysis & Finalize */}
                                {activeSection === 'analyze' && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Master of your destiny → Smart Score Analysis</p>
                                            <h2 className="text-5xl font-black text-slate-900 leading-tight">Does your resume <span className="text-blue-600 italic">fit</span> the role?</h2>
                                            <p className="text-slate-500 font-medium">Research your target company and role for a perfect match.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <FormInput label="Company Name" value={atsCompany} onChange={setAtsCompany} placeholder="e.g. Google, Amazon, Startup" />
                                                    <FormInput label="Target Role" value={atsRole} onChange={setAtsRole} placeholder="e.g. Senior Java Developer" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Paste Job Description</label>
                                                    <textarea 
                                                        className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[32px] text-sm font-medium text-slate-700 dark:text-slate-300 min-h-[300px] outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/10 transition-all placeholder:text-slate-200"
                                                        placeholder="Copy the detailed job description here..."
                                                        value={jobDescription}
                                                        onChange={e => setJobDescription(e.target.value)}
                                                    />
                                                </div>
                                                <button 
                                                    onClick={handleATSAnalysis}
                                                    disabled={atsLoading}
                                                    className="w-full py-6 bg-slate-900 dark:bg-slate-700 text-white rounded-[32px] font-black text-xl hover:bg-black dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 dark:shadow-none"
                                                >
                                                    {atsLoading ? <Loader size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                                    {atsLoading ? 'Analyzing Resume...' : 'Analyze with AI'}
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                {atsResult ? (
                                                    <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                                                        <div className="p-10 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[48px] shadow-2xl relative overflow-hidden group">
                                                            <div className={`absolute top-0 right-0 p-8 font-black text-[120px] leading-none opacity-[0.03] text-slate-900 dark:text-white select-none group-hover:opacity-10 transition-opacity`}>
                                                                {atsResult.atsScore}
                                                            </div>
                                                            <div className="relative z-10">
                                                                <div className="flex items-center justify-between mb-8">
                                                                    <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                                                                        atsResult.atsScore > 80 ? 'bg-emerald-100 text-emerald-600' : 
                                                                        atsResult.atsScore > 50 ? 'bg-blue-100 text-blue-600' : 
                                                                        'bg-red-100 text-red-600'
                                                                    }`}>
                                                                        {atsResult.atsScore > 80 ? 'Excellent Match' : 
                                                                         atsResult.atsScore > 50 ? 'Good Potential' : 
                                                                         'Needs Improvement'}
                                                                    </div>
                                                                    <div className="text-slate-300 font-black">ATS v4.0</div>
                                                                </div>
                                                                <div className="flex items-end gap-2 mb-2">
                                                                    <span className="text-8xl font-black text-slate-900 dark:text-white leading-none">{atsResult.atsScore}</span>
                                                                    <span className="text-2xl font-black text-slate-400 mb-2">% SCORE</span>
                                                                </div>
                                                                
                                                                <p className="text-base font-bold mb-10 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 shadow-inner">
                                                                    {atsResult.atsScore > 80 ? '🌟 Your score is GREAT! You are ready to apply.' : 
                                                                     atsResult.atsScore > 50 ? '⚠️ Your score is GOOD, but it should be improved for the highest impact.' : 
                                                                     '🚨 Your score SHOULD BE IMPROVED before you apply.'}
                                                                </p>

                                                                <div className="space-y-4">
                                                                   <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">How to increase your ATS score:</h4>
                                                                   {atsResult.suggestions.map((s, i) => (
                                                                       <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 group/item hover:border-blue-200 transition-colors">
                                                                           <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">{i+1}</div>
                                                                           <p className="flex-1 text-sm font-bold text-slate-600 dark:text-slate-400">{s}</p>
                                                                       </div>
                                                                   ))}
                                                                </div>
                                                                
                                                                <div className="flex gap-4 mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
                                                                    <button 
                                                                        onClick={handleSave} 
                                                                        className="flex-1 py-5 bg-slate-900 dark:bg-slate-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                                                                    >
                                                                        <Save size={16} className="inline mr-2 -mt-1" /> {saveSuccess ? 'Saved to Cloud!' : 'Finalize & Save'}
                                                                    </button>
                                                                    <button 
                                                                        onClick={handlePrint} 
                                                                        className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                                                                    >
                                                                        <Download size={16} className="inline mr-2 -mt-1" /> Export Final PDF
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-50/50 dark:bg-slate-900/50 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[48px] flex flex-col items-center justify-center p-12 text-center opacity-70">
                                                        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-xl">
                                                            <Target size={40} className="text-slate-200 dark:text-slate-600" />
                                                        </div>
                                                        <h3 className="text-2xl font-black text-slate-300 dark:text-slate-600 mb-2">Ready for Analysis</h3>
                                                        <p className="text-slate-300 dark:text-slate-600 font-medium mb-10 max-w-sm mx-auto">Get your ATS Score first to unlock your final resume export. Ensure your resume is optimized before you apply!</p>
                                                        
                                                        <div className="flex gap-4 w-full justify-center">
                                                            <button onClick={handleSave} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 underline underline-offset-4">Skip & Save</button>
                                                            <span className="text-slate-300">|</span>
                                                            <button onClick={handlePrint} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 underline underline-offset-4">Skip & Export</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        {wizardStep > 0 && (
                            <div className="fixed bottom-0 left-64 right-[420px] xl:right-[500px] p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-between items-center z-50">
                                <button onClick={goPrev} className="flex items-center gap-2 font-black text-slate-400 hover:text-slate-900 transition-colors">
                                    <ArrowLeft size={20} /> Back
                                </button>
                                {wizardStep < WIZARD_STEPS.length - 1 ? (
                                    <button onClick={goNext} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-2 shadow-xl hover:bg-slate-800">
                                        Next Component <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wizard Complete</p>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Preview Panel: Only show after base options & template selection (Step 2+) */}
                {wizardStep >= 2 && (
                    <section className="hidden lg:flex flex-col w-[420px] xl:w-[500px] shadow-2xl bg-slate-900 overflow-hidden relative border-l border-slate-800">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest z-10">
                            Live Template Preview
                        </div>
                        <div className="flex-1 overflow-y-auto p-12 bg-[#2a2a2e]">
                            <div ref={resumeRef} className="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] w-full min-h-[1123px] mx-auto transform hover:scale-[1.01] transition-transform origin-top">
                                {formData.templateId === 'modern'        && <ModernTemplate        data={formData} />}
                                {formData.templateId === 'classic'       && <ClassicTemplate       data={formData} />}
                                {formData.templateId === 'ats'           && <ATSTemplate           data={formData} />}
                                {formData.templateId === 'elegant'       && <ElegantTemplate       data={formData} />}
                                {formData.templateId === 'minimal'       && <MinimalTemplate       data={formData} />}
                                {formData.templateId === 'impact'        && <OneColumnImpact        data={formData} />}
                                {formData.templateId === 'creative'      && <OneColumnCreative      data={formData} />}
                                {formData.templateId === 'sidebar-left'  && <TwoColumnSidebarLeft  data={formData} />}
                                {formData.templateId === 'sidebar-right' && <TwoColumnSidebarRight data={formData} />}
                                {formData.templateId === 'split'         && <TwoColumnSplit         data={formData} />}
                                {formData.templateId === 'grid'          && <TwoColumnGrid          data={formData} />}
                                {formData.templateId === 'modern2'       && <TwoColumnModern        data={formData} />}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

const MOCK_DATA = {
    fullName: 'Alex Morgan',
    resumeTitle: 'Senior Software Engineer',
    email: 'alex.m@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexm',
    website: 'alexmorgan.dev',
    summary: 'Dynamic and results-oriented Software Engineer with 8+ years of experience designing and building scalable backend systems and robust architectures. Proven leadership in guiding cross-functional agile teams to deliver high-visibility technical projects. Expert at modernizing legacy applications and driving significant performance improvements.',
    themeColor: '#2563eb',
    usePhoto: false,
    experiences: [
        { role: 'Senior Platform Engineer', company: 'TechNova Solutions', startDate: 'Mar 2020', endDate: 'Present', description: '• Architected and deployed a distributed microservices ecosystem using Go and Kubernetes, improving system uptime to 99.99%.\n• Managed a team of 5 backend developers, overseeing technical roadmaps and code quality.\n• Reduced average API response times by 40% through aggressive query optimization and Redis caching strategies.' },
        { role: 'Software Engineer', company: 'CloudStream Data Inc.', startDate: 'Jun 2016', endDate: 'Feb 2020', description: '• Developed high-performance data pipelines handling over 5 million daily events.\n• Migrated on-premise REST APIs to AWS Serverless Lambda functions, reducing infrastructure costs by 35%.\n• Collaborated with product managers to define scaling solutions for enterprise clients.' }
    ],
    educations: [
        { degree: 'M.S. in Computer Science', institution: 'Stanford University', graduationDate: 'May 2016', fieldOfStudy: 'Distributed Systems' },
        { degree: 'B.S. in Software Engineering', institution: 'University of California', graduationDate: 'May 2014', fieldOfStudy: 'Computer Science' }
    ],
    skills: [
        { name: 'JavaScript / TypeScript', proficiency: 'Expert' }, { name: 'Python', proficiency: 'Expert' }, { name: 'Go', proficiency: 'Advanced' },
        { name: 'React.js', proficiency: 'Advanced' }, { name: 'Node.js', proficiency: 'Expert' }, { name: 'Kubernetes', proficiency: 'Intermediate' },
        { name: 'AWS Cloud', proficiency: 'Advanced' }, { name: 'System Design', proficiency: 'Expert' }
    ],
    projects: [
        { title: 'Global E-Commerce Restructure', demoUrl: 'github.com/alexm/ecommerce', description: 'Rebuilt checkout architecture allowing seamless international payments processing. Handled $10M+ in transaction volume within the first month.' },
        { title: 'Open Source UI Library', demoUrl: 'npmjs.com/package/alex-ui', description: 'Created a highly accessible component library adopted by over 2,000 active projects.' }
    ],
    certificates: [
        { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2022' },
        { title: 'Certified Kubernetes Administrator', issuer: 'Cloud Native Foundation', date: '2021' }
    ],
    achievements: [
        { title: 'Performance Award 2023', description: 'Recognized for top engineering contributions and mentoring junior staff.' }
    ],
    languages: [
        { language: 'English', proficiency: 'Native' }, { language: 'Spanish', proficiency: 'Conversational' }
    ]
};

const TemplateMockup = ({ type, usePhoto, color }) => {
    let Template = ModernTemplate;
    if (type === 'classic') Template = ClassicTemplate;
    if (type === 'ats') Template = ATSTemplate;
    if (type === 'elegant') Template = ElegantTemplate;
    if (type === 'minimal') Template = MinimalTemplate;
    if (type === 'impact') Template = OneColumnImpact;
    if (type === 'creative') Template = OneColumnCreative;
    if (type === 'sidebar-left') Template = TwoColumnSidebarLeft;
    if (type === 'sidebar-right') Template = TwoColumnSidebarRight;
    if (type === 'split') Template = TwoColumnSplit;
    if (type === 'grid') Template = TwoColumnGrid;
    if (type === 'modern2') Template = TwoColumnModern;

    const previewData = { ...MOCK_DATA, usePhoto, themeColor: color || '#2563eb' };

    return (
        <div className="w-full h-full relative overflow-hidden bg-white shadow-xl rounded pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
            <div style={{ transform: 'scale(0.32)', transformOrigin: 'top left', width: '800px', height: '1123px' }}>
               <Template data={previewData} />
            </div>
        </div>
    );
};

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1 leading-tight">{title}</h2>
        {subtitle && <p className="text-slate-500 font-medium text-base">{subtitle}</p>}
    </div>
);

const FormInput = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input 
            type="text" 
            value={value || ''} 
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || `Enter ${label}...`}
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all"
        />
    </div>
);

const ChoiceCard = ({ active, onClick, icon, label, desc }) => (
    <button 
        onClick={onClick}
        className={`p-8 rounded-[40px] border-4 transition-all text-left flex flex-col h-full ${active ? 'border-blue-600 bg-blue-50/20 shadow-xl' : 'border-slate-100 hover:border-slate-300'}`}
    >
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-inner ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {icon}
        </div>
        <h4 className="text-xl font-black mb-1">{label}</h4>
        <p className="text-sm text-slate-500 font-medium">{desc}</p>
        <div className="mt-auto pt-6">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                {active && <CheckCircle size={14} className="text-white" />}
            </div>
        </div>
    </button>
);

const ItemCard = ({ children }) => (
    <div className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] shadow-sm mb-6">
        {children}
    </div>
);

const ListEditor = ({ title, items, onAdd, onRemove, renderItem }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-8">{title}</h3>
            <button onClick={onAdd} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200">
                <Plus size={18} /> Add New
            </button>
        </div>
        <div className="space-y-6">
            {items.map((item, i) => (
                <div key={item._key || i} className="relative group">
                    <button onClick={() => onRemove(i)} className="absolute -top-3 -right-3 p-2 bg-white text-red-500 rounded-full shadow-xl border border-red-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 z-10">
                        <Trash2 size={16} />
                    </button>
                    {renderItem(item, i)}
                </div>
            ))}
        </div>
    </div>
);

const ScoreCard = ({ label, value, color }) => (
    <div className={`p-6 rounded-[32px] flex items-center gap-4 ${color === 'blue' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">
            {value}
        </div>
        <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
            <p className="text-lg font-black">{value}% Optimized</p>
        </div>
    </div>
);

export default ResumeCreator;
