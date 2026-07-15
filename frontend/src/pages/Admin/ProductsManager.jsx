import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { categoryAPI } from '../../services/api';

const emptyForm = {
    name: '',
    code: '',
    category: '',
    description: '',
    thumbnail: '',
    imagesText: '',
    isFeatured: false
};

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products', { params: { limit: 200 } });
            setProducts(response.data.data);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getByType('product');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) {
            alert('Vui lòng chọn danh mục cho sản phẩm. Nếu chưa có danh mục nào, vào mục "Danh mục" ở sidebar để tạo trước.');
            return;
        }

        const images = formData.imagesText
            .split('\n')
            .map((url) => url.trim())
            .filter(Boolean);

        if (images.length === 0) {
            alert('Vui lòng nhập ít nhất 1 URL ảnh sản phẩm.');
            return;
        }

        const payload = {
            name: formData.name,
            code: formData.code,
            category: formData.category,
            description: formData.description,
            thumbnail: formData.thumbnail || images[0],
            images,
            isFeatured: formData.isFeatured
        };

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/products', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchProducts();
            setShowForm(false);
            setEditingProduct(null);
            setFormData(emptyForm);
        } catch (error) {
            console.error('Lỗi lưu sản phẩm:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            code: product.code,
            // product.category comes back populated as {_id, name, slug} - the
            // <select> needs just the id string.
            category: product.category?._id || product.category || '',
            description: product.description,
            thumbnail: product.thumbnail,
            imagesText: (product.images || []).join('\n'),
            isFeatured: product.isFeatured
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                await api.delete(`/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
            } catch (error) {
                console.error('Lỗi xóa sản phẩm:', error);
            }
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý sản phẩm</h2>
                <button onClick={() => { setEditingProduct(null); setFormData(emptyForm); setShowForm(true); }} style={styles.addBtn}>
                    + Thêm sản phẩm
                </button>
            </div>

            {categories.length === 0 && (
                <div style={styles.warning}>
                    ⚠️ Chưa có danh mục sản phẩm nào. Vào mục <strong>"Danh mục"</strong> ở sidebar để tạo ít nhất 1 danh mục trước khi thêm sản phẩm.
                </div>
            )}

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Tên sản phẩm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Mã sản phẩm"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                style={styles.input}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                style={styles.textarea}
                            />
                            <textarea
                                placeholder="URL các ảnh sản phẩm - mỗi dòng 1 link (ảnh đầu tiên sẽ là ảnh chính)"
                                value={formData.imagesText}
                                onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                                required
                                style={{ ...styles.textarea, minHeight: '100px' }}
                            />
                            <input
                                type="text"
                                placeholder="URL ảnh thumbnail (để trống sẽ tự dùng ảnh đầu tiên ở trên)"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                style={styles.input}
                            />
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                                Sản phẩm nổi bật
                            </label>
                            <div style={styles.modalButtons}>
                                <button type="submit" style={styles.saveBtn}>Lưu</button>
                                <button type="button" onClick={() => {
                                    setShowForm(false);
                                    setEditingProduct(null);
                                }} style={styles.cancelBtn}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Mã</th>
                        <th>Danh mục</th>
                        <th>Nổi bật</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.code}</td>
                            <td>{product.category?.name || '—'}</td>
                            <td>{product.isFeatured ? '✅' : '❌'}</td>
                            <td>
                                <button onClick={() => openEditForm(product)} style={styles.editBtn}>Sửa</button>
                                <button onClick={() => handleDelete(product._id)} style={styles.deleteBtn}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    addBtn: {
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    warning: {
        background: '#fff3cd',
        color: '#856404',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '16px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        borderRadius: '8px'
    },
    editBtn: {
        background: '#ffc107',
        color: '#333',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '8px'
    },
    deleteBtn: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer'
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
        zIndex: 1000
    },
    modalContent: {
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        width: '500px',
        maxWidth: '90%'
    },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    textarea: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px', minHeight: '80px' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default ProductsManager;
