/**
 * Strips Vietnamese diacritics (and lowercases) so client-side search can
 * match regardless of tone marks - e.g. "may ep" matches "Máy ép".
 * Mirrors backend/src/utils/removeDiacritics.js.
 */
export const removeDiacritics = (str) => {
    if (!str) return '';
    return str
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

export default removeDiacritics;