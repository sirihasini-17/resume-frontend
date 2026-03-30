import React from 'react';

const ElegantTemplate = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#1f2937', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '24px' }}>
            <h2 style={{
                fontSize: '14px', fontWeight: '400', color: themeColor,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                borderBottom: `1px solid ${themeColor}40`, paddingBottom: '8px',
                marginBottom: '16px', fontFamily: '"Times New Roman", Times, serif'
            }}>
                {title}
            </h2>
            {children}
        </div>
    );

    return (
        <div className="bg-white text-slate-800 flex flex-col" style={{ minHeight: '1123px', padding: '64px', fontFamily: '"Times New Roman", Times, serif', borderTop: `12px solid ${themeColor}` }}>
            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '32px' }}>
                {usePhoto && (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f3f4f6', border: `1px solid ${themeColor}`, margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                )}
                <h1 style={{ fontSize: '36px', fontWeight: 'normal', color: themeColor, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {fullName || 'Your Name'}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '12px', fontStyle: 'italic', color: '#4b5563' }}>
                    {email    && <span>{email}</span>}
                    {phone    && <span>| {phone}</span>}
                    {location && <span>| {location}</span>}
                    {linkedin && <span>| {linkedin}</span>}
                    {website  && <span>| {website}</span>}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <div style={{ marginBottom: '32px', textAlign: 'center', padding: '0 32px' }}>
                    <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8', fontStyle: 'italic' }}>{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <Section title="Professional Experience">
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827' }}>{exp.company}</h3>
                                <span style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                                    {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                                </span>
                            </div>
                            <h4 style={{ fontSize: '13px', fontStyle: 'italic', color: themeColor, marginBottom: '8px' }}>{exp.role}</h4>
                            {exp.description && (
                                <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{exp.description}</p>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {/* Education */}
            {educations.length > 0 && (
                <Section title="Education">
                    {educations.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{edu.institution}</h3>
                                <span style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>{edu.graduationDate}</span>
                            </div>
                            <h4 style={{ fontSize: '13px', fontStyle: 'italic', color: themeColor, marginTop: '2px' }}>
                                {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                            </h4>
                        </div>
                    ))}
                </Section>
            )}

            {/* Two-column layout for remaining sections if necessary, or just stack */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Skills */}
                {skills.length > 0 && (
                    <Section title="Expertise & Skills">
                        <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: '1.8' }}>
                            {skills.map((skill, i) => (
                                <li key={i} style={{ marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{skill.name}</span>
                                    {skill.proficiency && skill.proficiency !== 'Intermediate' && ` - ${skill.proficiency}`}
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                <div>
                    {/* Projects */}
                    {projects.length > 0 && (
                        <Section title="Projects">
                            {projects.map((proj, i) => (
                                <div key={i} style={{ marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>{proj.title}</h3>
                                    {proj.description && <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.6', marginTop: '4px' }}>{proj.description}</p>}
                                </div>
                            ))}
                        </Section>
                    )}
                    
                    {/* Certificates */}
                    {certificates.length > 0 && (
                        <Section title="Certifications">
                            {certificates.map((cert, i) => (
                                <div key={i} style={{ marginBottom: '8px', fontSize: '12px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{cert.title}</span>
                                    {cert.issuer && <span style={{ color: '#6b7280', fontStyle: 'italic' }}> · {cert.issuer}</span>}
                                </div>
                            ))}
                        </Section>
                    )}
                </div>
            </div>
            
            {/* Custom Sections */}
            {customSections.map((cs, i) => (
                cs.title && (
                    <Section key={`cs-${i}`} title={cs.title}>
                        <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{cs.content}</p>
                    </Section>
                )
            ))}
        </div>
    );
};

export default ElegantTemplate;
