import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const TYPE_LABELS = {
    product: 'Sản phẩm',
    project: 'Dự án',
    document: 'Tài liệu'
};

const slugify = (text) =>
    text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip Vietnamese accents
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

const CategoriesManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState('product');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', type: 'product', order: 0 });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getAll();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        } finally {
            setLoading(false);
        }
    };

    const openAddForm = () => {
        setEditingCategory(null);
        setFormData({ name: '', slug: '', type: activeType, order: 0 });
        setShowForm(true);
    };

    const openEditForm = (cat) => {
        setEditingCategory(cat);
        setFormData({ name: cat.name, slug: cat.slug, type: cat.type, order: cat.order || 0 });
        setShowForm(true);
    };

    const handleNameChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            name: value,
            // Auto-generate slug from name unless editing an existing category
            slug: editingCategory ? prev.slug : slugify(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCategory) {
                await categoryAPI.update(editingCategory._id, formData);
            } else {
                await categoryAPI.create(formData);
            }
            await fetchCategories();
            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Lỗi lưu danh mục:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra, kiểm tra lại tên/slug (phải là duy nhất).');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xoá mục này? Các sản phẩm/dự án/tài liệu đang gắn mục này sẽ không bị xoá, nhưng sẽ mất liên kết tới mục.')) {
            try {
                await categoryAPI.delete(id);
                fetchCategories();
            } catch (error) {
                console.error('Lỗi xoá danh mục:', error);
            }
        }
    };

    if (loading) return <div>Đang tải...</div>;

    const filtered = categories.filter((c) => c.type === activeType).sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý danh mục</h2>
                <button onClick={openAddForm} style={styles.addBtn}>+ Thêm danh mục</button>
            </div>

            <div style={styles.tabs}>
                {Object.entries(TYPE_LABELS).map(([type, label]) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        style={{ ...styles.tab, ...(activeType === type ? styles.tabActive : {}) }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <label style={styles.label}>Áp dụng cho</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                style={styles.input}
                            >
                                {Object.entries(TYPE_LABELS).map(([type, label]) => (
                                    <option key={type} value={type}>{label}</option>
                                ))}
                            </select>

                            <label style={styles.label}>Tên danh mục</label>
                            <input
                                type="text"
                                placeholder="VD: Bản vẽ CAD"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                                style={styles.input}
                            />

                            <label style={styles.label}>Slug (định danh, không dấu, không khoảng trắng)</label>
                            <input
                                type="text"
                                placeholder="VD: ban-ve-cad"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                                style={styles.input}
                            />

                            <label style={styles.label}>Thứ tự hiển thị</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                style={styles.input}
                            />

                            <div style={styles.modalButtons}>
                                <button type="submit" disabled={saving} style={styles.saveBtn}>
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingCategory(null); }} style={styles.cancelBtn}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Slug</th>
                        <th>Thứ tự</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((cat) => (
                        <tr key={cat._id}>
                            <td>{cat.name}</td>
                            <td><code>{cat.slug}</code></td>
                            <td>{cat.order || 0}</td>
                            <td>
                                <button onClick={() => openEditForm(cat)} style={styles.editBtn}><FiEdit2 /></button>
                                <button onClick={() => handleDelete(cat._id)} style={styles.deleteBtn}><FiTrash2 /></button>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                                Chưa có danh mục nào cho mục "{TYPE_LABELS[activeType]}"
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
    tab: { padding: '8px 18px', background: 'white', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer' },
    tabActive: { background: '#1a3a5c', color: 'white', borderColor: '#1a3a5c' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    editBtn: { background: '#ffc107', color: '#333', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '450px', maxWidth: '90%' },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', marginBottom: '4px', border: '1px solid #ddd', borderRadius: '6px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default CategoriesManager;
