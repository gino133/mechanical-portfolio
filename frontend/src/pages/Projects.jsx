import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const demoProjects = [
            { id: 1, name: 'Cầu trục 10 tấn', client: 'Nhà máy XYZ', category: 'Cơ khí', year: 2024, 
              description: 'Thiết kế và chế tạo cầu trục 10 tấn cho nhà máy sản xuất thép',
              thumbnail: 'https://via.placeholder.com/400x250?text=Cau+truc' },
            { id: 2, name: 'Hệ thống băng tải tự động', client: 'Công ty ABC', category: 'Cơ khí', year: 2023,
              description: 'Hệ thống băng tải vận chuyển than cốc cho nhà máy xi măng',
              thumbnail: 'https://via.placeholder.com/400x250?text=Bang+tai' },
            { id: 3, name: 'Tủ điện điều khiển trung tâm', client: 'Nhà máy DEF', category: 'Điện', year: 2024,
              description: 'Lắp đặt tủ điện PLC điều khiển toàn bộ dây chuyền sản xuất',
              thumbnail: 'https://via.placeholder.com/400x250?text=Tu+dien' },
            { id: 4, name: 'Máy ép phế liệu 100T', client: 'Công ty GHI', category: 'Cơ khí', year: 2023,
              description: 'Chế tạo máy ép thủy lực 100 tấn cho nhà máy tái chế',
              thumbnail: 'https://via.placeholder.com/400x250?text=May+ep' }
        ];
        setProjects(demoProjects);
        setFilteredProjects(demoProjects);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, projects]);

    if (loading) return <div className="spinner"></div>;

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
                            style={{...styles.categoryBtn, ...(activeCategory === 'all' && styles.categoryBtnActive)}}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setActiveCategory('Cơ khí')}
                            style={{...styles.categoryBtn, ...(activeCategory === 'Cơ khí' && styles.categoryBtnActive)}}
                        >
                            ⚙️ Cơ khí
                        </button>
                        <button
                            onClick={() => setActiveCategory('Điện')}
                            style={{...styles.categoryBtn, ...(activeCategory === 'Điện' && styles.categoryBtnActive)}}
                        >
                            ⚡ Điện
                        </button>
                    </div>

                    <div className="grid grid-2">
                        {filteredProjects.map(project => (
                            <div key={project.id} className="card">
                                <img src={project.thumbnail} alt={project.name} className="card-image" />
                                <div className="card-content">
                                    <span className="card-category">{project.category}</span>
                                    <h3 className="card-title">{project.name}</h3>
                                    <p><strong>Khách hàng:</strong> {project.client}</p>
                                    <p><strong>Năm:</strong> {project.year}</p>
                                    <p>{project.description}</p>
                                    <Link to={`/projects/${project.id}`} className="btn btn-primary" style={styles.btn}>
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
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
        marginBottom: '40px'
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
    }
};

export default Projects;