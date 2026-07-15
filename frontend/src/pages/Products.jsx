import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [activeCategory, searchTerm]);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getByType('product');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = { limit: 100 };
            if (activeCategory !== 'all') params.category = activeCategory;
            if (searchTerm) params.search = searchTerm;
            const response = await productAPI.getAll(params);
            setProducts(response.data.data);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && products.length === 0) return <div className="spinner"></div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <h1 style={styles.title}>Sản phẩm</h1>
                    <p style={styles.subtitle}>Catalogue sản phẩm cơ khí & điện</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    {/* Search */}
                    <div style={styles.searchBox}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {/* Category Filter - dynamic from admin-managed categories */}
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
                                style={{
                                    ...styles.categoryBtn,
                                    ...(activeCategory === cat.name && styles.categoryBtnActive)
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    {products.length === 0 ? (
                        <p style={styles.noResults}>Chưa có sản phẩm nào trong mục này</p>
                    ) : (
                        <div className="grid grid-3">
                            {products.map(product => (
                                <div key={product._id} className="card">
                                    <img src={product.thumbnail} alt={product.name} className="card-image" />
                                    <div className="card-content">
                                        <span className="card-category">{product.category?.name}</span>
                                        <h3 className="card-title">{product.name}</h3>
                                        <p>Mã: {product.code}</p>
                                        <p style={styles.specs}>{product.description}</p>
                                        <Link to={`/products/${product._id}`} className="btn btn-outline" style={styles.btn}>
                                            Xem chi tiết
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
    searchBox: {
        position: 'relative',
        maxWidth: '500px',
        margin: '0 auto 32px'
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#999'
    },
    searchInput: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        fontSize: '16px'
    },
    categories: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '40px',
        flexWrap: 'wrap'
    },
    categoryBtn: {
        padding: '8px 24px',
        border: '1px solid var(--border-color)',
        background: 'white',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    categoryBtnActive: {
        background: 'var(--primary-color)',
        color: 'white',
        borderColor: 'var(--primary-color)'
    },
    specs: {
        fontSize: '14px',
        color: 'var(--text-light)',
        marginTop: '8px'
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

export default Products;
