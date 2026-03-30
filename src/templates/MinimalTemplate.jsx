import React from 'react';

const MinimalTemplate = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, experiences = [], educations = [], skills = [],
        projects = [], certificates = [], achievements = [],
        languages = [], interests = [], customSections = []
    } = data;

    return (
        <div style={{ background: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, sans-serif', lineHeight: '1.7', padding: '60px', minHeight: '1123px' }}>
            {/* Header */}
            <header style={{ marginBottom: '48px', borderBottom: '1px solid #e2e8f0', paddingBottom: '32px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: '1', marginBottom: '16px' }}>
                    {fullName || 'Your Name'}
                </h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '8px 24px', fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', width: 'fit-content' }}>
                    {email    && <span>{email}</span>}
                    {phone    && <span>{phone}</span>}
                    {location && <span>{location}</span>}
                    {linkedin && <span>{linkedin}</span>}
                    {website  && <span>{website}</span>}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <MinSection label="Brief">
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.9', fontWeight: '500' }}>{summary}</p>
                </MinSection>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <MinSection label="Work">
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ display: 'flex', gap: '40px', marginBottom: '28px' }}>
                            <div style={{ width: '120px', flexShrink: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '3px' }}>
                                {exp.startDate && <div>{exp.startDate}</div>}
                                {exp.endDate   && <div>{exp.endDate}</div>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>{exp.role}</h3>
                                <p style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>{exp.company}</p>
                                {exp.description && (
                                    <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{exp.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </MinSection>
            )}

            {/* Education */}
            {educations.length > 0 && (
                <MinSection label="Learn">
                    {educations.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '14px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{edu.degree}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}</h3>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{edu.institution}{edu.graduationDate ? ` · ${edu.graduationDate}` : ''}</p>
                        </div>
                    ))}
                </MinSection>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <MinSection label="Expertise">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                        {skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: '12px', fontWeight: '700', color: '#334155', fontStyle: 'italic', borderBottom: '1px solid #bfdbfe', paddingBottom: '1px' }}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </MinSection>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <MinSection label="Built">
                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{proj.title}</h3>
                                {proj.demoUrl && <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '600' }}>{proj.demoUrl}</span>}
                            </div>
                            {proj.description && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{proj.description}</p>}
                        </div>
                    ))}
                </MinSection>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
                <MinSection label="Certified">
                    {certificates.map((cert, i) => (
                        <p key={i} style={{ fontSize: '12px', marginBottom: '5px', color: '#334155' }}>
                            <strong>{cert.title}</strong>
                            {cert.issuer && <span style={{ color: '#94a3b8' }}> · {cert.issuer}</span>}
                            {cert.date   && <span style={{ color: '#94a3b8' }}> · {cert.date}</span>}
                        </p>
                    ))}
                </MinSection>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <MinSection label="Achieved">
                    {achievements.map((ach, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{ach.title}</p>
                            {ach.description && <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{ach.description}</p>}
                        </div>
                    ))}
                </MinSection>
            )}

            {/* Languages & Interests */}
            {(languages.length > 0 || interests.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                    {languages.length > 0 && (
                        <MinSection label="Speak">
                            {languages.map((lang, i) => (
                                <p key={i} style={{ fontSize: '12px', color: '#334155', marginBottom: '3px' }}>
                                    <strong>{lang.language}</strong> <span style={{ color: '#94a3b8' }}>— {lang.proficiency}</span>
                                </p>
                            ))}
                        </MinSection>
                    )}
                    {interests.length > 0 && (
                        <MinSection label="Care About">
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.9' }}>
                                {interests.map(i => i.name).filter(Boolean).join('  ·  ')}
                            </p>
                        </MinSection>
                    )}
                </div>
            )}

            {/* Custom Sections */}
            {customSections.map((cs, i) => (
                cs.title && (
                    <MinSection key={i} label={cs.title}>
                        <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{cs.content}</p>
                    </MinSection>
                )
            ))}
        </div>
    );
};

const MinSection = ({ label, children }) => (
    <div style={{ display: 'flex', gap: '40px', marginBottom: '36px' }}>
        <div style={{ width: '80px', flexShrink: 0, paddingTop: '3px' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.25em' }}>{label}</span>
        </div>
        <div style={{ flex: 1 }}>{children}</div>
    </div>
);

export default MinimalTemplate;
