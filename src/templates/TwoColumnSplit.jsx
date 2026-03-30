import React from 'react';

const TwoColumnSplit = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#2563eb', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    return (
        <div style={{ background: '#fff', color: '#334155', fontFamily: 'Inter, sans-serif', minHeight: '1123px' }}>
            {/* Split Header */}
            <header style={{ display: 'flex', borderBottom: `8px solid ${themeColor}` }}>
                <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '60px 48px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', letterSpacing: '-2px', marginBottom: '8px' }}>
                        {fullName || 'Your Name'}
                    </h1>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: themeColor, textTransform: 'uppercase', letterSpacing: '3px' }}>
                        {experiences[0]?.role || 'Professional'}
                    </p>
                </div>
                <div style={{ width: '300px', backgroundColor: '#0f172a', padding: '60px 32px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>CONTACT</p>
                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                        {email    && <p>{email}</p>}
                        {phone    && <p>{phone}</p>}
                        {location && <p>{location}</p>}
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', padding: '48px' }}>
                <div style={{ flex: 1, paddingRight: '48px' }}>
                    <Section title="Professional Summary" color={themeColor}>
                        <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#475569' }}>{summary}</p>
                    </Section>

                    <Section title="Experience" color={themeColor}>
                        {experiences.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{exp.role}</h3>
                                <p style={{ fontSize: '12px', color: themeColor, fontWeight: '700', marginBottom: '8px' }}>{exp.company}</p>
                                <p style={{ fontSize: '11px', color: '#64748b' }}>{exp.description}</p>
                            </div>
                        ))}
                    </Section>
                </div>

                <div style={{ width: '240px', borderLeft: '1px solid #f1f5f9', paddingLeft: '48px' }}>
                    <Section title="Skills" color={themeColor}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {skills.map((skill, i) => (
                                <div key={i} style={{ fontSize: '12px', fontWeight: '600' }}>{skill.name}</div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Education" color={themeColor}>
                        {educations.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '12px', fontWeight: '800' }}>{edu.degree}</p>
                                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{edu.institution}</p>
                            </div>
                        ))}
                    </Section>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, color, children }) => (
    <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: '900', color: color, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>{title}</h2>
        {children}
    </div>
);

export default TwoColumnSplit;
