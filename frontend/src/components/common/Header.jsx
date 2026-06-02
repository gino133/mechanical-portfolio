import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/about', label: 'Giới thiệu' },
        { path: '/products', label: 'Sản phẩm' },
        { path: '/projects', label: 'Dự án' },
        { path: '/documents', label: 'Tài liệu' },
        { path: '/contact', label: 'Liên hệ' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header style={styles.header}>
            <div className="container" style={styles.container}>
                <Link to="/" style={styles.logo}>
                    <span style={styles.logoText}>KS. Cơ khí & Điện</span>
                </Link>

                {/* Desktop Menu */}
                <nav style={styles.navDesktop}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
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

                {/* Mobile Menu Button */}
                <button
                    style={styles.menuBtn}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div style={styles.mobileMenu}>
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={styles.mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
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
        boxShadow: 'var(--shadow)'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px'
    },
    logo: {
        textDecoration: 'none'
    },
    logoText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'white'
    },
    navDesktop: {
        display: 'flex',
        gap: '24px'
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '8px 0',
        transition: 'opacity 0.3s'
    },
    navLinkActive: {
        borderBottom: '2px solid var(--accent-color)',
        color: 'var(--accent-color)'
    },
    menuBtn: {
        display: 'none',
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer'
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
        display: 'none'
    },
    mobileNavLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '12px',
        display: 'block'
    }
};

// Responsive
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
    styles.navDesktop.display = 'none';
    styles.menuBtn.display = 'block';
    styles.mobileMenu.display = 'flex';
}

export default Header;