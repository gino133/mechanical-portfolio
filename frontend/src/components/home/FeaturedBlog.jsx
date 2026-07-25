import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../services/api';

const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim();

const FeaturedBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        blogAPI.getAll({ limit: 3 })
            .then((res) => setPosts(res.data.data))
            .catch((err) => console.error('Lỗi tải bài viết:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner"></div>;
    if (posts.length === 0) return null;

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.title}>Bài viết mới nhất</h2>
                <p style={styles.subtitle}>Chia sẻ kiến thức, kinh nghiệm về cơ khí & điện</p>

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
                                    {post.excerpt || stripHtml(post.content).substring(0, 100) + '...'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={styles.viewAll}>
                    <Link to="/blog" className="btn btn-primary">Xem tất cả bài viết</Link>
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
    cardLink: {
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
    },
    excerpt: {
        fontSize: '14px',
        color: 'var(--text-light)',
        marginTop: '8px',
        lineHeight: '1.5'
    },
    viewAll: {
        textAlign: 'center',
        marginTop: '40px'
    }
};

export default FeaturedBlog;
