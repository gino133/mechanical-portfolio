import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiImage } from 'react-icons/fi';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const demoProjects = {
            1: { id: 1, name: 'Cầu trục 10 tấn', client: 'Nhà máy XYZ', category: 'Cơ khí', year: 2024,
                description: 'Dự án thiết kế và chế tạo cầu trục 10 tấn phục vụ nhà máy sản xuất thép. Cầu trục có khẩu độ 20m, chiều cao nâng 12m, được trang bị hệ thống điều khiển từ xa an toàn.',
                technicalInfo: { capacity: '10 tấn', span: '20m', liftingHeight: '12m', speed: '8m/phút' },
                gallery: ['https://via.placeholder.com/800x500?text=Hinh+1', 'https://via.placeholder.com/800x500?text=Hinh+2'],
                documents: ['BVKT_Cautruc.pdf', 'Thuyetminh_Cautruc.pdf', 'Bantinh_Cautruc.xlsx'] },
            2: { id: 2, name: 'Hệ thống băng tải tự động', client: 'Công ty ABC', category: 'Cơ khí', year: 2023,
                description: 'Thiết kế và lắp đặt hệ thống băng tải vận chuyển than cốc cho nhà máy xi măng. Hệ thống dài 150m, công suất 200 tấn/giờ.',
                technicalInfo: { length: '150m', capacity: '200 tấn/h', motor: '30kW', beltWidth: '800mm' },
                gallery: ['https://via.placeholder.com/800x500?text=Bang+tai'],
                documents: ['BV_Bangtai.pdf', 'Dieukhien_Bangtai.pdf'] }
        };
        setProject(demoProjects[id] || demoProjects[1]);
        setLoading(false);
    }, [id]);

    if (loading) return <div className="spinner"></div>;
    if (!project) return <div>Không tìm thấy dự án</div>;

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
                        
                        <h3 style={{marginTop: '24px'}}>Thông số kỹ thuật</h3>
                        <table style={styles.specsTable}>
                            <tbody>
                                {Object.entries(project.technicalInfo).map(([key, value]) => (
                                    <tr key={key}>
                                        <th style={styles.specsTh}>{key}</th>
                                        <td style={styles.specsTd}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.gallery}>
                        <h2>Hình ảnh dự án</h2>
                        <div style={styles.galleryGrid}>
                            {project.gallery.map((img, index) => (
                                <img key={index} src={img} alt={`Hình ${index + 1}`} style={styles.galleryImg} />
                            ))}
                        </div>
                    </div>

                    <div style={styles.documents}>
                        <h2>Tài liệu dự án</h2>
                        <ul style={styles.docList}>
                            {project.documents.map((doc, index) => (
                                <li key={index} style={styles.docItem}>
                                    <FiDownload />
                                    <a href="#" style={styles.docLink}>{doc}</a>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-primary" style={styles.zipBtn}>
                            📦 Tải tất cả tài liệu (ZIP)
                        </button>
                    </div>
                </div>
            </section>
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
    galleryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginTop: '20px'
    },
    galleryImg: {
        width: '100%',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)'
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
    },
    zipBtn: {
        marginTop: '24px'
    }
};

export default ProjectDetail;