import React from 'react';

const Card = ({ 
    children, 
    title = null,
    image = null,
    category = null,
    footer = null,
    hoverable = true,
    onClick = null,
    className = '',
    ...props 
}) => {
    const cardStyles = {
        background: 'var(--bg-white)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        transition: hoverable ? 'transform 0.3s ease, box-shadow 0.3s ease' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    };

    const hoverStyles = hoverable ? {
        ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: 'var(--shadow-hover)'
        }
    } : {};

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div 
            style={{ ...cardStyles, ...hoverStyles }} 
            onClick={handleClick}
            className={`card ${className}`}
            {...props}
        >
            {image && (
                <div style={styles.imageContainer}>
                    <img src={image} alt={title} style={styles.image} />
                    {category && (
                        <span style={styles.category}>{category}</span>
                    )}
                </div>
            )}
            
            <div style={styles.content}>
                {title && (
                    <h3 style={styles.title}>{title}</h3>
                )}
                <div style={styles.body}>
                    {children}
                </div>
                {footer && (
                    <div style={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    imageContainer: {
        position: 'relative',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        transition: 'transform 0.3s ease'
    },
    category: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'var(--primary-color)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500'
    },
    content: {
        padding: '16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--primary-color)',
        marginBottom: '12px'
    },
    body: {
        flex: 1,
        color: 'var(--text-color)',
        lineHeight: '1.6'
    },
    footer: {
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-color)'
    }
};

export default Card;