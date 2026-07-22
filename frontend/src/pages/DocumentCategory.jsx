import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiEye, FiFile, FiSearch, FiArrowLeft } from 'react-icons/fi';
import { documentAPI, categoryAPI } from '../services/api';

const UNCATEGORIZED_KEY = '__uncategorized__';

const DocumentCategory = () => {
    const { categoryId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [categoryLabel, setCategoryLabel] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAll();
    }, [categoryId]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [docsRes, catsRes] = await Promise.all([
                documentAPI.getAll({ limit: 500 }),
                categoryAPI.getByType('document')
            ]);

            const allDocs = docsRes.data.data;
            const categories = catsRes.data.data;

            if (categoryId === UNCATEGORIZED_KEY) {
                setCategoryLabel('Chưa phân loại');
                setDocuments(allDocs.filter((d) => !d.category?._id));
            } else {
                const cat = categories.find((c) => c._id === categoryId);
                setCategoryLabel(cat ? cat.name : 'Danh mục');
                setDocuments(allDocs.filter((d) => d.category?._id === categoryId));
            }
        } catch (error) {
            console.error('Lỗi tải tài liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocs = useMemo(() => {
        if (!searchTerm) return documents;
        const term = searchTerm.toLowerCase();
        return documents.filter((d) => d.name.toLowerCase().includes(term));
    }, [documents, searchTerm]);

    const handleView = (doc) => {
        window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    };

    const handleDownload = async (doc) => {
        try {
            const response = await documentAPI.getDownloadUrl(doc._id);
            window.open(response.data.data.url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Lỗi tải xuống:', error);
            window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <Link to="/documents" style={styles.backLink}><FiArrowLeft /> Quay lại Tài liệu</Link>
                    <h1 style={styles.title}>{categoryLabel}</h1>
                    <p style={styles.subtitle}>{documents.length} tài liệu</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.searchBox}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm trong danh mục này..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {filteredDocs.length === 0 ? (
                        <p style={styles.noResults}>Không có tài liệu nào</p>
                    ) : (
                        <div style={styles.list}>
                            {filteredDocs.map((doc) => (
                                <div key={doc._id} style={styles.docRow}>
                                    <div style={styles.docIcon}><FiFile size={22} /></div>
                                    <div style={styles.docInfo}>
                                        <p style={styles.docName}>{doc.name}</p>
                                        <div style={styles.docMeta}>
                                            <span style={styles.typeBadge}>{doc.fileType?.toUpperCase()}</span>
                                            <span>{doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : ''}</span>
                                            <span>{new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <div style={styles.docActions}>
                                        <button onClick={() => handleView(doc)} style={styles.actionBtn} title="Xem trước">
                                            <FiEye />
                                        </button>
                                        <button onClick={() => handleDownload(doc)} style={styles.actionBtn} title="Tải xuống">
                                            <FiDownload />
                                        </button>
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
        padding: '48px 0'
    },
    backLink: {
        color: 'white',
        opacity: 0.85,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '16px'
    },
    title: { fontSize: '30px', margin: 0 },
    subtitle: { fontSize: '14px', opacity: 0.85, marginTop: '8px' },
    section: { padding: '48px 0' },
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
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '800px',
        margin: '0 auto'
    },
    docRow: {
        background: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        display: 'flex',
        gap: '14px',
        alignItems: 'center'
    },
    docIcon: {
        color: 'var(--primary-color)',
        flexShrink: 0
    },
    docInfo: {
        flex: 1,
        minWidth: 0
    },
    docName: {
        fontWeight: '500',
        fontSize: '15px',
        marginBottom: '6px'
    },
    docMeta: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--text-light)',
        flexWrap: 'wrap'
    },
    typeBadge: {
        background: '#e3f2fd',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px'
    },
    docActions: {
        display: 'flex',
        gap: '8px'
    },
    actionBtn: {
        background: 'var(--bg-light)',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        color: 'var(--primary-color)',
        padding: '8px'
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        color: '#999'
    }
};

export default DocumentCategory;
