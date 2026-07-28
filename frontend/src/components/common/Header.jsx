import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useSettings } from '../../contexts/SettingsContext';
import { optimizeImage } from '../../utils/optimizeImage';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
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

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
            setIsMenuOpen(false);
        }
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
                        <img src={optimizeImage(settings.logoImage, 300)} alt="Logo" style={styles.logoImg} />
                    ) : (
                        <span style={styles.logoText}>{settings.logoText}</span>
                    )}
                </Link>

                {/* Desktop Menu - centered between logo and search box */}
                {!isMobile && (
                    <nav style={styles.navDesktop}>
                        {navItems.map(item => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className="nav-link"
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

                {/* Desktop search box */}
                {!isMobile && (
                    <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="header-search-input"
                            style={styles.searchInput}
                        />
                    </form>
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
                    <form onSubmit={handleSearchSubmit} style={styles.mobileSearchForm}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="header-search-input"
                            style={styles.mobileSearchInput}
                        />
                    </form>
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
        gap: '24px',
        padding: '16px 20px',
        maxWidth: 'var(--container-width, 1200px)',
        margin: '0 auto'
    },
    logo: {
        textDecoration: 'none',
        flexShrink: 0
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
        gap: '8px',
        flex: 1,
        justifyContent: 'center'
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: '6px',
        transition: 'background 0.2s',
        fontSize: '16px',
        whiteSpace: 'nowrap'
    },
    navLinkActive: {
        background: 'rgba(255,255,255,0.15)',
        color: 'var(--accent-color)'
    },
    searchForm: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
    },
    searchIcon: {
        position: 'absolute',
        left: '10px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '15px',
        pointerEvents: 'none'
    },
    searchInput: {
        width: '180px',
        padding: '8px 12px 8px 32px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.3)',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        fontSize: '14px',
        outline: 'none'
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
    mobileSearchForm: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '4px'
    },
    mobileSearchInput: {
        width: '100%',
        padding: '10px 12px 10px 34px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.3)',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        fontSize: '15px',
        outline: 'none'
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
