import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import MediaLibraryModal from './MediaLibraryModal';

/**
 * Props:
 * - value: array of image URLs
 * - onChange(urls): called with the updated array
 * - label: optional field label
 */
const MultiImageField = ({ value = [], onChange, label }) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (urls) => {
        const newUrls = urls.filter((url) => !value.includes(url));
        if (newUrls.length > 0) {
            onChange([...value, ...newUrls]);
        }
        setShowModal(false);
    };

    const handleRemove = (url) => {
        onChange(value.filter((u) => u !== url));
    };

    return (
        <div style={styles.wrapper}>
            {label && <label style={styles.label}>{label}</label>}
            <div style={styles.grid}>
                {value.map((url, index) => (
                    <div key={index} style={styles.item}>
                        <img src={url} alt={`Ảnh ${index + 1}`} style={styles.itemImg} />
                        <button type="button" onClick={() => handleRemove(url)} style={styles.removeBtn}>
                            <FiX size={12} />
                        </button>
                        {index === 0 && <span style={styles.mainBadge}>Ảnh chính</span>}
                    </div>
                ))}
                <div style={styles.addTile} onClick={() => setShowModal(true)}>
                    <FiPlus size={22} color="#999" />
                    <span style={styles.addLabel}>Thêm ảnh</span>
                </div>
            </div>
            <p style={styles.hint}>Ảnh đầu tiên sẽ dùng làm ảnh chính/thumbnail.</p>

            {showModal && (
                <MediaLibraryModal onSelect={handleSelect} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

const styles = {
    wrapper: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' },
    grid: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    item: {
        position: 'relative', width: '80px', height: '80px', borderRadius: '8px',
        overflow: 'hidden', border: '1px solid #ddd'
    },
    itemImg: { width: '100%', height: '100%', objectFit: 'cover' },
    removeBtn: {
        position: 'absolute', top: '3px', right: '3px', background: 'rgba(220,53,69,0.9)',
        color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    mainBadge: {
        position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(26,58,92,0.85)',
        color: 'white', fontSize: '9px', textAlign: 'center', padding: '2px 0'
    },
    addTile: {
        width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed #ccc',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', gap: '2px'
    },
    addLabel: { fontSize: '10px', color: '#999' },
    hint: { fontSize: '12px', color: '#999', marginTop: '8px' }
};

export default MultiImageField;
