import React from 'react';

const ModernTemplate = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#2563eb', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    const safeEducations = educations || [];
    const safeExperiences = experiences || [];
    const safeSkills = skills || [];
    const safeProjects = projects || [];
    const safeCertificates = certificates || [];
    const safeAchievements = achievements || [];
    const safeLanguages = languages || [];
    const safeInterests = interests || [];
    const safeCustomSections = customSections || [];

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '24px' }}>
            <h2 style={{
                fontSize: '10px', fontWeight: '900', color: themeColor,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                borderBottom: '1px solid #e2e8f0', paddingBottom: '6px',
                marginBottom: '14px'
            }}>
                {title}
            </h2>
            {children}
        </div>
    );

    return (
        <div className="bg-white text-slate-800 font-['Inter'] leading-relaxed" style={{ minHeight: '1123px', padding: '48px' }}>
            {/* Header */}
            <header style={{ borderBottom: `3px solid ${themeColor}`, paddingBottom: '24px', marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                {usePhoto && (
                    <div style={{ width: '100px', height: '100px', borderRadius: '20px', backgroundColor: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyCenter: 'center', border: `2px solid ${themeColor}` }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                )}
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                        {fullName || 'Your Name'}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {email    && <span>{email}</span>}
                        {phone    && <span>• {phone}</span>}
                        {location && <span>• {location}</span>}
                        {linkedin && <span>• {linkedin}</span>}
                        {website  && <span>• {website}</span>}
                    </div>
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <Section title="Profile">
                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>{summary}</p>
                </Section>
            )}

            {/* Experience */}
            {safeExperiences.length > 0 && (
                <Section title="Experience">
                    {safeExperiences.map((exp, i) => (
                        <div key={i} style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '16px', marginBottom: '18px', position: 'relative' }}>
                            <div style={{ width: '8px', height: '8px', background: themeColor, borderRadius: '50%', position: 'absolute', left: '-5px', top: '5px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{exp.role}</h3>
                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', fontFamily: 'monospace' }}>
                                    {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                                </span>
                            </div>
                            <h4 style={{ fontSize: '12px', fontWeight: '700', color: themeColor, marginBottom: '6px' }}>{exp.company}</h4>
                            {exp.description && (
                                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{exp.description}</p>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {/* Two-column grid for secondary sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Education */}
                {safeEducations.length > 0 && (
                    <Section title="Education">
                        {safeEducations.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '14px' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{edu.degree}</h3>
                                {edu.fieldOfStudy && <p style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>{edu.fieldOfStudy}</p>}
                                <p style={{ fontSize: '11px', color: themeColor, fontWeight: '700', marginTop: '2px' }}>{edu.institution}</p>
                                {edu.graduationDate && <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{edu.graduationDate}</p>}
                            </div>
                        ))}
                    </Section>
                )}

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <Section title="Skills">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {safeSkills.map((skill, i) => (
                                <span key={i} style={{ padding: '3px 10px', background: `${themeColor}10`, color: themeColor, borderRadius: '99px', fontSize: '10px', fontWeight: '700', border: `1px solid ${themeColor}30` }}>
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}
            </div>

            {/* Projects */}
            {safeProjects.length > 0 && (
                <Section title="Projects">
                    {safeProjects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{proj.title}</h3>
                                {proj.demoUrl && <span style={{ fontSize: '10px', color: themeColor, fontWeight: '600' }}>{proj.demoUrl}</span>}
                            </div>
                            {proj.description && <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.6' }}>{proj.description}</p>}
                        </div>
                    ))}
                </Section>
            )}

            {/* Certificates */}
            {safeCertificates.length > 0 && (
                <Section title="Certifications">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {safeCertificates.map((cert, i) => (
                            <div key={i} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{cert.title}</p>
                                <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Achievements */}
            {safeAchievements.length > 0 && (
                <Section title="Achievements">
                    {safeAchievements.map((ach, i) => (
                        <div key={i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${themeColor}` }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{ach.title}</p>
                            {ach.description && <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{ach.description}</p>}
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
};

export default ModernTemplate;
