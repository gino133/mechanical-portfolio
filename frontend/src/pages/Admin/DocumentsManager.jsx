import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { categoryAPI } from '../../services/api';
import { FiDownload, FiTrash2, FiCheck, FiFile, FiEdit2, FiChevronUp, FiChevronDown, FiSearch } from 'react-icons/fi';

const stripExtension = (fileName) => fileName.replace(/\.[^/.]+$/, '');

const DocumentsManager = () => {
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [category, setCategory] = useState('');

    // Bulk upload staging: files picked but not uploaded yet, each with an
    // editable display name (defaults to the filename without extension).
    const [pendingFiles, setPendingFiles] = useState([]); // [{ file, name }]
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

    // Filter + sort state for the list below
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [sortField, setSortField] = useState('uploadedAt');
    const [sortDir, setSortDir] = useState('desc');

    // Edit modal (rename / re-categorize an existing document)
    const [editingDoc, setEditingDoc] = useState(null);
    const [editName, setEditName] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDocuments();
        fetchCategories();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents', { params: { limit: 500 } });
            setDocuments(response.data.data);
        } catch (error) {
            console.error('Lỗi tải tài liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getByType('document');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    const addFilesToPending = (fileList) => {
        const staged = Array.from(fileList).map((file) => ({ file, name: stripExtension(file.name) }));
        setPendingFiles((prev) => [...prev, ...staged]);
    };

    const updatePendingName = (index, name) => {
        setPendingFiles((prev) => prev.map((p, i) => (i === index ? { ...p, name } : p)));
    };

    const removePending = (index) => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const closeForm = () => {
        setShowForm(false);
        setPendingFiles([]);
        setCategory('');
    };

    const handleUploadAll = async () => {
        if (pendingFiles.length === 0) return;
        setUploading(true);
        setUploadProgress({ done: 0, total: pendingFiles.length });

        let successCount = 0;
        for (const pending of pendingFiles) {
            const data = new FormData();
            data.append('name', pending.name);
            data.append('file', pending.file);
            if (category) data.append('category', category);

            try {
                await api.post('/documents', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                successCount += 1;
            } catch (error) {
                console.error(`Lỗi upload "${pending.name}":`, error);
                const serverMessage = error.response?.data?.message;
                alert(`Upload "${pending.name}" thất bại: ${serverMessage || 'lỗi không xác định'}. Các file khác vẫn tiếp tục upload.`);
            }
            setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        }

        setUploading(false);
        fetchDocuments();
        if (successCount === pendingFiles.length) {
            closeForm();
        } else {
            setPendingFiles([]);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa tài liệu này?')) {
            try {
                await api.delete(`/documents/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchDocuments();
            } catch (error) {
                console.error('Lỗi xóa tài liệu:', error);
            }
        }
    };

    const openEdit = (doc) => {
        setEditingDoc(doc);
        setEditName(doc.name);
        setEditCategory(doc.category?._id || '');
    };

    const handleSaveEdit = async () => {
        if (!editName.trim()) {
            alert('Tên tài liệu không được để trống.');
            return;
        }
        setSavingEdit(true);
        try {
            await api.put(`/documents/${editingDoc._id}`, {
                name: editName.trim(),
                category: editCategory || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingDoc(null);
            fetchDocuments();
        } catch (error) {
            console.error('Lỗi sửa tài liệu:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSavingEdit(false);
        }
    };

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const fileTypes = useMemo(() => {
        const types = new Set(documents.map((d) => d.fileType).filter(Boolean));
        return Array.from(types).sort();
    }, [documents]);

    const displayedDocs = useMemo(() => {
        let list = [...documents];

        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            list = list.filter((d) => d.name.toLowerCase().includes(term));
        }
        if (filterCategory !== 'all') {
            list = list.filter((d) =>
                filterCategory === 'none' ? !d.category?._id : d.category?._id === filterCategory
            );
        }
        if (filterType !== 'all') {
            list = list.filter((d) => d.fileType === filterType);
        }

        list.sort((a, b) => {
            let valA, valB;
            switch (sortField) {
                case 'name': valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); break;
                case 'category': valA = a.category?.name || ''; valB = b.category?.name || ''; break;
                case 'fileType': valA = a.fileType || ''; valB = b.fileType || ''; break;
                case 'fileSize': valA = a.fileSize || 0; valB = b.fileSize || 0; break;
                default: valA = new Date(a.uploadedAt).getTime(); valB = new Date(b.uploadedAt).getTime();
            }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return list;
    }, [documents, searchTerm, filterCategory, filterType, sortField, sortDir]);

    const SortHeader = ({ field, children }) => (
        <th onClick={() => toggleSort(field)} style={styles.sortableTh}>
            <span style={styles.sortHeaderContent}>
                {children}
                {sortField === field && (sortDir === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />)}
            </span>
        </th>
    );

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý tài liệu</h2>
                <button onClick={() => setShowForm(true)} style={styles.addBtn}>
                    + Upload tài liệu
                </button>
            </div>

            {categories.length === 0 && (
                <div style={styles.warning}>
                    💡 Chưa có danh mục tài liệu nào. Vào mục <strong>"Danh mục"</strong> ở sidebar để tạo (VD: "Bản vẽ CAD", "Thuyết minh"...) — giúp trang Tài liệu công khai tự động chia thành các cột theo từng mục.
                </div>
            )}

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Upload tài liệu (chọn được nhiều file cùng lúc)</h3>

                        <label style={styles.label}>Danh mục (áp dụng cho tất cả file trong lần upload này)</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={styles.input}
                        >
                            <option value="">-- Không thuộc mục nào --</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>

                        {pendingFiles.length === 0 ? (
                            <label style={styles.dropZone}>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => e.target.files.length && addFilesToPending(e.target.files)}
                                    style={{ display: 'none' }}
                                />
                                <FiFile size={32} color="#999" />
                                <p style={{ marginTop: '10px', color: '#666' }}>Bấm để chọn file (chọn được nhiều file cùng lúc)</p>
                            </label>
                        ) : (
                            <div>
                                <p style={styles.pendingHint}>
                                    Tên mặc định lấy theo tên file - bạn có thể sửa lại trước khi upload.
                                </p>
                                <div style={styles.pendingList}>
                                    {pendingFiles.map((p, index) => (
                                        <div key={index} style={styles.pendingRow}>
                                            <FiFile style={{ flexShrink: 0, color: '#1a3a5c' }} />
                                            <input
                                                type="text"
                                                value={p.name}
                                                onChange={(e) => updatePendingName(index, e.target.value)}
                                                style={styles.pendingInput}
                                                disabled={uploading}
                                            />
                                            <button
                                                onClick={() => removePending(index)}
                                                style={styles.pendingRemove}
                                                disabled={uploading}
                                                title="Bỏ file này"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label style={styles.addMoreBtn}>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => e.target.files.length && addFilesToPending(e.target.files)}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                    + Thêm file khác
                                </label>
                            </div>
                        )}

                        <div style={styles.modalButtons}>
                            <button
                                onClick={handleUploadAll}
                                disabled={uploading || pendingFiles.length === 0}
                                style={styles.saveBtn}
                            >
                                <FiCheck />
                                {uploading
                                    ? `Đang upload ${uploadProgress.done}/${uploadProgress.total}...`
                                    : `Upload tất cả (${pendingFiles.length})`}
                            </button>
                            <button type="button" onClick={closeForm} disabled={uploading} style={styles.cancelBtn}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {editingDoc && (
                <div style={styles.modal}>
                    <div style={{ ...styles.modalContent, width: '450px' }}>
                        <h3>Sửa tài liệu</h3>
                        <label style={styles.label}>Tên tài liệu</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={styles.input}
                        />
                        <label style={styles.label}>Danh mục</label>
                        <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            style={styles.input}
                        >
                            <option value="">-- Không thuộc mục nào --</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        <div style={styles.modalButtons}>
                            <button onClick={handleSaveEdit} disabled={savingEdit} style={styles.saveBtn}>
                                {savingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button type="button" onClick={() => setEditingDoc(null)} style={styles.cancelBtn}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={styles.filterBar}>
                <div style={styles.searchBox}>
                    <FiSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên tài liệu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={styles.filterSelect}>
                    <option value="all">Tất cả danh mục</option>
                    <option value="none">Chưa phân loại</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={styles.filterSelect}>
                    <option value="all">Tất cả loại file</option>
                    {fileTypes.map((type) => (
                        <option key={type} value={type}>{type.toUpperCase()}</option>
                    ))}
                </select>
                <span style={styles.resultCount}>{displayedDocs.length} / {documents.length} tài liệu</span>
            </div>

            {/* Scrollable list */}
            <div className="admin-table-wrap admin-scroll-list">
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <SortHeader field="name">Tên tài liệu</SortHeader>
                            <SortHeader field="category">Danh mục</SortHeader>
                            <SortHeader field="fileType">Loại file</SortHeader>
                            <SortHeader field="fileSize">Dung lượng</SortHeader>
                            <SortHeader field="uploadedAt">Ngày upload</SortHeader>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedDocs.map(doc => (
                            <tr key={doc._id}>
                                <td>{doc.name}</td>
                                <td>{doc.category?.name || '—'}</td>
                                <td>{doc.fileType?.toUpperCase() || 'N/A'}</td>
                                <td>{doc.fileSize ? (doc.fileSize / 1024).toFixed(2) + ' KB' : 'N/A'}</td>
                                <td>{new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={styles.downloadBtn}>
                                        <FiDownload />
                                    </a>
                                    <button onClick={() => openEdit(doc)} style={styles.editBtn}>
                                        <FiEdit2 />
                                    </button>
                                    <button onClick={() => handleDelete(doc._id)} style={styles.deleteBtn}>
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {displayedDocs.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>Không có tài liệu nào khớp bộ lọc</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    warning: { background: '#fff3cd', color: '#856404', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' },
    filterBar: {
        display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
        marginBottom: '16px', background: 'white', padding: '12px', borderRadius: '8px'
    },
    searchBox: { position: 'relative', flex: '1 1 220px' },
    searchIcon: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' },
    searchInput: { width: '100%', padding: '9px 10px 9px 32px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    filterSelect: { padding: '9px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: 'white' },
    resultCount: { fontSize: '13px', color: '#888', marginLeft: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    sortableTh: { cursor: 'pointer', userSelect: 'none' },
    sortHeaderContent: { display: 'inline-flex', alignItems: 'center', gap: '4px' },
    downloadBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', display: 'inline-block' },
    editBtn: { background: '#ffc107', color: '#333', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '30px 20px', overflowY: 'auto' },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '550px', maxWidth: '100%' },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    dropZone: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '30px', border: '2px dashed #ccc', borderRadius: '10px', cursor: 'pointer', marginBottom: '16px'
    },
    pendingHint: { fontSize: '13px', color: '#777', marginBottom: '10px' },
    pendingList: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', marginBottom: '12px' },
    pendingRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    pendingInput: { flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    pendingRemove: { background: '#fee', color: '#c00', border: 'none', borderRadius: '6px', padding: '8px 10px', cursor: 'pointer', flexShrink: 0 },
    addMoreBtn: {
        display: 'inline-block', background: 'white', border: '1px solid #ddd', borderRadius: '6px',
        padding: '8px 16px', cursor: 'pointer', fontSize: '13px', marginBottom: '16px'
    },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default DocumentsManager;
