import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = ['Tất cả', 'Cơ khí', 'Điện'];

    useEffect(() => {
        // Demo data
        const demoProducts = [
            { id: 1, name: 'Băng tải cao su', code: 'BT-100', category: 'Cơ khí', specs: 'Tải 500kg/m, dài 10m', thumbnail: 'https://via.placeholder.com/300x200?text=Bang+tai' },
            { id: 2, name: 'Máy ép thủy lực 50T', code: 'EP-50', category: 'Cơ khí', specs: 'Lực ép 50 tấn, hành trình 300mm', thumbnail: 'https://via.placeholder.com/300x200?text=May+ep' },
            { id: 3, name: 'Tủ điện PLC Siemens', code: 'PLC-01', category: 'Điện', specs: '8 ngõ vào, 6 ngõ ra', thumbnail: 'https://via.placeholder.com/300x200?text=Tu+dien' },
            { id: 4, name: 'Con lăn băng tải', code: 'CL-89', category: 'Cơ khí', specs: 'Φ89mm, dày 3mm', thumbnail: 'https://via.placeholder.com/300x200?text=Con+lan' },
            { id: 5, name: 'Hệ thống báo mức', code: 'LM-01', category: 'Điện', specs: 'Cảm biến siêu âm, 4-20mA', thumbnail: 'https://via.placeholder.com/300x200?text=Bao+muc' },
            { id: 6, name: 'Bánh răng công nghiệp', code: 'BR-100', category: 'Cơ khí', specs: 'Module 5, 50 răng', thumbnail: 'https://via.placeholder.com/300x200?text=Banh+rang' }
        ];
        setProducts(demoProducts);
        setFilteredProducts(demoProducts);
        setLoading(false);
    }, []);

    useEffect(() => {
        let filtered = products;
        
        if (activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredProducts(filtered);
    }, [searchTerm, activeCategory, products]);

    if (loading) return <div className="spinner"></div>;

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

                    {/* Category Filter */}
                    <div style={styles.categories}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat === 'Tất cả' ? 'all' : cat)}
                                style={{
                                    ...styles.categoryBtn,
                                    ...(activeCategory === (cat === 'Tất cả' ? 'all' : cat) && styles.categoryBtnActive)
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <p style={styles.noResults}>Không tìm thấy sản phẩm nào</p>
                    ) : (
                        <div className="grid grid-3">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="card">
                                    <img src={product.thumbnail} alt={product.name} className="card-image" />
                                    <div className="card-content">
                                        <span className="card-category">{product.category}</span>
                                        <h3 className="card-title">{product.name}</h3>
                                        <p>Mã: {product.code}</p>
                                        <p style={styles.specs}>{product.specs}</p>
                                        <Link to={`/products/${product.id}`} className="btn btn-outline" style={styles.btn}>
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