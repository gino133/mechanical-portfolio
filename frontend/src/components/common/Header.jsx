import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useSettings } from '../../contexts/SettingsContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const { settings, menu } = useSettings();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Lấy menu từ settings, chỉ hiển thị những mục visible và sắp xếp theo order
    const navItems = menu
        .filter(item => item.visible)
        .sort((a, b) => a.order - b.order);

    const isActive = (path) => {
        if (path === '/') return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    // Mobile menu styles
    const mobileMenuStyles = {
        ...styles.mobileMenu,
        display: isMobile && isMenuOpen ? 'flex' : 'none'
    };

    return (
        <header style={styles.header}>
            <div className="container" style={styles.container}>
                {/* Logo */}
                <Link to="/" style={styles.logo}>
                    {settings.logoImage ? (
                        <img src={settings.logoImage} alt="Logo" style={styles.logoImg} />
                    ) : (
                        <span style={styles.logoText}>{settings.logoText}</span>
                    )}
                </Link>

                {/* Desktop Menu */}
                {!isMobile && (
                    <nav style={styles.navDesktop}>
                        {navItems.map(item => (
                            <Link
                                key={item.id}
                                to={item.path}
                                style={{
                                    ...styles.navLink,
                                    ...(isActive(item.path) && styles.navLinkActive)
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Mobile Menu Button */}
                {isMobile && (
                    <button
                        style={styles.menuBtn}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                )}

                {/* Mobile Menu Dropdown */}
                <div style={mobileMenuStyles}>
                    {navItems.map(item => (
                        <Link
                            key={item.id}
                            to={item.path}
                            style={styles.mobileNavLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
};

const styles = {
    header: {
        background: 'var(--primary-color)',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        maxWidth: 'var(--container-width, 1200px)',
        margin: '0 auto'
    },
    logo: {
        textDecoration: 'none'
    },
    logoText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'white'
    },
    logoImg: {
        height: '40px',
        maxHeight: '40px'
    },
    navDesktop: {
        display: 'flex',
        gap: '24px'
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '8px 0',
        transition: 'opacity 0.3s',
        fontSize: '16px'
    },
    navLinkActive: {
        borderBottom: '2px solid var(--accent-color)',
        color: 'var(--accent-color)'
    },
    menuBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '8px'
    },
    mobileMenu: {
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        background: 'var(--primary-color)',
        flexDirection: 'column',
        padding: '16px',
        gap: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 999
    },
    mobileNavLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '12px',
        display: 'block',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    }
};

export default Header;