/**
 * Returns extra inline style props to layer a background image (with a
 * dark gradient overlay for text readability) under a page's hero banner.
 * Returns an empty object when no image is set, so the banner falls back
 * to its plain gradient background.
 */
export const heroBackgroundStyle = (imageUrl) => {
    if (!imageUrl) return {};
    return {
        backgroundImage: `linear-gradient(rgba(26,58,92,0.78), rgba(44,90,122,0.78)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };
};
