import React from 'react';
import { Link } from 'react-router-dom';
import { GiGears, GiElectric } from 'react-icons/gi';

const IntroSection = () => {
    const stats = [
        { number: '10+', label: 'Năm kinh nghiệm' },
        { number: '50+', label: 'Dự án hoàn thành' },
        { number: '30+', label: 'Khách hàng' }
    ];

    return (
        <section style={styles.section}>
            <div className="container">
                <div style={styles.grid}>
                    <div>
                        <h2 style={styles.title}>Giới thiệu</h2>
                        <p style={styles.text}>
                            Tôi là kỹ sư cơ khí với hơn 10 năm kinh nghiệm trong lĩnh vực thiết kế, 
                            chế tạo và gia công cơ khí chính xác. Bên cạnh đó, tôi cũng có kiến thức 
                            sâu rộng về hệ thống điện công nghiệp và tự động hóa.
                        </p>
                        <Link to="/about" className="btn btn-primary" style={styles.btn}>Tìm hiểu thêm</Link>
                    </div>

                    <div style={styles.cards}>
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

                <div style={styles.stats}>
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
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        marginBottom: '48px'
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
    cards: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    card: {
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        textAlign: 'center',
        paddingTop: '48px',
        borderTop: '1px solid var(--border-color)'
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