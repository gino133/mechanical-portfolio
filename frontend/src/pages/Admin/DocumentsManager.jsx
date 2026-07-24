import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { categoryAPI } from '../../services/api';
import { FiDownload, FiTrash2, FiCheck, FiFile } from 'react-icons/fi';

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

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDocuments();
        fetchCategories();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents', { params: { limit: 200 } });
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
            // Keep failed ones staged so the admin can retry, drop the ones that succeeded
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

            <div className="admin-table-wrap">
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Tên tài liệu</th>
                        <th>Danh mục</th>
                        <th>Loại file</th>
                        <th>Dung lượng</th>
                        <th>Ngày upload</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map(doc => (
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
                                <button onClick={() => handleDelete(doc._id)} style={styles.deleteBtn}>
                                    <FiTrash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
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
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    downloadBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', display: 'inline-block' },
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
