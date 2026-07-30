/**
 * Strips HTML tags from a rich-text field (e.g. product/project
 * description, blog content) so it can be shown as plain text in a
 * listing card preview instead of literal "<p>...</p>" tags.
 *
 * Use this anywhere a rich-text field is shown outside its own detail
 * page - the detail page itself should keep rendering the real HTML via
 * dangerouslySetInnerHTML.
 */
export const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default stripHtml;
