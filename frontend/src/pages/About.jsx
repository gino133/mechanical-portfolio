import React from 'react';
import { GiGraduateCap, GiCertificate, GiTrophy } from 'react-icons/gi';

const About = () => {
    const skills = [
        { name: 'Thiết kế cơ khí', level: 90 },
        { name: 'SolidWorks / AutoCAD', level: 95 },
        { name: 'Tính toán kết cấu', level: 85 },
        { name: 'Gia công CNC', level: 80 },
        { name: 'Điện công nghiệp', level: 75 },
        { name: 'Lập trình PLC', level: 70 }
    ];

    const certificates = [
        { year: 2023, name: 'Chứng chỉ SolidWorks Professional', icon: <GiCertificate /> },
        { year: 2022, name: 'Khóa học Tự động hóa Siemens', icon: <GiGraduateCap /> },
        { year: 2021, name: 'Giải thưởng Sáng tạo Kỹ thuật', icon: <GiTrophy /> }
    ];

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <h1 style={styles.title}>Giới thiệu về tôi</h1>
                    <p style={styles.subtitle}>Kỹ sư Cơ khí - Chuyên gia Tự động hóa</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.grid}>
                        <div>
                            <img 
                                src="https://via.placeholder.com/400x500?text=Avatar" 
                                alt="Profile" 
                                style={styles.avatar}
                            />
                        </div>
                        <div>
                            <h2 style={styles.sectionTitle}>Hồ sơ cá nhân</h2>
                            <p style={styles.text}>
                                Tôi là Nguyễn Văn A, kỹ sư cơ khí với hơn 10 năm kinh nghiệm trong lĩnh vực 
                                thiết kế, chế tạo và gia công cơ khí chính xác. Tốt nghiệp Đại học Bách khoa 
                                Hà Nội chuyên ngành Cơ khí chế tạo máy.
                            </p>
                            <p style={styles.text}>
                                Bên cạnh đó, tôi cũng có kiến thức sâu rộng về hệ thống điện công nghiệp và 
                                tự động hóa, giúp tôi có thể đưa ra các giải pháp toàn diện cho khách hàng.
                            </p>
                            
                            <div style={styles.infoGrid}>
                                <div><strong>📧 Email:</strong> nguyenvana@email.com</div>
                                <div><strong>📱 Điện thoại:</strong> 0123 456 789</div>
                                <div><strong>📍 Địa chỉ:</strong> Hà Nội, Việt Nam</div>
                                <div><strong>🎓 Học vấn:</strong> Đại học Bách khoa Hà Nội</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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

            <section style={styles.downloadSection}>
                <div className="container" style={styles.downloadContainer}>
                    <h2>Tải CV của tôi</h2>
                    <p>Xem chi tiết hồ sơ năng lực và kinh nghiệm làm việc</p>
                    <button className="btn btn-primary" style={styles.downloadBtn}>
                        📄 Tải CV (PDF) - Tiếng Việt
                    </button>
                    <button className="btn btn-outline" style={styles.downloadBtn}>
                        📄 Tải CV (PDF) - English
                    </button>
                </div>
            </section>
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
        margin: '8px'
    }
};

export default About;