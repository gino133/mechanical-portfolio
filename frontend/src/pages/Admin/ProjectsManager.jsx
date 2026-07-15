import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { categoryAPI } from '../../services/api';

const emptyForm = {
    name: '',
    client: '',
    category: '',
    year: new Date().getFullYear(),
    description: '',
    thumbnail: '',
    galleryText: '',
    technicalInfo: {},
    isFeatured: false
};

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProjects();
        fetchCategories();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects', { params: { limit: 200 } });
            setProjects(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dự án:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getByType('project');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) {
            alert('Vui lòng chọn danh mục cho dự án. Nếu chưa có danh mục nào, vào mục "Danh mục" ở sidebar để tạo trước.');
            return;
        }

        const gallery = formData.galleryText
            .split('\n')
            .map((url) => url.trim())
            .filter(Boolean);

        const payload = {
            name: formData.name,
            client: formData.client,
            category: formData.category,
            year: formData.year,
            description: formData.description,
            thumbnail: formData.thumbnail || gallery[0] || '',
            gallery,
            technicalInfo: formData.technicalInfo,
            isFeatured: formData.isFeatured
        };

        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/projects', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchProjects();
            setShowForm(false);
            setEditingProject(null);
            setFormData(emptyForm);
        } catch (error) {
            console.error('Lỗi lưu dự án:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const openEditForm = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            client: project.client,
            category: project.category?._id || project.category || '',
            year: project.year,
            description: project.description,
            thumbnail: project.thumbnail,
            galleryText: (project.gallery || []).join('\n'),
            technicalInfo: project.technicalInfo || {},
            isFeatured: project.isFeatured || false
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa dự án này?')) {
            try {
                await api.delete(`/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProjects();
            } catch (error) {
                console.error('Lỗi xóa dự án:', error);
            }
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý dự án</h2>
                <button onClick={() => { setEditingProject(null); setFormData(emptyForm); setShowForm(true); }} style={styles.addBtn}>
                    + Thêm dự án
                </button>
            </div>

            {categories.length === 0 && (
                <div style={styles.warning}>
                    ⚠️ Chưa có danh mục dự án nào. Vào mục <strong>"Danh mục"</strong> ở sidebar để tạo ít nhất 1 danh mục trước khi thêm dự án.
                </div>
            )}

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingProject ? 'Sửa dự án' : 'Thêm dự án mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Tên dự án"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Tên khách hàng"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
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
                            <input
                                type="number"
                                placeholder="Năm thực hiện"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <textarea
                                placeholder="Mô tả dự án"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                style={styles.textarea}
                                rows="4"
                            />
                            <input
                                type="text"
                                placeholder="URL ảnh thumbnail (để trống sẽ tự dùng ảnh đầu tiên trong gallery bên dưới)"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                style={styles.input}
                            />
                            <textarea
                                placeholder="URL ảnh gallery dự án - mỗi dòng 1 link"
                                value={formData.galleryText}
                                onChange={(e) => setFormData({ ...formData, galleryText: e.target.value })}
                                style={{ ...styles.textarea, minHeight: '100px' }}
                            />
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                                Dự án nổi bật
                            </label>
                            <div style={styles.modalButtons}>
                                <button type="submit" style={styles.saveBtn}>Lưu</button>
                                <button type="button" onClick={() => {
                                    setShowForm(false);
                                    setEditingProject(null);
                                }} style={styles.cancelBtn}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Tên dự án</th>
                        <th>Khách hàng</th>
                        <th>Danh mục</th>
                        <th>Năm</th>
                        <th>Nổi bật</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project._id}>
                            <td>{project.name}</td>
                            <td>{project.client}</td>
                            <td>{project.category?.name || '—'}</td>
                            <td>{project.year}</td>
                            <td>{project.isFeatured ? '✅' : '❌'}</td>
                            <td>
                                <button onClick={() => openEditForm(project)} style={styles.editBtn}>Sửa</button>
                                <button onClick={() => handleDelete(project._id)} style={styles.deleteBtn}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    addBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    warning: { background: '#fff3cd', color: '#856404', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    editBtn: { background: '#ffc107', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%' },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    textarea: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default ProjectsManager;
