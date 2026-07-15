import React from 'react';
import { Link } from 'react-router-dom';
import { GiGears, GiElectric } from 'react-icons/gi';
import { useSettings } from '../../contexts/SettingsContext';

const IntroSection = () => {
    const { settings } = useSettings();

    const stats = [
        { number: settings.statYears, label: settings.statYearsLabel },
        { number: settings.statProjects, label: settings.statProjectsLabel },
        { number: settings.statClients, label: settings.statClientsLabel }
    ];

    return (
        <section style={styles.section}>
            <div className="container">
                <div className="intro-grid">
                    <div>
                        <h2 style={styles.title}>Giới thiệu</h2>
                        <p style={styles.text}>
                            {settings.introText1}
                        </p>
                        <Link to="/about" className="btn btn-primary" style={styles.btn}>Tìm hiểu thêm</Link>
                    </div>

                    <div className="intro-cards">
                        <div style={styles.card}>
                            <GiGears size={48} color="var(--primary-color)" />
                            <h3>Cơ khí chính xác</h3>
                            <p>Thiết kế kết cấu, gia công CNC, chế tạo máy</p>
                        </div>
                        <div style={styles.card}>
                            <GiElectric size={48} color="var(--primary-color)" />
                            <h3>Điện & Tự động hóa</h3>
                            <p>Tủ điện công nghiệp, PLC, HMI, Scada</p>
                        </div>
                    </div>
                </div>

                <div className="intro-stats">
                    {stats.map((stat, index) => (
                        <div key={index} style={styles.statItem}>
                            <div style={styles.statNumber}>{stat.number}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '60px 0',
        background: 'var(--bg-light)'
    },
    title: {
        fontSize: '32px',
        color: 'var(--primary-color)',
        marginBottom: '20px'
    },
    text: {
        fontSize: '16px',
        lineHeight: '1.8',
        marginBottom: '24px'
    },
    card: {
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)'
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'var(--primary-color)'
    },
    statLabel: {
        fontSize: '14px',
        color: 'var(--text-light)'
    },
    btn: {
        marginTop: '16px'
    }
};

export default IntroSection;
