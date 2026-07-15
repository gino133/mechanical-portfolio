import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * Full-screen image popup.
 * Renders nothing when `src` is falsy.
 * Clicking the dark backdrop (anywhere outside the image itself) closes it,
 * as does pressing Escape. Clicking the image does NOT close it.
 */
const ImageLightbox = ({ src, alt = '', onClose }) => {
    useEffect(() => {
        if (!src) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        // Prevent background scroll while the lightbox is open
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [src, onClose]);

    if (!src) return null;

    // Only close when the click lands on the backdrop itself, not on the
    // image or the close button (event.target === event.currentTarget).
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div style={styles.backdrop} onClick={handleBackdropClick}>
            <button style={styles.closeBtn} onClick={onClose} aria-label="Đóng">
                <FiX />
            </button>
            <img src={src} alt={alt} style={styles.image} onClick={handleBackdropClick} />
        </div>
    );
};

const styles = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        cursor: 'zoom-out',
        padding: '24px'
    },
    image: {
        maxWidth: '95vw',
        maxHeight: '90vh',
        objectFit: 'contain',
        borderRadius: '4px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        cursor: 'default'
    },
    closeBtn: {
        position: 'absolute',
        top: '20px',
        right: '24px',
        background: 'rgba(255,255,255,0.15)',
        border: 'none',
        color: 'white',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        fontSize: '22px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default ImageLightbox;
