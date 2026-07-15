import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiMail, FiPhone } from 'react-icons/fi';
import { productAPI } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import ImageLightbox from '../components/common/ImageLightbox';

const ProductDetail = () => {
    const { id } = useParams();
    const { settings } = useSettings();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await productAPI.getById(id);
            const data = response.data.data;
            setProduct(data);
            const images = data.images && data.images.length > 0 ? data.images : [data.thumbnail];
            setSelectedImage(images[0]);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="spinner"></div>;
    if (!product) return <div style={{ padding: '60px', textAlign: 'center' }}>Không tìm thấy sản phẩm</div>;

    const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
    const specs = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <Link to="/products" style={styles.backLink}>← Quay lại danh sách</Link>
                    <h1 style={styles.title}>{product.name}</h1>
                    <p>Mã sản phẩm: {product.code}</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.grid}>
                        <div>
                            {/* Main image - click to open the popup preview */}
                            <img
                                src={selectedImage}
                                alt={product.name}
                                style={styles.mainImage}
                                onClick={() => setLightboxImage(selectedImage)}
                            />

                            {/* Thumbnails - click (or hover) to swap the main image above.
                                Only shown when there's more than one image. */}
                            {images.length > 1 && (
                                <div style={styles.thumbRow}>
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            onMouseEnter={() => setSelectedImage(img)}
                                            onClick={() => setSelectedImage(img)}
                                            style={{
                                                ...styles.thumb,
                                                ...(selectedImage === img ? styles.thumbActive : {})
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2>Thông số kỹ thuật</h2>
                            {Object.keys(specs).length > 0 ? (
                                <table style={styles.specsTable}>
                                    <tbody>
                                        {Object.entries(specs).map(([key, value]) => (
                                            <tr key={key}>
                                                <th style={styles.specsTh}>{key}</th>
                                                <td style={styles.specsTd}>{String(value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: '#999' }}>Chưa cập nhật thông số kỹ thuật.</p>
                            )}
                        </div>
                    </div>

                    <div style={styles.description}>
                        <h2>Mô tả sản phẩm</h2>
                        <p>{product.description}</p>
                    </div>

                    {product.documents && product.documents.length > 0 && (
                        <div style={styles.documents}>
                            <h2>Tài liệu đính kèm</h2>
                            <ul style={styles.docList}>
                                {product.documents.map((doc) => (
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

                    <div style={styles.contactBox}>
                        <h3>Quan tâm đến sản phẩm này?</h3>
                        <p>Liên hệ để được tư vấn và báo giá</p>
                        <div style={styles.contactButtons}>
                            <a href={`mailto:${settings.email}`} className="btn btn-primary"><FiMail /> Gửi email</a>
                            <a href={`tel:${settings.phone}`} className="btn btn-outline"><FiPhone /> Gọi điện</a>
                        </div>
                    </div>
                </div>
            </section>

            <ImageLightbox src={lightboxImage} alt={product.name} onClose={() => setLightboxImage(null)} />
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
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        marginBottom: '48px'
    },
    mainImage: {
        width: '100%',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)',
        cursor: 'zoom-in',
        aspectRatio: '4 / 3',
        objectFit: 'cover'
    },
    thumbRow: {
        display: 'flex',
        gap: '10px',
        marginTop: '12px',
        flexWrap: 'wrap'
    },
    thumb: {
        width: '70px',
        height: '70px',
        objectFit: 'cover',
        borderRadius: '6px',
        cursor: 'pointer',
        border: '2px solid transparent',
        opacity: 0.7,
        transition: 'all 0.2s'
    },
    thumbActive: {
        border: '2px solid var(--primary-color)',
        opacity: 1
    },
    specsTable: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    specsTh: {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid var(--border-color)',
        fontWeight: '600',
        width: '40%'
    },
    specsTd: {
        padding: '12px',
        borderBottom: '1px solid var(--border-color)'
    },
    description: {
        marginBottom: '48px'
    },
    documents: {
        marginBottom: '48px'
    },
    docList: {
        listStyle: 'none'
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
    contactBox: {
        background: 'var(--bg-light)',
        padding: '32px',
        borderRadius: '8px',
        textAlign: 'center'
    },
    contactButtons: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        marginTop: '20px'
    }
};

export default ProductDetail;
