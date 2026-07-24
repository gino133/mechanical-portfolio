import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/api';
import ImageField from '../../components/common/ImageField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const emptyForm = {
    title: '',
    icon: '',
    shortDescription: '',
    content: '',
    coverImage: '',
    order: 0,
    isActive: true
};

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await serviceAPI.getAllAdmin();
            setServices(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dịch vụ:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingService) {
                await serviceAPI.update(editingService._id, formData);
            } else {
                await serviceAPI.create(formData);
            }
            fetchServices();
            setShowForm(false);
            setEditingService(null);
            setFormData(emptyForm);
        } catch (error) {
            console.error('Lỗi lưu dịch vụ:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const openEditForm = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            icon: service.icon || '',
            shortDescription: service.shortDescription || '',
            content: service.content || '',
            coverImage: service.coverImage || '',
            order: service.order || 0,
            isActive: service.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
            try {
                await serviceAPI.delete(id);
                fetchServices();
            } catch (error) {
                console.error('Lỗi xóa dịch vụ:', error);
            }
        }
    };

    const toggleActive = async (service) => {
        try {
            await serviceAPI.update(service._id, { isActive: !service.isActive });
            fetchServices();
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý Dịch vụ (thẻ ở trang chủ)</h2>
                <button onClick={() => { setEditingService(null); setFormData(emptyForm); setShowForm(true); }} style={styles.addBtn}>
                    + Thêm dịch vụ
                </button>
            </div>
            <p style={styles.hint}>
                Đây là các thẻ hiển thị ở mục "Giới thiệu" trên trang chủ (VD: "Cơ khí chính xác", "Điện & Tự động hóa"). Mỗi thẻ bấm vào sẽ dẫn tới 1 trang riêng chứa nội dung chi tiết dịch vụ đó.
            </p>

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Tên dịch vụ (VD: Cơ khí chính xác)"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={styles.input}
                            />

                            <ImageField
                                label="Icon / ảnh minh hoạ cho thẻ ở trang chủ"
                                value={formData.icon}
                                onChange={(url) => setFormData({ ...formData, icon: url })}
                            />

                            <textarea
                                placeholder="Mô tả ngắn (hiện ngay trên thẻ ở trang chủ)"
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                required
                                style={{ ...styles.textarea, minHeight: '60px' }}
                            />

                            <ImageField
                                label="Ảnh bìa trang chi tiết (tuỳ chọn)"
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                            />

                            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' }}>
                                Nội dung chi tiết (hiện ở trang riêng khi bấm vào thẻ)
                            </label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Mô tả chi tiết dịch vụ này..."
                            />

                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '13px', color: '#555' }}>Thứ tự hiển thị</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                Hiển thị trên trang chủ
                            </label>

                            <div style={styles.modalButtons}>
                                <button type="submit" disabled={saving} style={styles.saveBtn}>
                                    {saving ? 'Đang lưu...' : 'Lưu dịch vụ'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingService(null); }} style={styles.cancelBtn}>
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
                        <th>Tên dịch vụ</th>
                        <th>Mô tả ngắn</th>
                        <th>Thứ tự</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map(service => (
                        <tr key={service._id}>
                            <td>{service.title}</td>
                            <td>{service.shortDescription}</td>
                            <td>{service.order}</td>
                            <td>{service.isActive ? '🟢 Đang hiện' : '⚪ Đã ẩn'}</td>
                            <td>
                                <button onClick={() => toggleActive(service)} style={styles.toggleBtn} title={service.isActive ? 'Ẩn khỏi trang chủ' : 'Hiện lên trang chủ'}>
                                    {service.isActive ? <FiEyeOff /> : <FiEye />}
                                </button>
                                <button onClick={() => openEditForm(service)} style={styles.editBtn}>Sửa</button>
                                <button onClick={() => handleDelete(service._id)} style={styles.deleteBtn}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {services.length === 0 && (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>Chưa có dịch vụ nào</td></tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    hint: { fontSize: '13px', color: '#777', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    editBtn: { background: '#ffc107', color: '#333', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    toggleBtn: { background: '#e9ecef', color: '#333', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '30px 20px', overflowY: 'auto' },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '700px', maxWidth: '100%' },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    textarea: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', marginBottom: '16px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default ServicesManager;
