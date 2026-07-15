import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, categoryAPI } from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [activeCategory]);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getByType('project');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = { limit: 100 };
            if (activeCategory !== 'all') params.category = activeCategory;
            const response = await projectAPI.getAll(params);
            setProjects(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dự án:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && projects.length === 0) return <div className="spinner"></div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <h1 style={styles.title}>Dự án đã thực hiện</h1>
                    <p style={styles.subtitle}>Các dự án tiêu biểu trong lĩnh vực cơ khí và điện</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.categories}>
                        <button
                            onClick={() => setActiveCategory('all')}
                            style={{ ...styles.categoryBtn, ...(activeCategory === 'all' && styles.categoryBtnActive) }}
                        >
                            Tất cả
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat._id}
                                onClick={() => setActiveCategory(cat.name)}
                                style={{ ...styles.categoryBtn, ...(activeCategory === cat.name && styles.categoryBtnActive) }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {projects.length === 0 ? (
                        <p style={styles.noResults}>Chưa có dự án nào trong mục này</p>
                    ) : (
                        <div className="grid grid-2">
                            {projects.map(project => (
                                <div key={project._id} className="card">
                                    <img src={project.thumbnail} alt={project.name} className="card-image" />
                                    <div className="card-content">
                                        <span className="card-category">{project.category?.name}</span>
                                        <h3 className="card-title">{project.name}</h3>
                                        <p><strong>Khách hàng:</strong> {project.client}</p>
                                        <p><strong>Năm:</strong> {project.year}</p>
                                        <p>{project.description}</p>
                                        <Link to={`/projects/${project._id}`} className="btn btn-primary" style={styles.btn}>
                                            Xem chi tiết →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '60px 0',
        textAlign: 'center'
    },
    title: {
        fontSize: '36px',
        marginBottom: '16px'
    },
    subtitle: {
        fontSize: '18px',
        opacity: 0.9
    },
    section: {
        padding: '60px 0'
    },
    categories: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '40px',
        flexWrap: 'wrap'
    },
    categoryBtn: {
        padding: '10px 24px',
        border: '2px solid var(--primary-color)',
        background: 'white',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s'
    },
    categoryBtnActive: {
        background: 'var(--primary-color)',
        color: 'white'
    },
    btn: {
        marginTop: '16px',
        display: 'inline-block'
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        color: '#999'
    }
};

export default Projects;
