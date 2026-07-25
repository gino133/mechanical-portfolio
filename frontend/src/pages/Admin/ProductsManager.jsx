import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { categoryAPI } from '../../services/api';
import ImageField from '../../components/common/ImageField';
import MultiImageField from '../../components/common/MultiImageField';
import DocumentField from '../../components/common/DocumentField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const emptyForm = {
    name: '',
    code: '',
    category: '',
    description: '',
    images: [],
    documents: [],
    specsList: [], // [{ key, value }] - converted to/from the specifications object
    isFeatured: false
};

const specsObjectToList = (specs) => {
    if (!specs || typeof specs !== 'object') return [];
    return Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
};

const specsListToObject = (list) => {
    const obj = {};
    list.forEach(({ key, value }) => {
        if (key.trim()) obj[key.trim()] = value;
    });
    return obj;
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

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...formData.specsList];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setFormData({ ...formData, specsList: newSpecs });
    };

    const addSpec = () => {
        setFormData({ ...formData, specsList: [...formData.specsList, { key: '', value: '' }] });
    };

    const removeSpec = (index) => {
        setFormData({ ...formData, specsList: formData.specsList.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) {
            alert('Vui lòng chọn danh mục cho sản phẩm. Nếu chưa có danh mục nào, vào mục "Danh mục" ở sidebar để tạo trước.');
            return;
        }

        if (formData.images.length === 0) {
            alert('Vui lòng thêm ít nhất 1 ảnh sản phẩm.');
            return;
        }

        const payload = {
            name: formData.name,
            code: formData.code,
            category: formData.category,
            description: formData.description,
            thumbnail: formData.images[0],
            images: formData.images,
            documents: formData.documents.map((d) => d._id),
            specifications: specsListToObject(formData.specsList),
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

    const openEditForm = async (product) => {
        try {
            // The list endpoint doesn't populate "documents" - fetch the
            // full product (which does) so DocumentField shows real names.
            const response = await api.get(`/products/${product._id}`);
            const full = response.data.data;
            setEditingProduct(full);
            setFormData({
                name: full.name,
                code: full.code,
                // full.category comes back populated as {_id, name, slug} -
                // the <select> needs just the id string.
                category: full.category?._id || full.category || '',
                description: full.description,
                images: full.images || [],
                documents: full.documents || [],
                specsList: specsObjectToList(full.specifications),
                isFeatured: full.isFeatured
            });
            setShowForm(true);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
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

                            <label style={styles.label}>Mô tả sản phẩm</label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(description) => setFormData({ ...formData, description })}
                                placeholder="Mô tả chi tiết sản phẩm..."
                                minHeight="160px"
                            />

                            <label style={{ ...styles.label, marginTop: '20px' }}>Thông số kỹ thuật</label>
                            {formData.specsList.map((spec, index) => (
                                <div key={index} style={styles.specRow}>
                                    <input
                                        type="text"
                                        placeholder="Tên thông số (VD: Vật liệu)"
                                        value={spec.key}
                                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                        style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Giá trị (VD: Thép U160 mạ kẽm)"
                                        value={spec.value}
                                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                        style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                                    />
                                    <button type="button" onClick={() => removeSpec(index)} style={styles.iconBtn}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addSpec} style={styles.addSpecBtn}>
                                <FiPlus /> Thêm thông số
                            </button>

                            <div style={{ marginTop: '20px' }}>
                                <MultiImageField
                                    label="Hình ảnh sản phẩm"
                                    value={formData.images}
                                    onChange={(images) => setFormData({ ...formData, images })}
                                />
                            </div>
                            <DocumentField
                                label="Tài liệu đính kèm (bản vẽ, thuyết minh...)"
                                value={formData.documents}
                                onChange={(documents) => setFormData({ ...formData, documents })}
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

            <div className="admin-table-wrap">
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '30px 20px',
        overflowY: 'auto'
    },
    modalContent: {
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        width: '600px',
        maxWidth: '100%'
    },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    specRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
    iconBtn: { background: '#fee', color: '#c00', border: 'none', borderRadius: '6px', padding: '10px', cursor: 'pointer' },
    addSpecBtn: {
        display: 'flex', alignItems: 'center', gap: '6px', background: '#eef4fb',
        color: '#1a3a5c', border: 'none', borderRadius: '6px', padding: '8px 14px',
        cursor: 'pointer', fontSize: '13px', marginBottom: '8px'
    },
    checkbox: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', marginTop: '16px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default ProductsManager;
