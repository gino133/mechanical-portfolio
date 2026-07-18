import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI, categoryAPI } from '../services/api';

const stripHtml = (html) => html.replace(/<[^>]*>/g, '').trim();

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [activeCategory, searchTerm]);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getByType('blog');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = { limit: 100 };
            if (activeCategory !== 'all') params.category = activeCategory;
            if (searchTerm) params.search = searchTerm;
            const response = await blogAPI.getAll(params);
            setPosts(response.data.data);
        } catch (error) {
            console.error('Lỗi tải bài viết:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && posts.length === 0) return <div className="spinner"></div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <h1 style={styles.title}>Blog</h1>
                    <p style={styles.subtitle}>Chia sẻ kiến thức, kinh nghiệm về cơ khí & điện</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Tìm bài viết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {categories.length > 0 && (
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
                                    onClick={() => setActiveCategory(cat._id)}
                                    style={{ ...styles.categoryBtn, ...(activeCategory === cat._id && styles.categoryBtnActive) }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {posts.length === 0 ? (
                        <p style={styles.noResults}>Chưa có bài viết nào</p>
                    ) : (
                        <div className="grid grid-3">
                            {posts.map(post => (
                                <Link key={post._id} to={`/blog/${post.slug}`} className="card" style={styles.cardLink}>
                                    {post.coverImage && (
                                        <img src={post.coverImage} alt={post.title} className="card-image" />
                                    )}
                                    <div className="card-content">
                                        {post.category?.name && <span className="card-category">{post.category.name}</span>}
                                        <h3 className="card-title">{post.title}</h3>
                                        <p style={styles.excerpt}>
                                            {post.excerpt || stripHtml(post.content || '').substring(0, 120) + '...'}
                                        </p>
                                        <p style={styles.meta}>
                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            {post.author ? ` • ${post.author}` : ''}
                                        </p>
                                    </div>
                                </Link>
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
    title: { fontSize: '36px', marginBottom: '16px' },
    subtitle: { fontSize: '18px', opacity: 0.9 },
    section: { padding: '60px 0' },
    searchBox: { maxWidth: '500px', margin: '0 auto 24px' },
    searchInput: {
        width: '100%', padding: '12px', border: '1px solid var(--border-color)',
        borderRadius: '8px', fontSize: '16px'
    },
    categories: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' },
    categoryBtn: {
        padding: '8px 24px', border: '1px solid var(--border-color)', background: 'white',
        borderRadius: '25px', cursor: 'pointer'
    },
    categoryBtnActive: { background: 'var(--primary-color)', color: 'white', borderColor: 'var(--primary-color)' },
    cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
    excerpt: { fontSize: '14px', color: 'var(--text-light)', marginTop: '8px', lineHeight: '1.5' },
    meta: { fontSize: '12px', color: '#999', marginTop: '12px' },
    noResults: { textAlign: 'center', padding: '40px', color: '#999' }
};

export default Blog;
