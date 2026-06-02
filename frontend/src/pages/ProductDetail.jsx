import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiMail, FiPhone } from 'react-icons/fi';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Demo data - get product by id
        const demoProducts = {
            1: { id: 1, name: 'Băng tải cao su', code: 'BT-100', category: 'Cơ khí', 
                specs: { material: 'Cao su chịu mài mòn', dimensions: 'Dài 10m, Rộng 500mm', 
                        load: '500kg/m', speed: '1-2m/s' },
                description: 'Băng tải cao su chất lượng cao, phù hợp cho các nhà máy sản xuất, khai thác mỏ.',
                documents: ['BV_BT100.pdf', 'HD_SD_BT100.pdf'],
                images: ['https://via.placeholder.com/600x400?text=Image+1', 'https://via.placeholder.com/600x400?text=Image+2'] },
            2: { id: 2, name: 'Máy ép thủy lực 50T', code: 'EP-50', category: 'Cơ khí',
                specs: { pressure: '50 tấn', stroke: '300mm', motor: '7.5kW', 
                        dimensions: '2000x1500x2500mm' },
                description: 'Máy ép thủy lực công suất lớn, điều khiển bằng PLC, an toàn và chính xác.',
                documents: ['BV_EP50.pdf', 'Thongso_EP50.pdf'],
                images: ['https://via.placeholder.com/600x400?text=Image+1'] }
        };
        setProduct(demoProducts[id] || demoProducts[1]);
        setLoading(false);
    }, [id]);

    if (loading) return <div className="spinner"></div>;
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

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
                            <img src={product.images[0]} alt={product.name} style={styles.mainImage} />
                        </div>
                        <div>
                            <h2>Thông số kỹ thuật</h2>
                            <table style={styles.specsTable}>
                                <tbody>
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <tr key={key}>
                                            <th style={styles.specsTh}>{key}</th>
                                            <td style={styles.specsTd}>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={styles.description}>
                        <h2>Mô tả sản phẩm</h2>
                        <p>{product.description}</p>
                    </div>

                    <div style={styles.documents}>
                        <h2>Tài liệu đính kèm</h2>
                        <ul style={styles.docList}>
                            {product.documents.map((doc, index) => (
                                <li key={index} style={styles.docItem}>
                                    <FiDownload />
                                    <a href="#" style={styles.docLink}>{doc}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={styles.contactBox}>
                        <h3>Quan tâm đến sản phẩm này?</h3>
                        <p>Liên hệ để được tư vấn và báo giá</p>
                        <div style={styles.contactButtons}>
                            <button className="btn btn-primary"><FiMail /> Gửi email</button>
                            <button className="btn btn-outline"><FiPhone /> Gọi điện</button>
                        </div>
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
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        marginBottom: '48px'
    },
    mainImage: {
        width: '100%',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)'
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