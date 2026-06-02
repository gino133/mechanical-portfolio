import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Demo data - sau này thay bằng API call
        const demoProducts = [
            {
                id: 1,
                name: 'Băng tải cao su',
                code: 'BT-100',
                category: 'Cơ khí',
                thumbnail: 'https://via.placeholder.com/300x200?text=Bang+tai'
            },
            {
                id: 2,
                name: 'Máy ép thủy lực 50T',
                code: 'EP-50',
                category: 'Cơ khí',
                thumbnail: 'https://via.placeholder.com/300x200?text=May+ep'
            },
            {
                id: 3,
                name: 'Tủ điện PLC',
                code: 'PLC-01',
                category: 'Điện',
                thumbnail: 'https://via.placeholder.com/300x200?text=Tu+dien'
            },
            {
                id: 4,
                name: 'Cầu trục 10 tấn',
                code: 'CT-10',
                category: 'Cơ khí',
                thumbnail: 'https://via.placeholder.com/300x200?text=Cau+truc'
            }
        ];
        setProducts(demoProducts);
        setLoading(false);
    }, []);

    if (loading) return <div className="spinner"></div>;

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.title}>Sản phẩm nổi bật</h2>
                <p style={styles.subtitle}>Các sản phẩm tiêu biểu đã thiết kế và chế tạo</p>

                <div className="grid grid-4">
                    {products.map(product => (
                        <div key={product.id} className="card">
                            <img src={product.thumbnail} alt={product.name} className="card-image" />
                            <div className="card-content">
                                <span className="card-category">{product.category}</span>
                                <h3 className="card-title">{product.name}</h3>
                                <p>Mã: {product.code}</p>
                                <Link to={`/products/${product.id}`} className="btn btn-outline" style={styles.btn}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.viewAll}>
                    <Link to="/products" className="btn btn-primary">Xem tất cả sản phẩm</Link>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '60px 0',
        background: 'white'
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

export default FeaturedProducts;