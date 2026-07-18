import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiDownload, FiEye, FiFile } from 'react-icons/fi';
import { documentAPI, categoryAPI } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import { heroBackgroundStyle } from '../utils/heroBackground';

const UNCATEGORIZED_KEY = '__uncategorized__';

const Documents = () => {
    const { settings } = useSettings();
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [docsRes, catsRes] = await Promise.all([
                documentAPI.getAll({ limit: 500 }),
                categoryAPI.getByType('document')
            ]);
            setDocuments(docsRes.data.data);
            setCategories(catsRes.data.data);
        } catch (error) {
            console.error('Lỗi tải tài liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocs = useMemo(() => {
        if (!searchTerm) return documents;
        const term = searchTerm.toLowerCase();
        return documents.filter(d => d.name.toLowerCase().includes(term));
    }, [documents, searchTerm]);

    // Group documents into columns: one column per category (in the admin-
    // defined order) plus a trailing "Chưa phân loại" column for documents
    // uploaded without a category. Split into a max of 5 columns per row -
    // CSS Grid auto-wraps extra columns onto new rows.
    const columns = useMemo(() => {
        const byCategory = {};
        for (const cat of categories) {
            byCategory[cat._id] = { id: cat._id, label: cat.name, docs: [] };
        }
        const uncategorized = { id: UNCATEGORIZED_KEY, label: 'Chưa phân loại', docs: [] };

        for (const doc of filteredDocs) {
            const catId = doc.category?._id;
            if (catId && byCategory[catId]) {
                byCategory[catId].docs.push(doc);
            } else {
                uncategorized.docs.push(doc);
            }
        }

        const cols = Object.values(byCategory);
        if (uncategorized.docs.length > 0) cols.push(uncategorized);
        return cols;
    }, [categories, filteredDocs]);

    const handleView = (doc) => {
        window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    };

    const handleDownload = async (doc) => {
        try {
            const response = await documentAPI.getDownloadUrl(doc._id);
            window.open(response.data.data.url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Lỗi tải xuống:', error);
            // Fall back to opening the stored file URL directly
            window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) return <div className="spinner"></div>;

    const columnCount = Math.max(1, Math.min(5, columns.length));

    return (
        <div>
            <section style={{ ...styles.hero, ...heroBackgroundStyle(settings.documentsHeroImage) }}>
                <div className="container">
                    <h1 style={styles.title}>Thư viện tài liệu</h1>
                    <p style={styles.subtitle}>Tài liệu kỹ thuật, bản vẽ, thuyết minh dự án</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.searchBox}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {columns.length === 0 ? (
                        <p style={styles.noResults}>Chưa có tài liệu nào được tải lên</p>
                    ) : (
                        <div style={{ ...styles.board, gridTemplateColumns: `repeat(${columnCount}, minmax(220px, 1fr))` }}>
                            {columns.map(col => (
                                <div key={col.id} style={styles.column}>
                                    <div style={styles.columnHeader}>
                                        <span>{col.label}</span>
                                        <span style={styles.countBadge}>{col.docs.length}</span>
                                    </div>
                                    <div style={styles.columnBody}>
                                        {col.docs.length === 0 && (
                                            <p style={styles.emptyCol}>Không có tài liệu</p>
                                        )}
                                        {col.docs.map(doc => (
                                            <div key={doc._id} style={styles.docCard}>
                                                <div style={styles.docIcon}><FiFile /></div>
                                                <div style={styles.docInfo}>
                                                    <p style={styles.docName} title={doc.name}>{doc.name}</p>
                                                    <div style={styles.docMeta}>
                                                        <span style={styles.typeBadge}>{doc.fileType?.toUpperCase()}</span>
                                                        <span>{doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : ''}</span>
                                                    </div>
                                                    <p style={styles.docDate}>
                                                        {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                                                    </p>
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
    board: {
        display: 'grid',
        gap: '20px',
        alignItems: 'start'
    },
    column: {
        background: '#f5f7fa',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    columnHeader: {
        background: 'var(--primary-color)',
        color: 'white',
        padding: '12px 16px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    countBadge: {
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '12px',
        padding: '2px 10px',
        fontSize: '13px'
    },
    columnBody: {
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '80px'
    },
    emptyCol: {
        color: '#999',
        fontSize: '13px',
        textAlign: 'center',
        padding: '16px 0'
    },
    docCard: {
        background: 'white',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start'
    },
    docIcon: {
        fontSize: '20px',
        color: 'var(--primary-color)',
        marginTop: '2px'
    },
    docInfo: {
        flex: 1,
        minWidth: 0
    },
    docName: {
        fontWeight: '500',
        fontSize: '14px',
        marginBottom: '6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    docMeta: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--text-light)',
        marginBottom: '4px'
    },
    typeBadge: {
        background: '#e3f2fd',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px'
    },
    docDate: {
        fontSize: '12px',
        color: '#999'
    },
    docActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        color: 'var(--primary-color)',
        padding: '4px'
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        color: '#999'
    }
};

export default Documents;
