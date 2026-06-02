import React from 'react';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium',
    onClick, 
    type = 'button',
    disabled = false,
    fullWidth = false,
    icon = null,
    className = '',
    ...props 
}) => {
    const getVariantStyles = () => {
        switch(variant) {
            case 'primary':
                return {
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none'
                };
            case 'secondary':
                return {
                    background: 'var(--secondary-color)',
                    color: 'white',
                    border: 'none'
                };
            case 'outline':
                return {
                    background: 'transparent',
                    color: 'var(--primary-color)',
                    border: '2px solid var(--primary-color)'
                };
            case 'danger':
                return {
                    background: '#dc3545',
                    color: 'white',
                    border: 'none'
                };
            case 'success':
                return {
                    background: '#28a745',
                    color: 'white',
                    border: 'none'
                };
            default:
                return {
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none'
                };
        }
    };

    const getSizeStyles = () => {
        switch(size) {
            case 'small':
                return {
                    padding: '6px 16px',
                    fontSize: '14px'
                };
            case 'medium':
                return {
                    padding: '10px 24px',
                    fontSize: '16px'
                };
            case 'large':
                return {
                    padding: '14px 32px',
                    fontSize: '18px'
                };
            default:
                return {
                    padding: '10px 24px',
                    fontSize: '16px'
                };
        }
    };

    const buttonStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: '500',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        ...getVariantStyles(),
        ...getSizeStyles()
    };

    const handleClick = (e) => {
        if (!disabled && onClick) {
            onClick(e);
        }
    };

    return (
        <button
            type={type}
            style={buttonStyles}
            onClick={handleClick}
            disabled={disabled}
            className={`btn btn-${variant} ${className}`}
            {...props}
        >
            {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;