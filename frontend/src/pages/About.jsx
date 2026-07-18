import React, { useState } from 'react';
import { GiGraduateCap, GiTrophy } from 'react-icons/gi';
import { useSettings } from '../contexts/SettingsContext';
import ImageLightbox from '../components/common/ImageLightbox';
import { heroBackgroundStyle } from '../utils/heroBackground';

const About = () => {
    const { settings } = useSettings();
    const [lightboxImage, setLightboxImage] = useState(null);

    const skills = settings.skills && settings.skills.length > 0 ? settings.skills : [];
    const certificates = settings.certificates && settings.certificates.length > 0
        ? settings.certificates.map(c => ({ ...c, icon: <GiGraduateCap /> }))
        : [];

    return (
        <div>
            <section style={{ ...styles.hero, ...heroBackgroundStyle(settings.aboutHeroImage) }}>
                <div className="container">
                    <h1 style={styles.title}>Giới thiệu về tôi</h1>
                    <p style={styles.subtitle}>{settings.heroSubtitle}</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div className="about-grid">
                        <div>
                            <img
                                src={settings.avatarImage}
                                alt="Profile"
                                style={{ ...styles.avatar, cursor: 'zoom-in' }}
                                onClick={() => setLightboxImage(settings.avatarImage)}
                            />
                        </div>
                        <div>
                            <h2 style={styles.sectionTitle}>Hồ sơ cá nhân</h2>
                            <div
                                className="blog-content"
                                onClick={(e) => { if (e.target.tagName === 'IMG') setLightboxImage(e.target.src); }}
                                dangerouslySetInnerHTML={{ __html: settings.aboutIntro1 }}
                            />
                            <div
                                className="blog-content"
                                onClick={(e) => { if (e.target.tagName === 'IMG') setLightboxImage(e.target.src); }}
                                dangerouslySetInnerHTML={{ __html: settings.aboutIntro2 }}
                            />

                            <div className="about-info-grid">
                                <div><strong>📧 Email:</strong> {settings.email}</div>
                                <div><strong>📱 Điện thoại:</strong> {settings.phone}</div>
                                <div><strong>📍 Địa chỉ:</strong> {settings.address}</div>
                                <div><strong>🎓 Học vấn:</strong> {settings.education}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {skills.length > 0 && (
                <section style={styles.sectionBg}>
                    <div className="container">
                        <h2 style={styles.sectionTitle}>Kỹ năng chuyên môn</h2>
                        {skills.map((skill, index) => (
                            <div key={index} style={styles.skillItem}>
                                <div style={styles.skillName}>{skill.name}</div>
                                <div style={styles.skillBar}>
                                    <div style={{ ...styles.skillFill, width: `${skill.level}%` }}></div>
                                </div>
                                <span style={styles.skillPercent}>{skill.level}%</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {certificates.length > 0 && (
                <section style={styles.section}>
                    <div className="container">
                        <h2 style={styles.sectionTitle}>Chứng chỉ & Giải thưởng</h2>
                        <div style={styles.timeline}>
                            {certificates.map((cert, index) => (
                                <div key={index} style={styles.timelineItem}>
                                    <div style={styles.timelineIcon}>{cert.icon}</div>
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineYear}>{cert.year}</div>
                                        <h3 style={styles.timelineTitle}>{cert.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {(settings.cvUrlVi || settings.cvUrlEn) && (
                <section style={styles.downloadSection}>
                    <div className="container" style={styles.downloadContainer}>
                        <h2>Tải CV của tôi</h2>
                        <p>Xem chi tiết hồ sơ năng lực và kinh nghiệm làm việc</p>
                        {settings.cvUrlVi && (
                            <a href={settings.cvUrlVi} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={styles.downloadBtn}>
                                📄 Tải CV (PDF) - Tiếng Việt
                            </a>
                        )}
                        {settings.cvUrlEn && (
                            <a href={settings.cvUrlEn} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={styles.downloadBtn}>
                                📄 Tải CV (PDF) - English
                            </a>
                        )}
                    </div>
                </section>
            )}

            <ImageLightbox src={lightboxImage} alt="Ảnh đại diện" onClose={() => setLightboxImage(null)} />
        </div>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '60px 0',
        textAlign: 'center'
    },
    title: {
        fontSize: '36px',
        marginBottom: '16px'
    },
    subtitle: {
        fontSize: '18px',
        opacity: 0.9
    },
    section: {
        padding: '60px 0'
    },
    sectionBg: {
        padding: '60px 0',
        background: 'var(--bg-light)'
    },
    sectionTitle: {
        fontSize: '28px',
        color: 'var(--primary-color)',
        marginBottom: '32px',
        textAlign: 'center'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '48px',
        alignItems: 'start'
    },
    avatar: {
        width: '100%',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)'
    },
    text: {
        lineHeight: '1.8',
        marginBottom: '16px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginTop: '24px'
    },
    skillItem: {
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    skillName: {
        width: '150px',
        fontWeight: '500'
    },
    skillBar: {
        flex: 1,
        height: '8px',
        background: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    skillFill: {
        height: '100%',
        background: 'var(--primary-color)',
        borderRadius: '4px'
    },
    skillPercent: {
        width: '50px',
        textAlign: 'right'
    },
    timeline: {
        maxWidth: '600px',
        margin: '0 auto'
    },
    timelineItem: {
        display: 'flex',
        gap: '20px',
        marginBottom: '24px'
    },
    timelineIcon: {
        fontSize: '24px',
        color: 'var(--primary-color)'
    },
    timelineContent: {
        flex: 1
    },
    timelineYear: {
        fontWeight: 'bold',
        color: 'var(--accent-color)'
    },
    timelineTitle: {
        fontSize: '18px',
        marginTop: '4px'
    },
    downloadSection: {
        background: 'var(--primary-color)',
        color: 'white',
        padding: '60px 0',
        textAlign: 'center'
    },
    downloadContainer: {
        textAlign: 'center'
    },
    downloadBtn: {
        margin: '8px',
        display: 'inline-block',
        textDecoration: 'none'
    }
};

export default About;
