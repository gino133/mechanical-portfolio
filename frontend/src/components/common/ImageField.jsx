import React, { useState } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import MediaLibraryModal from './MediaLibraryModal';

/**
 * Props:
 * - value: current image URL (string, may be empty)
 * - onChange(url): called with the new URL when the user picks/uploads one, or '' when cleared
 * - label: optional field label
 */
const ImageField = ({ value, onChange, label }) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (url) => {
        onChange(url);
        setShowModal(false);
    };

    return (
        <div style={styles.wrapper}>
            {label && <label style={styles.label}>{label}</label>}
            <div style={styles.row}>
                <div style={styles.preview} onClick={() => setShowModal(true)}>
                    {value ? (
                        <img src={value} alt="preview" style={styles.previewImg} />
                    ) : (
                        <FiImage size={24} color="#bbb" />
                    )}
                </div>
                <div style={styles.buttons}>
                    <button type="button" onClick={() => setShowModal(true)} style={styles.chooseBtn}>
                        {value ? 'Đổi ảnh khác' : 'Chọn ảnh'}
                    </button>
                    {value && (
                        <button type="button" onClick={() => onChange('')} style={styles.clearBtn}>
                            <FiX size={14} /> Xoá
                        </button>
                    )}
                </div>
            </div>

            {showModal && (
                <MediaLibraryModal onSelect={handleSelect} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

const styles = {
    wrapper: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' },
    row: { display: 'flex', alignItems: 'center', gap: '12px' },
    preview: {
        width: '72px', height: '72px', border: '1px solid #ddd', borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        overflow: 'hidden', background: '#fafafa', flexShrink: 0
    },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    buttons: { display: 'flex', flexDirection: 'column', gap: '6px' },
    chooseBtn: {
        background: '#1a3a5c', color: 'white', border: 'none', padding: '8px 14px',
        borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
    },
    clearBtn: {
        background: 'none', color: '#c00', border: 'none', padding: '2px 0',
        cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'
    }
};

export default ImageField;
