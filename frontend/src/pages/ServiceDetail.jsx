import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import ImageLightbox from '../components/common/ImageLightbox';
import { FiMail, FiPhone } from 'react-icons/fi';

const ServiceDetail = () => {
    const { slug } = useParams();
    const { settings } = useSettings();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => {
        fetchService();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchService = async () => {
        setLoading(true);
        try {
            const response = await serviceAPI.getBySlug(slug);
            setService(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dịch vụ:', error);
            setService(null);
        } finally {
            setLoading(false);
        }
    };

    const handleContentClick = (e) => {
        if (e.target.tagName === 'IMG') {
            setLightboxImage(e.target.src);
        }
    };

    if (loading) return <div className="spinner"></div>;
    if (!service) return <div style={{ padding: '60px', textAlign: 'center' }}>Không tìm thấy dịch vụ</div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <Link to="/" style={styles.backLink}>← Quay lại trang chủ</Link>
                    <div style={styles.heroRow}>
                        {service.icon && <img src={service.icon} alt="" style={styles.heroIcon} />}
                        <h1 style={styles.title}>{service.title}</h1>
                    </div>
                    {service.shortDescription && <p style={styles.subtitle}>{service.shortDescription}</p>}
                </div>
            </section>

            <section style={styles.section}>
                <div className="container" style={styles.articleContainer}>
                    {service.coverImage && (
                        <img
                            src={service.coverImage}
                            alt={service.title}
                            style={styles.coverImage}
                            onClick={() => setLightboxImage(service.coverImage)}
                        />
                    )}

                    {service.content ? (
                        <div
                            className="blog-content"
                            onClick={handleContentClick}
                            dangerouslySetInnerHTML={{ __html: service.content }}
                        />
                    ) : (
                        <p style={{ color: '#999' }}>Nội dung chi tiết đang được cập nhật.</p>
                    )}

                    <div style={styles.contactBox}>
                        <h3>Quan tâm đến dịch vụ này?</h3>
                        <p>Liên hệ để được tư vấn cụ thể</p>
                        <div style={styles.contactButtons}>
                            <a href={`mailto:${settings.email}`} className="btn btn-primary"><FiMail /> Gửi email</a>
                            <a href={`tel:${settings.phone}`} className="btn btn-outline"><FiPhone /> Gọi điện</a>
                        </div>
                    </div>
                </div>
            </section>

            <ImageLightbox src={lightboxImage} alt={service.title} onClose={() => setLightboxImage(null)} />
        </div>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '48px 0'
    },
    backLink: { color: 'white', opacity: 0.85, textDecoration: 'none', display: 'inline-block', marginBottom: '16px' },
    heroRow: { display: 'flex', alignItems: 'center', gap: '16px' },
    heroIcon: { width: '48px', height: '48px', objectFit: 'contain' },
    title: { fontSize: '32px', margin: 0 },
    subtitle: { fontSize: '16px', opacity: 0.9, marginTop: '12px' },
    section: { padding: '48px 0' },
    articleContainer: { maxWidth: '800px' },
    coverImage: {
        width: '100%', borderRadius: '10px', marginBottom: '32px', cursor: 'zoom-in',
        maxHeight: '420px', objectFit: 'cover'
    },
    contactBox: {
        background: 'var(--bg-light)',
        padding: '32px',
        borderRadius: '8px',
        textAlign: 'center',
        marginTop: '48px'
    },
    contactButtons: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        marginTop: '20px'
    }
};

export default ServiceDetail;
