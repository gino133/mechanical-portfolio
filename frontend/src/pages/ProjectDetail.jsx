import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import { projectAPI } from '../services/api';
import ImageLightbox from '../components/common/ImageLightbox';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const response = await projectAPI.getById(id);
            setProject(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dự án:', error);
            setProject(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="spinner"></div>;
    if (!project) return <div style={{ padding: '60px', textAlign: 'center' }}>Không tìm thấy dự án</div>;

    const technicalInfo = project.technicalInfo && typeof project.technicalInfo === 'object' ? project.technicalInfo : {};
    const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.thumbnail];

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <Link to="/projects" style={styles.backLink}>← Quay lại dự án</Link>
                    <h1 style={styles.title}>{project.name}</h1>
                    <p>Khách hàng: {project.client} | Năm: {project.year}</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.info}>
                        <h2>Thông tin dự án</h2>
                        <p>{project.description}</p>

                        {Object.keys(technicalInfo).length > 0 && (
                            <>
                                <h3 style={{ marginTop: '24px' }}>Thông số kỹ thuật</h3>
                                <table style={styles.specsTable}>
                                    <tbody>
                                        {Object.entries(technicalInfo).map(([key, value]) => (
                                            <tr key={key}>
                                                <th style={styles.specsTh}>{key}</th>
                                                <td style={styles.specsTd}>{String(value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>

                    <div style={styles.gallery}>
                        <h2>Hình ảnh dự án</h2>
                        <p style={styles.galleryHint}>Bấm vào ảnh để xem kích thước đầy đủ</p>
                        <div style={styles.galleryGrid}>
                            {gallery.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Hình ${index + 1}`}
                                    style={styles.galleryImg}
                                    onClick={() => setLightboxImage(img)}
                                />
                            ))}
                        </div>
                    </div>

                    {project.documents && project.documents.length > 0 && (
                        <div style={styles.documents}>
                            <h2>Tài liệu dự án</h2>
                            <ul style={styles.docList}>
                                {project.documents.map((doc) => (
                                    <li key={doc._id} style={styles.docItem}>
                                        <FiDownload />
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={styles.docLink}>
                                            {doc.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            <ImageLightbox src={lightboxImage} alt={project.name} onClose={() => setLightboxImage(null)} />
        </div>
    );
};

const styles = {
    hero: {
        background: 'var(--bg-light)',
        padding: '40px 0',
        borderBottom: '1px solid var(--border-color)'
    },
    backLink: {
        color: 'var(--primary-color)',
        textDecoration: 'none',
        display: 'inline-block',
        marginBottom: '16px'
    },
    title: {
        fontSize: '28px',
        marginBottom: '8px'
    },
    section: {
        padding: '60px 0'
    },
    specsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '16px'
    },
    specsTh: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '1px solid var(--border-color)',
        width: '30%'
    },
    specsTd: {
        padding: '10px',
        borderBottom: '1px solid var(--border-color)'
    },
    gallery: {
        marginTop: '48px'
    },
    galleryHint: {
        fontSize: '13px',
        color: '#999',
        marginTop: '4px'
    },
    galleryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginTop: '20px'
    },
    galleryImg: {
        width: '100%',
        aspectRatio: '4 / 3',
        objectFit: 'cover',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)',
        cursor: 'zoom-in'
    },
    documents: {
        marginTop: '48px'
    },
    docList: {
        listStyle: 'none',
        marginTop: '16px'
    },
    docItem: {
        padding: '12px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    docLink: {
        color: 'var(--primary-color)',
        textDecoration: 'none'
    }
};

export default ProjectDetail;
