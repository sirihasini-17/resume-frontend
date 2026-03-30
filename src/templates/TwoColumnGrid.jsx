import React from 'react';

const TwoColumnGrid = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#1e293b', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    const Section = ({ title, color, children }) => (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '900', color: color, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>{title}</h2>
            {children}
        </div>
    );

    return (
        <div style={{ background: '#fff', color: '#1e293b', fontFamily: 'Inter, sans-serif', padding: '48px', minHeight: '1123px' }}>
            {/* Header: Centered on top of grid */}
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', marginBottom: '8px' }}>
                    {fullName || 'Your Name'}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                    {email    && <span>{email}</span>}
                    {phone    && <span>{phone}</span>}
                    {location && <span>{location}</span>}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <Section title="Summary" color={themeColor}>
                    <p style={{ fontSize: '11px', lineHeight: '1.8' }}>{summary}</p>
                </Section>

                <Section title="Expertise" color={themeColor}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: '10px', padding: '4px 10px', backgroundColor: 'white', borderRadius: '4px', border: `1px solid ${themeColor}30`, fontWeight: '700', color: themeColor }}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </Section>

                <div style={{ gridColumn: 'span 2' }}>
                    <Section title="Work Experience" color={themeColor}>
                        {experiences.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '20px', borderLeft: `3px solid ${themeColor}`, paddingLeft: '16px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '800' }}>{exp.role}</h3>
                                <p style={{ fontSize: '12px', color: themeColor, fontWeight: '700' }}>{exp.company}</p>
                                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{exp.description}</p>
                            </div>
                        ))}
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default TwoColumnGrid;
