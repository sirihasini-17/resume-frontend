import React from 'react';

const TwoColumnModern = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#1e3a8a', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    const SubSection = ({ title, children }) => (
        <div style={{ marginBottom: '24px' }}>
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
        <div className="bg-white text-slate-800 font-['Inter'] flex" style={{ minHeight: '1123px' }}>
            {/* Sidebar (Right 35%) */}
            <aside style={{ flex: '0 0 320px', backgroundColor: '#fdfdfd', borderLeft: '1px solid #eef1f4', padding: '60px 48px' }}>
                {usePhoto && (
                    <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#e2e8f0', border: `2px solid ${themeColor}`, marginBottom: '32px' }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                    </div>
                )}

                <SubSection title="Contact">
                    <div style={{ fontSize: '12px', lineHeight: '2', color: '#64748b' }}>
                        {email    && <p>{email}</p>}
                        {phone    && <p>{phone}</p>}
                        {location && <p>{location}</p>}
                    </div>
                </SubSection>

                <SubSection title="Technical Skills">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {skills.map((skill, i) => (
                            <div key={i} style={{ fontSize: '11px', padding: '10px 14px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontWeight: '700', color: '#0f172a' }}>
                                {skill.name}
                            </div>
                        ))}
                    </div>
                </SubSection>
            </aside>

            {/* Main Content (Left 65%) */}
            <main style={{ flex: 1, padding: '60px 48px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', letterSpacing: '-2px', lineHeight: '0.9', marginBottom: '16px' }}>
                        {fullName || 'Your Name'}
                    </h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '40px', height: '4px', backgroundColor: themeColor }} />
                        <div style={{ width: '80px', height: '4px', backgroundColor: `${themeColor}40` }} />
                    </div>
                </header>

                {summary && (
                    <div style={{ marginBottom: '40px' }}>
                        <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#444', lineHeight: '1.9' }}>{summary}</p>
                    </div>
                )}

                <SubSection title="Experience">
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{exp.role}</h3>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <h4 style={{ fontSize: '12px', fontWeight: '700', color: themeColor }}>{exp.company}</h4>
                            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '10px' }}>{exp.description}</p>
                        </div>
                    ))}
                </SubSection>
            </main>
        </div>
    );
};

export default TwoColumnModern;
