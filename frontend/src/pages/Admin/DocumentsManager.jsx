import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiDownload, FiTrash2 } from 'react-icons/fi';

const DocumentsManager = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        file: null
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data.data);
        } catch (error) {
            console.error('Lỗi tải tài liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('file', formData.file);

        try {
            await api.post('/documents/upload', data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchDocuments();
            setShowForm(false);
            setFormData({ name: '', file: null });
        } catch (error) {
            console.error('Lỗi upload tài liệu:', error);
            alert('Có lỗi xảy ra');
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

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Upload tài liệu mới</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Tên tài liệu"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                style={styles.input}
                            />
                            <input
                                type="file"
                                onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                                required
                                style={styles.fileInput}
                            />
                            <div style={styles.modalButtons}>
                                <button type="submit" style={styles.saveBtn}>Upload</button>
                                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Tên tài liệu</th>
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
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    downloadBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', display: 'inline-block' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%' },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    fileInput: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default DocumentsManager;