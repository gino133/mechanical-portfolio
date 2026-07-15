import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('new'); // 'new' | 'featured'

    useEffect(() => {
        fetchProducts();
    }, [mode]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = mode === 'featured'
                ? await productAPI.getFeatured()
                : await productAPI.getAll({ limit: 4 }); // API already sorts by newest first
            setProducts(response.data.data);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.title}>Sản phẩm</h2>
                <p style={styles.subtitle}>Các sản phẩm tiêu biểu đã thiết kế và chế tạo</p>

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
                ) : products.length === 0 ? (
                    <p style={styles.noResults}>
                        {mode === 'featured' ? 'Chưa có sản phẩm nào được đánh dấu nổi bật' : 'Chưa có sản phẩm nào'}
                    </p>
                ) : (
                    <div className="grid grid-4">
                        {products.map(product => (
                            <div key={product._id} className="card">
                                <img src={product.thumbnail} alt={product.name} className="card-image" />
                                <div className="card-content">
                                    <span className="card-category">{product.category?.name}</span>
                                    <h3 className="card-title">{product.name}</h3>
                                    <p>Mã: {product.code}</p>
                                    <Link to={`/products/${product._id}`} className="btn btn-outline" style={styles.btn}>
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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

export default FeaturedProducts;
