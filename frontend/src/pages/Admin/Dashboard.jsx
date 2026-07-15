import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FiPackage, FiFolder, FiFileText, FiLogOut, FiSettings, FiMenu, FiMail, FiTag } from 'react-icons/fi';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
    }, [navigate]);

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
    	{ path: '/admin/products', icon: <FiPackage />, label: 'Sản phẩm' },
    	{ path: '/admin/projects', icon: <FiFolder />, label: 'Dự án' },
    	{ path: '/admin/documents', icon: <FiFileText />, label: 'Tài liệu' },
    	{ path: '/admin/messages', icon: <FiMail />, label: 'Tin nhắn' },
    ];

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logo}>
                    <h2>Admin Panel</h2>
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
                    <h1>Quản lý nội dung</h1>
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
    sidebar: {
        width: '260px',
        background: '#1a3a5c',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
    },
    logo: {
        padding: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    userName: {
        fontSize: '14px',
        opacity: 0.8,
        marginTop: '8px'
    },
    nav: {
        flex: 1,
        padding: '20px 0'
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
        background: '#f5f7fa'
    },
    header: {
        background: 'white',
        padding: '20px 32px',
        borderBottom: '1px solid #e0e0e0'
    },
    content: {
        padding: '24px 32px'
    }
};

export default AdminDashboard;