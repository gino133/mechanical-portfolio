import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

const HeroSection = () => {
    const { settings } = useSettings();

    return (
        <section style={styles.hero}>
            <div
                style={{
                    ...styles.overlay,
                    background: settings.heroImage
                        ? `url(${settings.heroImage}) center/cover`
                        : styles.overlay.background
                }}
            ></div>
            <div className="container" style={styles.container}>
                <h1 style={styles.title}>
                    {settings.heroTitle}
                </h1>
                <p style={styles.subtitle}>
                    {settings.heroSubtitle}
                </p>
                <p style={styles.description}>
                    {settings.heroDescription}
                </p>
                <div style={styles.buttons}>
                    <Link to="/projects" className="btn btn-primary">Xem dự án</Link>
                    <Link to="/contact" className="btn btn-outline">Liên hệ ngay</Link>
                </div>
            </div>
        </section>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        color: 'white'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url(https://via.placeholder.com/1920x600?text=Workshop+Background) center/cover',
        opacity: 0.1
    },
    container: {
        position: 'relative',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
    },
    title: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    subtitle: {
        fontSize: '24px',
        marginBottom: '16px'
    },
    description: {
        fontSize: '18px',
        marginBottom: '32px',
        opacity: 0.9
    },
    buttons: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center'
    }
};

export default HeroSection;
