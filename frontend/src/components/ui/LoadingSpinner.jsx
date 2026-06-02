import React from 'react';

const LoadingSpinner = ({ 
    size = 'medium', 
    color = 'primary',
    fullScreen = false,
    text = 'Đang tải...',
    ...props 
}) => {
    const getSize = () => {
        switch(size) {
            case 'small':
                return '30px';
            case 'medium':
                return '50px';
            case 'large':
                return '70px';
            default:
                return '50px';
        }
    };

    const getBorderSize = () => {
        switch(size) {
            case 'small':
                return '3px';
            case 'medium':
                return '4px';
            case 'large':
                return '5px';
            default:
                return '4px';
        }
    };

    const getColor = () => {
        switch(color) {
            case 'primary':
                return 'var(--primary-color)';
            case 'secondary':
                return 'var(--secondary-color)';
            case 'white':
                return 'white';
            default:
                return 'var(--primary-color)';
        }
    };

    const spinnerStyles = {
        width: getSize(),
        height: getSize(),
        border: `${getBorderSize()} solid var(--bg-light)`,
        borderTopColor: getColor(),
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    const containerStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
    };

    const fullScreenStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    // Add keyframe animation to document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    const SpinnerContent = () => (
        <div style={containerStyles}>
            <div style={spinnerStyles}></div>
            {text && <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div style={fullScreenStyles}>
                <SpinnerContent />
            </div>
        );
    }

    return <SpinnerContent />;
};

// Component for inline loading (very small)
export const SmallSpinner = ({ color = 'primary' }) => {
    const getColor = () => {
        switch(color) {
            case 'primary':
                return 'var(--primary-color)';
            case 'white':
                return 'white';
            default:
                return 'var(--primary-color)';
        }
    };

    return (
        <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--bg-light)',
            borderTopColor: getColor(),
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            display: 'inline-block'
        }}></div>
    );
};

// Component for skeleton loading
export const SkeletonCard = () => {
    return (
        <div style={skeletonStyles.card}>
            <div style={{ ...skeletonStyles.skeleton, height: '200px' }}></div>
            <div style={{ padding: '16px' }}>
                <div style={{ ...skeletonStyles.skeleton, width: '80%', height: '20px', marginBottom: '12px' }}></div>
                <div style={{ ...skeletonStyles.skeleton, width: '60%', height: '16px', marginBottom: '8px' }}></div>
                <div style={{ ...skeletonStyles.skeleton, width: '90%', height: '14px' }}></div>
            </div>
        </div>
    );
};

const skeletonStyles = {
    card: {
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)'
    },
    skeleton: {
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
    }
};

// Add shimmer animation
const shimmerStyle = document.createElement("style");
shimmerStyle.textContent = `
    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;
document.head.appendChild(shimmerStyle);

export default LoadingSpinner;