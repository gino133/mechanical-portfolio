import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        thumbnail: '',
        isFeatured: false
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/products', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchProducts();
            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', code: '', description: '', thumbnail: '', isFeatured: false });
        } catch (error) {
            console.error('Lỗi lưu sản phẩm:', error);
            alert('Có lỗi xảy ra');
        }
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
                <button onClick={() => setShowForm(true)} style={styles.addBtn}>
                    + Thêm sản phẩm
                </button>
            </div>

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Tên sản phẩm"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Mã sản phẩm"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                required
                                style={styles.input}
                            />
                            <textarea
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                                style={styles.textarea}
                            />
                            <input
                                type="text"
                                placeholder="URL ảnh thumbnail"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                style={styles.input}
                            />
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
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
                        <th>Nổi bật</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.code}</td>
                            <td>{product.isFeatured ? '✅' : '❌'}</td>
                            <td>
                                <button onClick={() => {
                                    setEditingProduct(product);
                                    setFormData(product);
                                    setShowForm(true);
                                }} style={styles.editBtn}>Sửa</button>
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
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '16px',
        border: '1px solid #ddd',
        borderRadius: '6px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        minHeight: '100px'
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    },
    saveBtn: {
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    cancelBtn: {
        background: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
    }
};

export default ProductsManager;