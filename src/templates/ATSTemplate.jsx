import React from 'react';

const ATSTemplate = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#000000', experiences = [],
        educations = [], skills = [], projects = [], certificates = [],
        achievements = [], languages = [], interests = [], customSections = []
    } = data;

    const ATSSection = ({ title, children }) => (
        <div style={{ marginBottom: '18px' }}>
            <h2 style={{
                fontSize: '12px', fontWeight: '900', color: themeColor,
                textTransform: 'uppercase', letterSpacing: '1.5px',
                borderBottom: `1.5px solid ${themeColor}`, paddingBottom: '3px',
                marginBottom: '10px'
            }}>
                {title}
            </h2>
            {children}
        </div>
    );

    return (
        <div style={{ background: '#fff', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', lineHeight: '1.5', padding: '48px', minHeight: '1123px' }}>
            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {usePhoto && (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8fafc', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid #e2e8f0`, marginBottom: '12px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                )}
                <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                    {fullName || 'Your Name'}
                </h1>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#555', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 10px' }}>
                    {location && <span>{location}</span>}
                    {email    && <span>{email}</span>}
                    {phone    && <span>{phone}</span>}
                    {linkedin && <span>{linkedin}</span>}
                    {website  && <span>{website}</span>}
                </div>
            </header>

            {summary && (
                <ATSSection title="Professional Summary">
                    <p style={{ fontSize: '11px', color: '#333', lineHeight: '1.7' }}>{summary}</p>
                </ATSSection>
            )}

            {experiences.length > 0 && (
                <ATSSection title="Work Experience">
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '900', color: '#000' }}>{exp.role}</p>
                                    <p style={{ fontSize: '11px', fontWeight: '700', color: themeColor, fontStyle: 'italic' }}>{exp.company}</p>
                                </div>
                                {(exp.startDate || exp.endDate) && (
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#555', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                                        {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                                    </span>
                                )}
                            </div>
                            {exp.description && (
                                <p style={{ fontSize: '11px', color: '#444', marginTop: '5px', lineHeight: '1.7', whiteSpace: 'pre-line', paddingLeft: '12px' }}>
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    ))}
                </ATSSection>
            )}

            {educations.length > 0 && (
                <ATSSection title="Education">
                    {educations.map((edu, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: '900', color: '#000' }}>
                                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                                </p>
                                <p style={{ fontSize: '11px', fontWeight: '600', color: themeColor, fontStyle: 'italic' }}>{edu.institution}</p>
                            </div>
                            {edu.graduationDate && <span style={{ fontSize: '11px', color: '#555', fontStyle: 'italic' }}>{edu.graduationDate}</span>}
                        </div>
                    ))}
                </ATSSection>
            )}

            {skills.length > 0 && (
                <ATSSection title="Technical Skills">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                        {skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: '11px', fontWeight: '700', color: '#333' }}>
                                • {skill.name}
                                {skill.proficiency && skill.proficiency !== 'Intermediate' && (
                                    <span style={{ fontWeight: '400', color: '#777' }}> ({skill.proficiency})</span>
                                )}
                            </span>
                        ))}
                    </div>
                </ATSSection>
            )}

            {projects.length > 0 && (
                <ATSSection title="Projects">
                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '12px', fontWeight: '900', color: '#000' }}>{proj.title}</p>
                                {proj.demoUrl && <span style={{ fontSize: '10px', color: '#777', fontStyle: 'italic' }}>{proj.demoUrl}</span>}
                            </div>
                            {proj.description && <p style={{ fontSize: '11px', color: '#444', marginTop: '3px', lineHeight: '1.6' }}>{proj.description}</p>}
                        </div>
                    ))}
                </ATSSection>
            )}

            {certificates.length > 0 && (
                <ATSSection title="Certifications">
                    {certificates.map((cert, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                            <span>
                                <strong>{cert.title}</strong>
                                {cert.issuer && <span style={{ color: '#555', fontStyle: 'italic' }}> — {cert.issuer}</span>}
                            </span>
                            {cert.date && <span style={{ color: '#777' }}>{cert.date}</span>}
                        </div>
                    ))}
                </ATSSection>
            )}

            {achievements.length > 0 && (
                <ATSSection title="Achievements">
                    {achievements.map((ach, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                            <p style={{ fontSize: '12px', fontWeight: '900', color: '#000' }}>▸ {ach.title}</p>
                            {ach.description && <p style={{ fontSize: '11px', color: '#555', paddingLeft: '12px' }}>{ach.description}</p>}
                        </div>
                    ))}
                </ATSSection>
            )}

            {languages.length > 0 && (
                <ATSSection title="Languages">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                        {languages.map((lang, i) => (
                            <span key={i} style={{ fontSize: '11px', fontWeight: '700', color: '#333' }}>
                                {lang.language}
                                {lang.proficiency && <span style={{ fontWeight: '400', color: '#777' }}> ({lang.proficiency})</span>}
                            </span>
                        ))}
                    </div>
                </ATSSection>
            )}

            {interests.length > 0 && (
                <ATSSection title="Interests">
                    <p style={{ fontSize: '11px', color: '#555' }}>
                        {interests.map(i => i.name).filter(Boolean).join(' • ')}
                    </p>
                </ATSSection>
            )}

            {customSections.map((cs, i) => (
                cs.title && (
                    <ATSSection key={i} title={cs.title}>
                        <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{cs.content}</p>
                    </ATSSection>
                )
            ))}
        </div>
    );
};

const ATSSection = ({ title, children }) => (
    <div style={{ marginBottom: '18px' }}>
        <h2 style={{
            fontSize: '12px', fontWeight: '900', color: '#000',
            textTransform: 'uppercase', letterSpacing: '1.5px',
            borderBottom: '1.5px solid #000', paddingBottom: '3px',
            marginBottom: '10px'
        }}>
            {title}
        </h2>
        {children}
    </div>
);

export default ATSTemplate;
