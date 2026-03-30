import React from 'react';

const OneColumnImpact = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#1e293b', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '28px' }}>
            <h2 style={{
                fontSize: '11px', fontWeight: '900', color: themeColor,
                textTransform: 'uppercase', letterSpacing: '0.15em',
                marginBottom: '12px'
            }}>
                {title}
            </h2>
            {children}
        </div>
    );

    return (
        <div className="bg-white text-slate-800 font-['Inter'] leading-relaxed" style={{ minHeight: '1123px' }}>
            {/* Header: Solid Dark Background */}
            <header style={{ backgroundColor: themeColor, padding: '40px 48px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.3)', minWidth: '60px', textAlign: 'center' }}>
                        <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>
                            {fullName ? fullName.split(' ').map(n => n[0]).join('') : 'DA'}
                        </span>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                            {fullName || 'Your Name'}
                        </h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', fontWeight: '500', opacity: 0.9 }}>
                            {email    && <span>{email}</span>}
                            {phone    && <span>{phone}</span>}
                            {location && <span>{location}</span>}
                        </div>
                    </div>
                </div>
                {usePhoto && (
                    <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)', border: '2px solid white' }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                    </div>
                )}
            </header>

            <div style={{ padding: '48px' }}>
                {/* Summary */}
                {summary && (
                    <Section title="Summary">
                        <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>{summary}</p>
                    </Section>
                )}

                {/* Skills Grid */}
                {skills.length > 0 && (
                    <Section title="Skills">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 40px' }}>
                            {skills.map((skill, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#334155' }}>
                                    <div style={{ width: '4px', height: '4px', backgroundColor: themeColor, borderRadius: '50%' }} />
                                    <span style={{ fontWeight: '600' }}>{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                    <Section title="Experience">
                        {experiences.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{exp.role} / {exp.company}</h3>
                                    <span style={{ fontSize: '11px', fontWeight: '600', color: themeColor }}>
                                        {exp.startDate} - {exp.endDate}
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'pre-line', marginTop: '8px' }}>{exp.description}</p>
                            </div>
                        ))}
                    </Section>
                )}
            </div>
        </div>
    );
};

export default OneColumnImpact;
