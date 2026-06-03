import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { FiSave, FiEdit2, FiEye } from 'react-icons/fi';

const PagesManager = () => {
    const { settings, updateSettings } = useSettings();
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        content: '',
        seoTitle: '',
        seoDescription: ''
    });
    const [previewMode, setPreviewMode] = useState(false);

    // Các trang tĩnh có thể chỉnh sửa
    const staticPages = [
        { 
            id: 'about', 
            name: 'Giới thiệu', 
            icon: '👤',
            fields: ['title', 'content'],
            description: 'Nội dung trang Giới thiệu về bản thân, kinh nghiệm, kỹ năng'
        },
        { 
            id: 'contact', 
            name: 'Liên hệ', 
            icon: '📞',
            fields: ['title', 'content'],
            description: 'Thông tin liên hệ, địa chỉ, email, số điện thoại'
        },
        { 
            id: 'privacy', 
            name: 'Chính sách bảo mật', 
            icon: '🔒',
            fields: ['title', 'content'],
            description: 'Chính sách bảo mật thông tin khách hàng'
        },
        { 
            id: 'terms', 
            name: 'Điều khoản sử dụng', 
            icon: '📜',
            fields: ['title', 'content'],
            description: 'Điều khoản và điều kiện sử dụng website'
        }
    ];

    // Load page content from localStorage when editing
    const loadPageContent = (pageId) => {
        const savedContent = localStorage.getItem(`page_${pageId}`);
        if (savedContent) {
            return JSON.parse(savedContent);
        }
        // Default content
        const defaultContent = {
            about: {
                title: 'Giới thiệu về tôi',
                content: '<p>Tôi là Nguyễn Văn A, kỹ sư cơ khí với hơn 10 năm kinh nghiệm...</p>'
            },
            contact: {
                title: 'Liên hệ với tôi',
                content: '<p>Email: nguyenvana@email.com</p><p>Điện thoại: 0123 456 789</p>'
            },
            privacy: {
                title: 'Chính sách bảo mật',
                content: '<p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn...</p>'
            },
            terms: {
                title: 'Điều khoản sử dụng',
                content: '<p>Khi truy cập website này, bạn đồng ý với các điều khoản...</p>'
            }
        };
        return defaultContent[pageId] || { title: '', content: '' };
    };

    const handleEdit = (page) => {
        const content = loadPageContent(page.id);
        setEditingPage(page);
        setFormData({
            id: page.id,
            title: content.title || '',
            content: content.content || '',
            seoTitle: content.seoTitle || page.name,
            seoDescription: content.seoDescription || `Trang ${page.name} của website`
        });
        setPreviewMode(false);
    };

    const handleSave = () => {
        const pageContent = {
            title: formData.title,
            content: formData.content,
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(`page_${editingPage.id}`, JSON.stringify(pageContent));
        setEditingPage(null);
        alert(`Đã lưu nội dung trang ${editingPage.name}!`);
    };

    const getPageContent = (pageId) => {
        const saved = localStorage.getItem(`page_${pageId}`);
        return saved ? JSON.parse(saved) : { title: '', content: '' };
    };

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý trang tĩnh</h2>
                <p style={styles.subHeader}>Chỉnh sửa nội dung các trang giới thiệu, liên hệ, chính sách...</p>
            </div>

            {/* Danh sách các trang */}
            <div style={styles.pagesGrid}>
                {staticPages.map(page => {
                    const content = getPageContent(page.id);
                    return (
                        <div key={page.id} style={styles.pageCard}>
                            <div style={styles.pageIcon}>{page.icon}</div>
                            <div style={styles.pageInfo}>
                                <h3>{page.name}</h3>
                                <p>{page.description}</p>
                                <div style={styles.pageMeta}>
                                    <span>📝 Cập nhật: {content.updatedAt ? new Date(content.updatedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                            <div style={styles.pageActions}>
                                <button onClick={() => handleEdit(page)} style={styles.editPageBtn}>
                                    <FiEdit2 /> Chỉnh sửa
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form chỉnh sửa nội dung */}
            {editingPage && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3>✏️ Chỉnh sửa trang: {editingPage.name}</h3>
                            <div style={styles.modalTabs}>
                                <button 
                                    onClick={() => setPreviewMode(false)}
                                    style={{...styles.tabBtn, ...(!previewMode && styles.tabActive)}}
                                >
                                    Chỉnh sửa
                                </button>
                                <button 
                                    onClick={() => setPreviewMode(true)}
                                    style={{...styles.tabBtn, ...(previewMode && styles.tabActive)}}
                                >
                                    Xem trước
                                </button>
                            </div>
                        </div>

                        {!previewMode ? (
                            // Edit mode
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <div style={styles.formGroup}>
                                    <label>Tiêu đề trang</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        style={styles.input}
                                        placeholder="Nhập tiêu đề trang"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label>Nội dung (hỗ trợ HTML)</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        style={styles.textarea}
                                        rows="15"
                                        placeholder="Nhập nội dung trang... Có thể dùng thẻ HTML như <h2>, <p>, <strong>, <em>, <ul>, <li>..."
                                    />
                                    <small style={styles.hint}>
                                        💡 Gợi ý: Có thể dùng HTML để định dạng văn bản. Ví dụ: &lt;h2&gt;Tiêu đề&lt;/h2&gt;, &lt;p&gt;Đoạn văn&lt;/p&gt;
                                    </small>
                                </div>

                                <div style={styles.formGroup}>
                                    <label>SEO Title (Tiêu đề hiển thị trên Google)</label>
                                    <input
                                        type="text"
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                                        style={styles.input}
                                        placeholder="Tối ưu cho SEO"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label>SEO Description (Mô tả hiển thị trên Google)</label>
                                    <textarea
                                        value={formData.seoDescription}
                                        onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                                        style={styles.textarea}
                                        rows="2"
                                        placeholder="Mô tả ngắn gọn về trang, 150-160 ký tự"
                                    />
                                </div>

                                <div style={styles.modalButtons}>
                                    <button type="submit" style={styles.saveBtn}>
                                        <FiSave /> Lưu thay đổi
                                    </button>
                                    <button type="button" onClick={() => setEditingPage(null)} style={styles.cancelBtn}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Preview mode
                            <div style={styles.preview}>
                                <div style={styles.previewHeader}>
                                    <span>🔍 Xem trước nội dung</span>
                                    <span style={styles.previewUrl}>/{editingPage.id}</span>
                                </div>
                                <div style={styles.previewContent}>
                                    <h1>{formData.title}</h1>
                                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hướng dẫn sử dụng */}
            <div style={styles.helpSection}>
                <h3>📖 Hướng dẫn viết nội dung</h3>
                <div style={styles.helpGrid}>
                    <div style={styles.helpCard}>
                        <strong>🎨 Định dạng văn bản</strong>
                        <code>{'<h1>Tiêu đề chính</h1>'}</code>
                        <code>{'<h2>Tiêu đề phụ</h2>'}</code>
                        <code>{'<p>Đoạn văn bản</p>'}</code>
                        <code>{'<strong>In đậm</strong>'}</code>
                        <code>{'<em>In nghiêng</em>'}</code>
                    </div>
                    <div style={styles.helpCard}>
                        <strong>📋 Danh sách</strong>
                        <code>{'<ul><li>Mục 1</li><li>Mục 2</li></ul>'}</code>
                        <strong>🔗 Chèn link</strong>
                        <code>{'<a href="https://...">Link text</a>'}</code>
                        <strong>🖼️ Chèn ảnh</strong>
                        <code>{'<img src="url_anh" alt="mô tả">'}</code>
                    </div>
                    <div style={styles.helpCard}>
                        <strong>💡 Mẹo SEO</strong>
                        <p>✓ Tiêu đề 50-60 ký tự</p>
                        <p>✓ Mô tả 150-160 ký tự</p>
                        <p>✓ Dùng thẻ H1, H2 hợp lý</p>
                        <p>✓ Chèn từ khóa chính</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    header: {
        marginBottom: '24px'
    },
    subHeader: {
        color: '#666',
        marginTop: '8px'
    },
    pagesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    pageCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s'
    },
    pageIcon: {
        fontSize: '32px'
    },
    pageInfo: {
        flex: 1
    },
    pageInfo: {
        flex: 1
    },
    pageMeta: {
        fontSize: '12px',
        color: '#999',
        marginTop: '8px'
    },
    pageActions: {
        display: 'flex',
        gap: '8px'
    },
    editPageBtn: {
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modalContent: {
        background: 'white',
        borderRadius: '12px',
        width: '800px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '24px'
    },
    modalHeader: {
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e0e0e0'
    },
    modalTabs: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px'
    },
    tabBtn: {
        padding: '8px 16px',
        background: '#f0f0f0',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    tabActive: {
        background: '#007bff',
        color: 'white'
    },
    formGroup: {
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginTop: '6px',
        fontSize: '14px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginTop: '6px',
        fontFamily: 'monospace',
        fontSize: '13px'
    },
    hint: {
        display: 'block',
        marginTop: '6px',
        fontSize: '12px',
        color: '#999'
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '24px'
    },
    saveBtn: {
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    cancelBtn: {
        background: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    preview: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    previewHeader: {
        background: '#f5f7fa',
        padding: '12px 16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#666'
    },
    previewUrl: {
        fontFamily: 'monospace',
        color: '#007bff'
    },
    previewContent: {
        padding: '24px',
        maxHeight: '500px',
        overflow: 'auto'
    },
    helpSection: {
        background: '#f5f7fa',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px'
    },
    helpGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '16px'
    },
    helpCard: {
        background: 'white',
        padding: '16px',
        borderRadius: '8px'
    },
    helpCard: {
        background: 'white',
        padding: '16px',
        borderRadius: '8px'
    }
};

export default PagesManager;