/**
 * Strips Vietnamese diacritics (and lowercases) so search can match
 * regardless of tone marks - e.g. "may ep" matches "Máy ép".
 */
const removeDiacritics = (str) => {
    if (!str) return '';
    return str
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ') // drop remaining punctuation for looser matching
        .replace(/\s+/g, ' ')
        .trim();
};

module.exports = removeDiacritics;
