import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../../services/api';

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('new'); // 'new' | 'featured'

    useEffect(() => {
        fetchProjects();
    }, [mode]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = mode === 'featured'
                ? await projectAPI.getFeatured()
                : await projectAPI.getAll({ limit: 3 }); // sorted newest first by default
            setProjects(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dự án:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.title}>Dự án</h2>
                <p style={styles.subtitle}>Các dự án đã thực hiện thành công</p>

                <div style={styles.tabs}>
                    <button
                        onClick={() => setMode('new')}
                        style={{ ...styles.tab, ...(mode === 'new' ? styles.tabActive : {}) }}
                    >
                        Mới nhất
                    </button>
                    <button
                        onClick={() => setMode('featured')}
                        style={{ ...styles.tab, ...(mode === 'featured' ? styles.tabActive : {}) }}
                    >
                        Nổi bật
                    </button>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : projects.length === 0 ? (
                    <p style={styles.noResults}>
                        {mode === 'featured' ? 'Chưa có dự án nào được đánh dấu nổi bật' : 'Chưa có dự án nào'}
                    </p>
                ) : (
                    <div className="grid grid-3">
                        {projects.map(project => (
                            <div key={project._id} className="card">
                                <img src={project.thumbnail} alt={project.name} className="card-image" />
                                <div className="card-content">
                                    <span className="card-category">{project.category?.name}</span>
                                    <h3 className="card-title">{project.name}</h3>
                                    <p>Khách hàng: {project.client}</p>
                                    <p>Năm: {project.year}</p>
                                    <Link to={`/projects/${project._id}`} className="btn btn-outline" style={styles.btn}>
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
        marginBottom: '24px'
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '32px'
    },
    tab: {
        padding: '8px 22px',
        border: '1px solid var(--border-color)',
        background: 'white',
        borderRadius: '20px',
        cursor: 'pointer'
    },
    tabActive: {
        background: 'var(--primary-color)',
        color: 'white',
        borderColor: 'var(--primary-color)'
    },
    viewAll: {
        textAlign: 'center',
        marginTop: '40px'
    },
    btn: {
        marginTop: '12px',
        display: 'inline-block'
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        color: '#999'
    }
};

export default FeaturedProjects;
