import React, { useState } from 'react';
import { FiPlus, FiX, FiFile } from 'react-icons/fi';
import DocumentLibraryModal from './DocumentLibraryModal';

/**
 * Props:
 * - value: array of attached document objects (must include at least _id
 *   and name; fileType/fileUrl used for display when available)
 * - onChange(docs): called with the updated array
 * - label: optional field label
 */
const DocumentField = ({ value = [], onChange, label }) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (docs) => {
        const existingIds = value.map((d) => d._id);
        const newDocs = docs.filter((d) => !existingIds.includes(d._id));
        if (newDocs.length > 0) {
            onChange([...value, ...newDocs]);
        }
        setShowModal(false);
    };

    const handleRemove = (id) => {
        onChange(value.filter((d) => d._id !== id));
    };

    return (
        <div style={styles.wrapper}>
            {label && <label style={styles.label}>{label}</label>}

            {value.length > 0 && (
                <div style={styles.list}>
                    {value.map((doc) => (
                        <div key={doc._id} style={styles.row}>
                            <FiFile style={{ color: '#1a3a5c', flexShrink: 0 }} />
                            <span style={styles.name}>{doc.name}</span>
                            {doc.fileType && <span style={styles.type}>{doc.fileType.toUpperCase()}</span>}
                            <button type="button" onClick={() => handleRemove(doc._id)} style={styles.removeBtn}>
                                <FiX size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button type="button" onClick={() => setShowModal(true)} style={styles.addBtn}>
                <FiPlus /> Thêm tài liệu
            </button>

            {showModal && (
                <DocumentLibraryModal
                    onSelect={handleSelect}
                    onClose={() => setShowModal(false)}
                    alreadySelectedIds={value.map((d) => d._id)}
                />
            )}
        </div>
    );
};

const styles = {
    wrapper: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' },
    list: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' },
    row: {
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
        border: '1px solid #eee', borderRadius: '6px', background: '#fafbfc'
    },
    name: { flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    type: { fontSize: '10px', background: '#e3f2fd', padding: '2px 6px', borderRadius: '8px', flexShrink: 0 },
    removeBtn: {
        background: '#fee', color: '#c00', border: 'none', borderRadius: '4px',
        padding: '4px', cursor: 'pointer', flexShrink: 0
    },
    addBtn: {
        display: 'flex', alignItems: 'center', gap: '6px', background: '#eef4fb',
        color: '#1a3a5c', border: 'none', borderRadius: '6px', padding: '8px 14px',
        cursor: 'pointer', fontSize: '13px'
    }
};

export default DocumentField;
