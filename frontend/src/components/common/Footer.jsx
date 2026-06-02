import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container" style={styles.container}>
                <div style={styles.grid}>
                    {/* About */}
                    <div>
                        <h3 style={styles.title}>Về tôi</h3>
                        <p style={styles.text}>
                            Kỹ sư Cơ khí & Điện với 10+ năm kinh nghiệm trong lĩnh vực chế tạo máy và tự động hóa.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={styles.title}>Liên kết nhanh</h3>
                        <ul style={styles.linkList}>
                            <li><Link to="/products" style={styles.link}>Sản phẩm</Link></li>
                            <li><Link to="/projects" style={styles.link}>Dự án</Link></li>
                            <li><Link to="/documents" style={styles.link}>Tài liệu</Link></li>
                            <li><Link to="/contact" style={styles.link}>Liên hệ</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={styles.title}>Thông tin liên hệ</h3>
                        <ul style={styles.contactList}>
                            <li><FiMail /> <a href="mailto:nguyenvana@email.com" style={styles.link}>nguyenvana@email.com</a></li>
                            <li><FiPhone /> <a href="tel:0123456789" style={styles.link}>0123 456 789</a></li>
                            <li><FiMapPin /> Hà Nội, Việt Nam</li>
                        </ul>
                    </div>
                </div>

                <div style={styles.copyright}>
                    <p>&copy; 2024 Nguyễn Văn A. All rights reserved.</p>
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