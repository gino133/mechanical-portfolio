import React, { useState, useEffect } from 'react';
import { blogAPI, categoryAPI } from '../../services/api';
import ImageField from '../../components/common/ImageField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const emptyForm = {
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    author: '',
    isPublished: true
};

const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await blogAPI.getAllAdmin();
            setPosts(response.data.data);
        } catch (error) {
            console.error('Lỗi tải bài viết:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getByType('blog');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content || formData.content === '<p><br></p>') {
            alert('Vui lòng nhập nội dung bài viết.');
            return;
        }
        setSaving(true);
        try {
            const payload = { ...formData };
            if (!payload.category) delete payload.category;

            if (editingPost) {
                await blogAPI.update(editingPost._id, payload);
            } else {
                await blogAPI.create(payload);
            }
            fetchPosts();
            setShowForm(false);
            setEditingPost(null);
            setFormData(emptyForm);
        } catch (error) {
            console.error('Lỗi lưu bài viết:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const openEditForm = async (post) => {
        try {
            // list endpoint omits `content` to keep it light - fetch full post
            const response = await blogAPI.getBySlug(post._id);
            const full = response.data.data;
            setEditingPost(full);
            setFormData({
                title: full.title,
                excerpt: full.excerpt || '',
                content: full.content,
                coverImage: full.coverImage || '',
                category: full.category?._id || full.category || '',
                author: full.author || '',
                isPublished: full.isPublished
            });
            setShowForm(true);
        } catch (error) {
            console.error('Lỗi tải bài viết:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                await blogAPI.delete(id);
                fetchPosts();
            } catch (error) {
                console.error('Lỗi xóa bài viết:', error);
            }
        }
    };

    const togglePublish = async (post) => {
        try {
            await blogAPI.update(post._id, { isPublished: !post.isPublished });
            fetchPosts();
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý Blog</h2>
                <button onClick={() => { setEditingPost(null); setFormData(emptyForm); setShowForm(true); }} style={styles.addBtn}>
                    + Viết bài mới
                </button>
            </div>

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingPost ? 'Sửa bài viết' : 'Viết bài mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Tiêu đề bài viết"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={styles.input}
                            />

                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={styles.input}
                            >
                                <option value="">-- Không thuộc danh mục nào --</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Tên tác giả (để trống sẽ ẩn)"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                style={styles.input}
                            />

                            <textarea
                                placeholder="Mô tả ngắn (hiện ở trang danh sách Blog)"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                style={{ ...styles.textarea, minHeight: '60px' }}
                            />

                            <ImageField
                                label="Ảnh bìa bài viết"
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                            />

                            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' }}>
                                Nội dung bài viết
                            </label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Viết nội dung bài viết ở đây..."
                            />

                            <label style={{ ...styles.checkbox, marginTop: '16px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                />
                                Xuất bản ngay (bỏ tick để lưu nháp, chưa hiện công khai)
                            </label>

                            <div style={styles.modalButtons}>
                                <button type="submit" disabled={saving} style={styles.saveBtn}>
                                    {saving ? 'Đang lưu...' : 'Lưu bài viết'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingPost(null); }} style={styles.cancelBtn}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="admin-table-wrap">
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th>Lượt xem</th>
                        <th>Ngày đăng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post._id}>
                            <td>{post.title}</td>
                            <td>{post.category?.name || '—'}</td>
                            <td>{post.isPublished ? '🟢 Đã đăng' : '⚪ Nháp'}</td>
                            <td>{post.viewCount || 0}</td>
                            <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td>
                                <button onClick={() => togglePublish(post)} style={styles.toggleBtn} title={post.isPublished ? 'Chuyển về nháp' : 'Xuất bản'}>
                                    {post.isPublished ? <FiEyeOff /> : <FiEye />}
                                </button>
                                <button onClick={() => openEditForm(post)} style={styles.editBtn}>Sửa</button>
                                <button onClick={() => handleDelete(post._id)} style={styles.deleteBtn}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {posts.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>Chưa có bài viết nào</td></tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    editBtn: { background: '#ffc107', color: '#333', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    toggleBtn: { background: '#e9ecef', color: '#333', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '30px 20px', overflowY: 'auto' },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '700px', maxWidth: '100%' },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    textarea: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default BlogManager;
