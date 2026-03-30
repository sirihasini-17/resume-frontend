import React from 'react';

const OneColumnCreative = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#2563eb', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{
                fontSize: '14px', fontWeight: '900', color: '#0f172a',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                textAlign: 'center', marginBottom: '16px',
                borderBottom: `2px solid ${themeColor}15`, paddingBottom: '8px'
            }}>
                {title}
            </h2>
            {children}
        </div>
    );

    return (
        <div className="bg-white text-slate-800 font-['Inter'] leading-relaxed" style={{ minHeight: '1123px', padding: '60px' }}>
            {/* Header: Centered & Minimal */}
            <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${themeColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: themeColor, fontSize: '20px', fontWeight: '900' }}>
                        {fullName ? fullName.split(' ').map(n => n[0]).join('') : 'DA'}
                    </div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {fullName || 'Your Name'}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                        {email    && <span>{email}</span>}
                        {phone    && <span>• {phone}</span>}
                        {location && <span>• {location}</span>}
                    </div>
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <Section title="Summary">
                    <p style={{ fontSize: '12px', color: '#334155', textAlign: 'center', maxWidth: '80%', margin: '0 auto', lineHeight: '2' }}>{summary}</p>
                </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <Section title="Skills">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                        {skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: '11px', fontWeight: '700', padding: '6px 14px', backgroundColor: `${themeColor}10`, color: themeColor, borderRadius: '4px', border: `1px solid ${themeColor}20` }}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            {/* Exp */}
            {experiences.length > 0 && (
                <Section title="Experience">
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{exp.role} / {exp.company}</h3>
                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.8' }}>{exp.description}</p>
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
};

export default OneColumnCreative;
