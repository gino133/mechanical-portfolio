import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useSettings } from '../../contexts/SettingsContext';

const Footer = () => {
    const { settings } = useSettings();

    return (
        <footer style={styles.footer}>
            <div className="container" style={styles.container}>
                <div style={styles.grid}>
                    {/* About */}
                    <div>
                        <h3 style={styles.title}>{settings.footerAboutTitle}</h3>
                        <p style={styles.text}>
                            {settings.footerAboutText}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={styles.title}>{settings.footerLinksTitle}</h3>
                        <ul style={styles.linkList}>
                            {(settings.footerLinks || []).map((item, index) => (
                                <li key={index}><Link to={item.path} style={styles.link}>{item.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={styles.title}>{settings.footerContactTitle}</h3>
                        <ul style={styles.contactList}>
                            <li><FiMail /> <a href={`mailto:${settings.email}`} style={styles.link}>{settings.email}</a></li>
                            <li><FiPhone /> <a href={`tel:${settings.phone}`} style={styles.link}>{settings.phone}</a></li>
                            <li><FiMapPin /> {settings.address}</li>
                        </ul>
                    </div>
                </div>

                <div style={styles.copyright}>
                    <p>{settings.copyrightText}</p>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        background: '#1a1a1a',
        color: '#999',
        padding: '48px 0 24px',
        marginTop: '48px'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '32px',
        marginBottom: '32px'
    },
    title: {
        color: 'white',
        fontSize: '18px',
        marginBottom: '16px'
    },
    text: {
        lineHeight: '1.6'
    },
    linkList: {
        listStyle: 'none'
    },
    link: {
        color: '#999',
        textDecoration: 'none',
        display: 'inline-block',
        marginBottom: '8px',
        transition: 'color 0.3s'
    },
    contactList: {
        listStyle: 'none'
    },
    copyright: {
        textAlign: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #333'
    }
};

export default Footer;
