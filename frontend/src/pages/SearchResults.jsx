import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI, projectAPI, documentAPI, blogAPI } from '../services/api';
import { FiFile, FiSearch } from 'react-icons/fi';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState({ products: [], projects: [], documents: [], blog: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setResults({ products: [], projects: [], documents: [], blog: [] });
            setLoading(false);
            return;
        }
        fetchAll();
    }, [query]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [productsRes, projectsRes, documentsRes, blogRes] = await Promise.all([
                productAPI.getAll({ search: query, limit: 12 }),
                projectAPI.getAll({ search: query, limit: 12 }),
                documentAPI.getAll({ search: query, limit: 12 }),
                blogAPI.getAll({ search: query, limit: 12 })
            ]);
            setResults({
                products: productsRes.data.data,
                projects: projectsRes.data.data,
                documents: documentsRes.data.data,
                blog: blogRes.data.data
            });
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalResults = results.products.length + results.projects.length + results.documents.length + results.blog.length;

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <h1 style={styles.title}>Kết quả tìm kiếm</h1>
                    <p style={styles.subtitle}>
                        {query ? `${totalResults} kết quả cho "${query}"` : 'Nhập từ khóa để tìm kiếm'}
                    </p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    {query && totalResults === 0 && (
                        <p style={styles.noResults}>
                            <FiSearch size={32} style={{ marginBottom: '12px' }} /><br />
                            Không tìm thấy kết quả nào cho "{query}"
                        </p>
                    )}

                    {results.products.length > 0 && (
                        <div style={styles.group}>
                            <h2 style={styles.groupTitle}>Sản phẩm ({results.products.length})</h2>
                            <div className="grid grid-3">
                                {results.products.map(item => (
                                    <Link key={item._id} to={`/products/${item._id}`} className="card" style={styles.cardLink}>
                                        <img src={item.thumbnail} alt={item.name} className="card-image" />
                                        <div className="card-content">
                                            <h3 className="card-title">{item.name}</h3>
                                            <p>Mã: {item.code}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.projects.length > 0 && (
                        <div style={styles.group}>
                            <h2 style={styles.groupTitle}>Dự án ({results.projects.length})</h2>
                            <div className="grid grid-3">
                                {results.projects.map(item => (
                                    <Link key={item._id} to={`/projects/${item._id}`} className="card" style={styles.cardLink}>
                                        <img src={item.thumbnail} alt={item.name} className="card-image" />
                                        <div className="card-content">
                                            <h3 className="card-title">{item.name}</h3>
                                            <p>Khách hàng: {item.client}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.blog.length > 0 && (
                        <div style={styles.group}>
                            <h2 style={styles.groupTitle}>Blog ({results.blog.length})</h2>
                            <div className="grid grid-3">
                                {results.blog.map(item => (
                                    <Link key={item._id} to={`/blog/${item.slug}`} className="card" style={styles.cardLink}>
                                        {item.coverImage && <img src={item.coverImage} alt={item.title} className="card-image" />}
                                        <div className="card-content">
                                            <h3 className="card-title">{item.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.documents.length > 0 && (
                        <div style={styles.group}>
                            <h2 style={styles.groupTitle}>Tài liệu ({results.documents.length})</h2>
                            <div style={styles.docList}>
                                {results.documents.map(item => (
                                    <a key={item._id} href={item.fileUrl} target="_blank" rel="noopener noreferrer" style={styles.docRow}>
                                        <FiFile style={{ color: 'var(--primary-color)' }} />
                                        <span>{item.name}</span>
                                        <span style={styles.docType}>{item.fileType?.toUpperCase()}</span>
                                    </a>
                                ))}
                            </div>
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
        padding: '48px 0'
    },
    title: { fontSize: '30px', margin: 0 },
    subtitle: { fontSize: '15px', opacity: 0.9, marginTop: '8px' },
    section: { padding: '48px 0' },
    group: { marginBottom: '48px' },
    groupTitle: { fontSize: '22px', color: 'var(--primary-color)', marginBottom: '20px' },
    cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
    docList: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '700px' },
    docRow: {
        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
        background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        textDecoration: 'none', color: 'var(--text-color)'
    },
    docType: { marginLeft: 'auto', fontSize: '11px', background: '#e3f2fd', padding: '2px 8px', borderRadius: '10px' },
    noResults: { textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '16px' }
};

export default SearchResults;
