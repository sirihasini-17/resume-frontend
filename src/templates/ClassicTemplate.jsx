import React from 'react';

const ClassicTemplate = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#1e293b', experiences = [],
        educations = [], skills = [], projects = [], certificates = [],
        achievements = [], languages = [], interests = [], customSections = []
    } = data;

    const ClassicSection = ({ title, children }) => (
        <div style={{ marginBottom: '24px' }}>
            <h2 style={{
                fontSize: '12px', fontWeight: '900', color: themeColor,
                textTransform: 'uppercase', letterSpacing: '2px',
                borderBottom: `1px solid ${themeColor}20`, paddingBottom: '6px',
                marginBottom: '14px', fontFamily: 'Georgia, serif'
            }}>
                {title}
            </h2>
            {children}
        </div>
    );

    return (
        <div style={{ background: '#fff', color: '#334155', fontFamily: 'Georgia, serif', lineHeight: '1.7', padding: '60px', minHeight: '1123px' }}>
            {/* Header */}
            <header style={{ textAlign: 'center', borderBottom: `2px solid ${themeColor}`, paddingBottom: '24px', marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                {usePhoto && (
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${themeColor}`, marginBottom: '10px' }}>
                         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                )}
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                    {fullName || 'Professional Name'}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '11px', fontStyle: 'italic', color: '#64748b' }}>
                    {email    && <span>{email}</span>}
                    {phone    && <span>| {phone}</span>}
                    {location && <span>| {location}</span>}
                    {linkedin && <span>| {linkedin}</span>}
                    {website  && <span>| {website}</span>}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <ClassicSection title="Professional Summary">
                    <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#475569', lineHeight: '1.9' }}>{summary}</p>
                </ClassicSection>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <ClassicSection title="Professional Experience">
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{exp.role}</h3>
                                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', fontStyle: 'italic', fontWeight: '700' }}>
                                    {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                                </span>
                            </div>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: themeColor, fontStyle: 'italic', marginBottom: '6px' }}>{exp.company}</p>
                            {exp.description && (
                                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{exp.description}</p>
                            )}
                        </div>
                    ))}
                </ClassicSection>
            )}

            {/* Education */}
            {educations.length > 0 && (
                <ClassicSection title="Education">
                    {educations.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div>
                                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>
                                        {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                                    </h3>
                                    <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>{edu.institution}</p>
                                </div>
                                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{edu.graduationDate}</span>
                            </div>
                        </div>
                    ))}
                </ClassicSection>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <ClassicSection title="Core Skills">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {skills.map((skill, i) => (
                            <div key={i} style={{ fontSize: '11px', fontWeight: '600', color: '#475569', paddingLeft: '10px', borderLeft: '2px solid #cbd5e1', fontStyle: 'italic' }}>
                                {skill.name} {skill.proficiency !== 'Intermediate' && <span style={{ color: '#94a3b8' }}>({skill.proficiency})</span>}
                            </div>
                        ))}
                    </div>
                </ClassicSection>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <ClassicSection title="Projects">
                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>{proj.title}</h3>
                                {proj.demoUrl && <span style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>{proj.demoUrl}</span>}
                            </div>
                            {proj.description && <p style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', lineHeight: '1.7' }}>{proj.description}</p>}
                        </div>
                    ))}
                </ClassicSection>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
                <ClassicSection title="Certifications &amp; Licenses">
                    {certificates.map((cert, i) => (
                        <div key={i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <div>
                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{cert.title}</span>
                                {cert.issuer && <span style={{ color: '#64748b', fontStyle: 'italic' }}> · {cert.issuer}</span>}
                            </div>
                            {cert.date && <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px' }}>{cert.date}</span>}
                        </div>
                    ))}
                </ClassicSection>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <ClassicSection title="Achievements &amp; Awards">
                    {achievements.map((ach, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>▸ {ach.title}</p>
                            {ach.description && <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>{ach.description}</p>}
                        </div>
                    ))}
                </ClassicSection>
            )}

            {/* Languages & Interests */}
            {(languages.length > 0 || interests.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {languages.length > 0 && (
                        <ClassicSection title="Languages">
                            {languages.map((lang, i) => (
                                <p key={i} style={{ fontSize: '12px', color: '#475569', marginBottom: '3px' }}>
                                    <strong>{lang.language}</strong> <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>— {lang.proficiency}</span>
                                </p>
                            ))}
                        </ClassicSection>
                    )}
                    {interests.length > 0 && (
                        <ClassicSection title="Interests">
                            <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', lineHeight: '1.8' }}>
                                {interests.map(i => i.name).filter(Boolean).join(', ')}
                            </p>
                        </ClassicSection>
                    )}
                </div>
            )}

            {/* Custom Sections */}
            {customSections.map((cs, i) => (
                cs.title && (
                    <ClassicSection key={i} title={cs.title}>
                        <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{cs.content}</p>
                    </ClassicSection>
                )
            ))}
        </div>
    );
};

const ClassicSection = ({ title, children }) => (
    <div style={{ marginBottom: '24px' }}>
        <h2 style={{
            fontSize: '12px', fontWeight: '900', color: '#0f172a',
            textTransform: 'uppercase', letterSpacing: '2px',
            borderBottom: '1px solid #e2e8f0', paddingBottom: '6px',
            marginBottom: '14px', fontFamily: 'Georgia, serif'
        }}>
            {title}
        </h2>
        {children}
    </div>
);

export default ClassicTemplate;
