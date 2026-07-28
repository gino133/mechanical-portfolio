/**
 * Rewrites a Cloudinary image delivery URL to include auto format/quality
 * and a max width transformation, so the browser gets a right-sized,
 * modern-format (webp/avif) image instead of the original upload at full
 * resolution every time.
 *
 * Non-Cloudinary URLs (e.g. local /uploads fallback) are returned
 * unchanged - this is a no-op safety net, not a hard requirement.
 *
 * @param {string} url - original image URL
 * @param {number} width - target display width in px (image will be
 *   requested at this width; Cloudinary handles the resize)
 * @returns {string}
 */
export const optimizeImage = (url, width = 800) => {
    if (!url || typeof url !== 'string') return url;

    const marker = '/image/upload/';
    const idx = url.indexOf(marker);
    if (idx === -1) return url; // not a Cloudinary image delivery URL

    const insertAt = idx + marker.length;
    return `${url.slice(0, insertAt)}f_auto,q_auto,w_${width}/${url.slice(insertAt)}`;
};

export default optimizeImage;
