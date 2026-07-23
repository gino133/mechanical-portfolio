import React, { useState, useEffect, useRef } from 'react';
import { mediaAPI } from '../../services/api';
import { FiUpload, FiX, FiTrash2, FiCheck } from 'react-icons/fi';

const stripExtension = (fileName) => fileName.replace(/\.[^/.]+$/, '');

/**
 * Props:
 * - onSelect(urls): called with an ARRAY of URLs when the user picks
 *   image(s) from the library or finishes a bulk upload
 * - onClose(): called to dismiss the modal
 */
const MediaLibraryModal = ({ onSelect, onClose }) => {
    const [tab, setTab] = useState('library'); // 'library' | 'upload'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Bulk upload staging: files picked but not uploaded yet, each with an
    // editable display name (defaults to the filename without extension).
    const [pendingFiles, setPendingFiles] = useState([]); // [{ file, name }]
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

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

    const addFilesToPending = (fileList) => {
        const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
        if (files.length < fileList.length) {
            alert('Một số file không phải ảnh đã bị bỏ qua.');
        }
        const staged = files.map((file) => ({ file, name: stripExtension(file.name) }));
        setPendingFiles((prev) => [...prev, ...staged]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) addFilesToPending(e.dataTransfer.files);
    };

    const updatePendingName = (index, name) => {
        setPendingFiles((prev) => prev.map((p, i) => (i === index ? { ...p, name } : p)));
    };

    const removePending = (index) => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUploadAll = async () => {
        if (pendingFiles.length === 0) return;
        setUploading(true);
        setUploadProgress({ done: 0, total: pendingFiles.length });

        const uploaded = [];
        for (const pending of pendingFiles) {
            try {
                const formData = new FormData();
                formData.append('image', pending.file);
                formData.append('name', pending.name);
                const response = await mediaAPI.upload(formData);
                uploaded.push(response.data.data);
            } catch (error) {
                console.error(`Lỗi upload "${pending.name}":`, error);
                const serverMessage = error.response?.data?.message;
                alert(`Upload "${pending.name}" thất bại: ${serverMessage || 'lỗi không xác định'}. Các file khác vẫn tiếp tục upload.`);
            }
            setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        }

        setItems((prev) => [...uploaded, ...prev]);
        setPendingFiles([]);
        setUploading(false);

        if (uploaded.length > 0) {
            onSelect(uploaded.map((u) => u.url));
        }
    };

    const handleDeleteFromLibrary = async (e, id) => {
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
                    <div style={{ overflowY: 'auto' }}>
                        {pendingFiles.length === 0 ? (
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
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={(e) => e.target.files.length && addFilesToPending(e.target.files)}
                                />
                                <FiUpload size={36} color="#999" />
                                <p style={{ marginTop: '12px', color: '#666' }}>
                                    Kéo thả nhiều ảnh vào đây, hoặc bấm để chọn file (chọn được nhiều file cùng lúc)
                                </p>
                            </div>
                        ) : (
                            <div style={styles.pendingWrap}>
                                <p style={styles.pendingHint}>
                                    Tên mặc định lấy theo tên file - bạn có thể sửa lại trước khi upload.
                                </p>
                                <div style={styles.pendingList}>
                                    {pendingFiles.map((p, index) => (
                                        <div key={index} style={styles.pendingRow}>
                                            <img
                                                src={URL.createObjectURL(p.file)}
                                                alt=""
                                                style={styles.pendingThumb}
                                            />
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
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.pendingActions}>
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        style={styles.addMoreBtn}
                                        disabled={uploading}
                                    >
                                        + Thêm file khác
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={(e) => e.target.files.length && addFilesToPending(e.target.files)}
                                    />
                                    <button
                                        onClick={handleUploadAll}
                                        disabled={uploading}
                                        style={styles.uploadAllBtn}
                                    >
                                        <FiCheck />
                                        {uploading
                                            ? `Đang upload ${uploadProgress.done}/${uploadProgress.total}...`
                                            : `Upload tất cả (${pendingFiles.length})`}
                                    </button>
                                </div>
                            </div>
                        )}
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
                                <div key={item._id} style={styles.item} onClick={() => onSelect([item.url])} title={item.fileName}>
                                    <img src={item.url} alt={item.fileName} style={styles.itemImg} />
                                    <button style={styles.itemDelete} onClick={(e) => handleDeleteFromLibrary(e, item._id)} title="Xoá khỏi thư viện">
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
    pendingWrap: { padding: '20px' },
    pendingHint: { fontSize: '13px', color: '#777', marginBottom: '12px' },
    pendingList: {
        display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto'
    },
    pendingRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    pendingThumb: {
        width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid #eee'
    },
    pendingInput: {
        flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'
    },
    pendingRemove: {
        background: '#fee', color: '#c00', border: 'none', borderRadius: '6px',
        padding: '8px', cursor: 'pointer', flexShrink: 0
    },
    pendingActions: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px'
    },
    addMoreBtn: {
        background: 'white', border: '1px solid #ddd', borderRadius: '6px',
        padding: '10px 16px', cursor: 'pointer', fontSize: '14px'
    },
    uploadAllBtn: {
        background: '#28a745', color: 'white', border: 'none', borderRadius: '6px',
        padding: '10px 20px', cursor: 'pointer', fontSize: '14px',
        display: 'flex', alignItems: 'center', gap: '8px'
    },
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
