import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiPackage, FiFolder, FiFileText, FiLogOut, FiSettings, FiMenu, FiMail, FiTag, FiEdit3, FiTool, FiX } from 'react-icons/fi';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
    }, [navigate]);

    // Close the mobile drawer whenever the admin navigates to a new page
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin/settings', icon: <FiSettings />, label: 'Cài đặt' },
    	{ path: '/admin/menu', icon: <FiMenu />, label: 'Menu' },
    	{ path: '/admin/pages', icon: <FiFileText />, label: 'Trang tĩnh' },
    	{ path: '/admin/categories', icon: <FiTag />, label: 'Danh mục' },
    	{ path: '/admin/services', icon: <FiTool />, label: 'Dịch vụ' },
    	{ path: '/admin/products', icon: <FiPackage />, label: 'Sản phẩm' },
    	{ path: '/admin/projects', icon: <FiFolder />, label: 'Dự án' },
    	{ path: '/admin/documents', icon: <FiFileText />, label: 'Tài liệu' },
    	{ path: '/admin/blog', icon: <FiEdit3 />, label: 'Blog' },
    	{ path: '/admin/messages', icon: <FiMail />, label: 'Tin nhắn' },
    ];

    return (
        <div style={styles.container}>
            {/* Mobile-only backdrop, closes the drawer when tapped */}
            {sidebarOpen && (
                <div className="admin-backdrop" style={styles.backdrop} onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar - fixed on desktop, slide-in drawer on mobile via
                the "admin-sidebar" / "admin-sidebar-open" CSS classes */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`} style={styles.sidebar}>
                <div style={styles.logo}>
                    <div style={styles.logoRow}>
                        <h2 style={{ margin: 0 }}>Admin Panel</h2>
                        <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} style={styles.closeBtn}>
                            <FiX size={22} />
                        </button>
                    </div>
                    {user && <p style={styles.userName}>{user.name}</p>}
                </div>
                <nav style={styles.nav}>
                    {menuItems.map(item => (
                        <Link key={item.path} to={item.path} style={styles.navLink}>
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <FiLogOut /> Đăng xuất
                </button>
            </aside>

            {/* Main content */}
            <main style={styles.main}>
                <div style={styles.header}>
                    <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)} style={styles.menuToggle}>
                        <FiMenu size={22} />
                    </button>
                    <h1 style={{ fontSize: '20px', margin: 0 }}>Quản lý nội dung</h1>
                </div>
                <div style={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh'
    },
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 998
    },
    sidebar: {
        width: '260px',
        background: '#1a3a5c',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
    },
    logo: {
        padding: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: 0
    },
    userName: {
        fontSize: '14px',
        opacity: 0.8,
        marginTop: '8px'
    },
    nav: {
        flex: 1,
        padding: '20px 0',
        overflowY: 'auto'
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        color: 'white',
        textDecoration: 'none',
        transition: 'background 0.3s'
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '20px',
        padding: '12px',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px'
    },
    main: {
        flex: 1,
        background: '#f5f7fa',
        minWidth: 0 // allows content (tables etc.) to shrink/scroll instead of overflowing the page
    },
    menuToggle: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#1a3a5c',
        marginRight: '12px',
        padding: 0
    },
    header: {
        background: 'white',
        padding: '16px 20px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center'
    },
    content: {
        padding: '20px'
    }
};

export default AdminDashboard;
