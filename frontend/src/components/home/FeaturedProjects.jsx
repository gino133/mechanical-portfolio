import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Demo data
        const demoProjects = [
            {
                id: 1,
                name: 'Cầu trục 10 tấn - Nhà máy XYZ',
                client: 'Công ty XYZ',
                category: 'Cơ khí',
                year: 2024,
                thumbnail: 'https://via.placeholder.com/300x200?text=Cau+truc'
            },
            {
                id: 2,
                name: 'Hệ thống băng tải tự động',
                client: 'Công ty ABC',
                category: 'Cơ khí',
                year: 2023,
                thumbnail: 'https://via.placeholder.com/300x200?text=Bang+tai'
            },
            {
                id: 3,
                name: 'Tủ điện điều khiển trung tâm',
                client: 'Nhà máy DEF',
                category: 'Điện',
                year: 2024,
                thumbnail: 'https://via.placeholder.com/300x200?text=Tu+dien'
            }
        ];
        setProjects(demoProjects);
        setLoading(false);
    }, []);

    if (loading) return <div className="spinner"></div>;

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.title}>Dự án tiêu biểu</h2>
                <p style={styles.subtitle}>Các dự án đã thực hiện thành công</p>

                <div className="grid grid-3">
                    {projects.map(project => (
                        <div key={project.id} className="card">
                            <img src={project.thumbnail} alt={project.name} className="card-image" />
                            <div className="card-content">
                                <span className="card-category">{project.category}</span>
                                <h3 className="card-title">{project.name}</h3>
                                <p>Khách hàng: {project.client}</p>
                                <p>Năm: {project.year}</p>
                                <Link to={`/projects/${project.id}`} className="btn btn-outline" style={styles.btn}>
                                    Xem chi tiết →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.viewAll}>
                    <Link to="/projects" className="btn btn-primary">Xem tất cả dự án</Link>
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
        textAlign: 'center',
        color: 'var(--primary-color)',
        marginBottom: '16px'
    },
    subtitle: {
        textAlign: 'center',
        color: 'var(--text-light)',
        marginBottom: '40px'
    },
    viewAll: {
        textAlign: 'center',
        marginTop: '40px'
    },
    btn: {
        marginTop: '12px',
        display: 'inline-block'
    }
};

export default FeaturedProjects;