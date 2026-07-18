import React, { useState, useEffect, useRef } from 'react';
import { mediaAPI } from '../../services/api';
import { FiUpload, FiX, FiTrash2 } from 'react-icons/fi';

/**
 * Props:
 * - onSelect(url): called when the user picks/uploads an image
 * - onClose(): called to dismiss the modal
 */
const MediaLibraryModal = ({ onSelect, onClose }) => {
    const [tab, setTab] = useState('library'); // 'library' | 'upload'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchLibrary();
    }, []);

    const fetchLibrary = async () => {
        setLoading(true);
        try {
            const response = await mediaAPI.getAll({ limit: 100 });
            setItems(response.data.data);
        } catch (error) {
            console.error('Lỗi tải thư viện ảnh:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadFile = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Vui lòng chọn 1 file ảnh (jpg, png, gif...)');
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await mediaAPI.upload(formData);
            const uploaded = response.data.data;
            setItems((prev) => [uploaded, ...prev]);
            onSelect(uploaded.url);
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            alert('Upload thất bại, thử lại sau.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUploadFile(file);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Xoá ảnh này khỏi thư viện? (Ảnh đang được dùng ở nơi khác sẽ không tự mất, chỉ không chọn lại được nữa)')) return;
        try {
            await mediaAPI.delete(id);
            setItems((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Lỗi xoá ảnh:', error);
        }
    };

    return (
        <div style={styles.backdrop} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h3 style={{ margin: 0 }}>Chọn ảnh</h3>
                    <button onClick={onClose} style={styles.closeBtn}><FiX size={20} /></button>
                </div>

                <div style={styles.tabs}>
                    <button
                        onClick={() => setTab('library')}
                        style={{ ...styles.tab, ...(tab === 'library' ? styles.tabActive : {}) }}
                    >
                        Thư viện ảnh ({items.length})
                    </button>
                    <button
                        onClick={() => setTab('upload')}
                        style={{ ...styles.tab, ...(tab === 'upload' ? styles.tabActive : {}) }}
                    >
                        Tải ảnh mới lên
                    </button>
                </div>

                {tab === 'upload' && (
                    <div
                        style={{ ...styles.dropZone, ...(dragOver ? styles.dropZoneActive : {}) }}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => e.target.files[0] && handleUploadFile(e.target.files[0])}
                        />
                        <FiUpload size={36} color="#999" />
                        <p style={{ marginTop: '12px', color: '#666' }}>
                            {uploading ? 'Đang upload...' : 'Kéo thả ảnh vào đây, hoặc bấm để chọn file'}
                        </p>
                    </div>
                )}

                {tab === 'library' && (
                    loading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>
                    ) : items.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                            Chưa có ảnh nào trong thư viện. Chuyển sang tab "Tải ảnh mới lên" để bắt đầu.
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {items.map((item) => (
                                <div key={item._id} style={styles.item} onClick={() => onSelect(item.url)} title={item.fileName}>
                                    <img src={item.url} alt={item.fileName} style={styles.itemImg} />
                                    <button style={styles.itemDelete} onClick={(e) => handleDelete(e, item._id)} title="Xoá khỏi thư viện">
                                        <FiTrash2 size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

const styles = {
    backdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 3000, padding: '20px'
    },
    modal: {
        background: 'white', borderRadius: '12px', width: '720px', maxWidth: '100%',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', borderBottom: '1px solid #eee'
    },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666' },
    tabs: { display: 'flex', gap: '8px', padding: '12px 20px 0' },
    tab: {
        padding: '8px 16px', border: '1px solid #ddd', background: 'white',
        borderRadius: '6px 6px 0 0', cursor: 'pointer', fontSize: '14px'
    },
    tabActive: { background: '#1a3a5c', color: 'white', borderColor: '#1a3a5c' },
    dropZone: {
        margin: '20px', padding: '40px', border: '2px dashed #ccc', borderRadius: '10px',
        textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
    },
    dropZoneActive: { borderColor: '#1a3a5c', background: '#f0f7ff' },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: '12px', padding: '20px', overflowY: 'auto'
    },
    item: {
        position: 'relative', aspectRatio: '1 / 1', borderRadius: '8px', overflow: 'hidden',
        cursor: 'pointer', border: '1px solid #eee'
    },
    itemImg: { width: '100%', height: '100%', objectFit: 'cover' },
    itemDelete: {
        position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,53,69,0.85)',
        color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer'
    }
};

export default MediaLibraryModal;
