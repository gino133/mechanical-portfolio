import React, { useRef, useMemo, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MediaLibraryModal from './MediaLibraryModal';

// Allow more font sizes than Quill's tiny/small/large/huge defaults, so it
// feels closer to picking a point size in Word.
const Size = Quill.import('formats/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px'];
Quill.register(Size, true);

const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'roboto', 'georgia'];
Quill.register(Font, true);

/**
 * Props:
 * - value: HTML string
 * - onChange(html): called on every edit
 * - placeholder: optional placeholder text
 * - minHeight: optional CSS height for the editable area (default 260px)
 */
const RichTextEditor = ({ value, onChange, placeholder, minHeight = '260px' }) => {
    const quillRef = useRef(null);
    const [showMediaModal, setShowMediaModal] = useState(false);

    // Opens the shared media library instead of Quill's default "pick a
    // local file" flow, so images inserted into articles are reused from
    // (or added to) the same library used everywhere else in the admin.
    const openImagePicker = () => {
        setShowMediaModal(true);
    };

    const handleImageSelected = (url) => {
        setShowMediaModal(false);
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        const altText = window.prompt('Mô tả cho hình ảnh (alt text, hiển thị khi ảnh lỗi và tốt cho SEO):', '') || '';

        editor.insertEmbed(range.index, 'image', url, 'user');
        // Tag the just-inserted image with alt text via the DOM node Quill
        // just created, since insertEmbed doesn't accept an alt attribute.
        setTimeout(() => {
            const img = editor.root.querySelector(`img[src="${url}"]:not([alt])`);
            if (img) img.setAttribute('alt', altText);
        }, 0);

        let nextIndex = range.index + 1;
        if (altText) {
            editor.insertText(nextIndex, `${altText}\n`, { italic: true, color: '#888' });
            nextIndex += altText.length + 1;
        } else {
            editor.insertText(nextIndex, '\n');
            nextIndex += 1;
        }
        editor.setSelection(nextIndex, 0);
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ font: Font.whitelist }, { size: Size.whitelist }],
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['blockquote', 'link', 'image'],
                ['clean']
            ],
            handlers: {
                image: openImagePicker
            }
        }
    }), []);

    const formats = [
        'font', 'size', 'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'align',
        'list', 'bullet', 'indent',
        'blockquote', 'link', 'image'
    ];

    return (
        <div>
            <style>{`.rte-wrapper .ql-editor { min-height: ${minHeight}; font-size: 15px; }`}</style>
            <div className="rte-wrapper">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value || ''}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            </div>
            {showMediaModal && (
                <MediaLibraryModal onSelect={handleImageSelected} onClose={() => setShowMediaModal(false)} />
            )}
        </div>
    );
};

export default RichTextEditor;
