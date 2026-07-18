import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import ImageLightbox from '../components/common/ImageLightbox';

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => {
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await blogAPI.getBySlug(slug);
            setPost(response.data.data);
        } catch (error) {
            console.error('Lỗi tải bài viết:', error);
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    // Images embedded inside the article content (from the rich text
    // editor) also open in the same lightbox used across the rest of the
    // site, for a consistent click-to-enlarge experience.
    const handleContentClick = (e) => {
        if (e.target.tagName === 'IMG') {
            setLightboxImage(e.target.src);
        }
    };

    if (loading) return <div className="spinner"></div>;
    if (!post) return <div style={{ padding: '60px', textAlign: 'center' }}>Không tìm thấy bài viết</div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <Link to="/blog" style={styles.backLink}>← Quay lại Blog</Link>
                    {post.category?.name && <span className="card-category" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>{post.category.name}</span>}
                    <h1 style={styles.title}>{post.title}</h1>
                    <p style={styles.meta}>
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        {post.author ? ` • ${post.author}` : ''}
                        {' • '}{post.viewCount || 0} lượt xem
                    </p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container" style={styles.articleContainer}>
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            style={styles.coverImage}
                            onClick={() => setLightboxImage(post.coverImage)}
                        />
                    )}

                    <div
                        className="blog-content"
                        style={styles.content}
                        onClick={handleContentClick}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </section>

            <ImageLightbox src={lightboxImage} alt={post.title} onClose={() => setLightboxImage(null)} />
        </div>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '48px 0',
    },
    backLink: { color: 'white', opacity: 0.85, textDecoration: 'none', display: 'inline-block', marginBottom: '16px' },
    title: { fontSize: '32px', margin: '12px 0' },
    meta: { fontSize: '14px', opacity: 0.85 },
    section: { padding: '48px 0' },
    articleContainer: { maxWidth: '800px' },
    coverImage: {
        width: '100%', borderRadius: '10px', marginBottom: '32px', cursor: 'zoom-in',
        maxHeight: '420px', objectFit: 'cover'
    },
    content: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text-color)' }
};

export default BlogDetail;
