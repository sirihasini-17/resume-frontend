import React from 'react';

const TwoColumnSidebarLeft = ({ data }) => {
    const {
        fullName, email, phone, location, linkedin, website,
        summary, usePhoto, themeColor = '#1e3a8a', experiences = [], 
        educations = [], skills = [], projects = [], certificates = [], 
        achievements = [], languages = [], interests = [], customSections = []
    } = data || {};

    const SidebarSection = ({ title, children }) => (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{
                fontSize: '11px', fontWeight: '900', color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase', letterSpacing: '0.2em',
                marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px'
            }}>
                {title}
            </h2>
            {children}
        </div>
    );

    const MainSection = ({ title, children }) => (
        <div style={{ marginBottom: '36px' }}>
            <h2 style={{
                fontSize: '14px', fontWeight: '900', color: themeColor,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
                <span>{title}</span>
                <div style={{ h: '1px', flex: 1, backgroundColor: `${themeColor}20` }} />
            </h2>
            {children}
        </div>
    );

    return (
        <div className="bg-white text-slate-800 font-['Inter'] flex" style={{ minHeight: '1123px' }}>
            {/* Sidebar (Left 30%) */}
            <aside style={{ width: '280px', backgroundColor: themeColor, padding: '48px 32px', color: 'white' }}>
                {usePhoto && (
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', marginBottom: '32px' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                )}
                
                <SidebarSection title="Contact">
                    <div style={{ fontSize: '11px', lineHeight: '2.5', color: 'rgba(255,255,255,0.8)' }}>
                        {email    && <p>{email}</p>}
                        {phone    && <p>{phone}</p>}
                        {location && <p>{location}</p>}
                        {linkedin && <p>{linkedin}</p>}
                    </div>
                </SidebarSection>
                
                <SidebarSection title="Skills">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: '10px', padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '99px', fontWeight: '600' }}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </SidebarSection>
            </aside>

            {/* Main Content (Right 70%) */}
            <main style={{ flex: 1, padding: '60px 48px' }}>
                <header style={{ marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', marginBottom: '4px' }}>
                        {fullName || 'Your Name'}
                    </h1>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px' }}>
                        {experiences[0]?.role || 'Professional'}
                    </p>
                </header>

                {summary && (
                    <MainSection title="About Me">
                        <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.8' }}>{summary}</p>
                    </MainSection>
                )}

                {experiences.length > 0 && (
                    <MainSection title="Experience">
                        {experiences.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{exp.role}</h3>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <h4 style={{ fontSize: '12px', color: themeColor, fontWeight: '700', marginBottom: '8px' }}>{exp.company}</h4>
                                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.8' }}>{exp.description}</p>
                            </div>
                        ))}
                    </MainSection>
                )}
            </main>
        </div>
    );
};

export default TwoColumnSidebarLeft;
