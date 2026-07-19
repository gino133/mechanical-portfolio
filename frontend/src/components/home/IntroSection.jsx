import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiGears } from 'react-icons/gi';
import { useSettings } from '../../contexts/SettingsContext';
import { serviceAPI } from '../../services/api';

const IntroSection = () => {
    const { settings } = useSettings();
    const [services, setServices] = useState([]);

    useEffect(() => {
        serviceAPI.getAll()
            .then((res) => setServices(res.data.data))
            .catch((err) => console.error('Lỗi tải dịch vụ:', err));
    }, []);

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
                        {services.map((service) => (
                            <Link key={service._id} to={`/services/${service.slug}`} style={styles.cardLink}>
                                <div style={styles.card}>
                                    {service.icon ? (
                                        <img src={service.icon} alt={service.title} style={styles.cardIcon} />
                                    ) : (
                                        <GiGears size={48} color="var(--primary-color)" />
                                    )}
                                    <h3>{service.title}</h3>
                                    <p>{service.shortDescription}</p>
                                </div>
                            </Link>
                        ))}
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
    cardLink: {
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
    },
    card: {
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
    },
    cardIcon: {
        width: '48px',
        height: '48px',
        objectFit: 'contain',
        margin: '0 auto'
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
