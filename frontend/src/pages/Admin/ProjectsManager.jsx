import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { categoryAPI } from '../../services/api';
import MultiImageField from '../../components/common/MultiImageField';
import DocumentField from '../../components/common/DocumentField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const emptyForm = {
    name: '',
    client: '',
    category: '',
    year: new Date().getFullYear(),
    description: '',
    gallery: [],
    documents: [],
    techInfoList: [], // [{ key, value }] - converted to/from technicalInfo object
    isFeatured: false
};

const infoObjectToList = (info) => {
    if (!info || typeof info !== 'object') return [];
    return Object.entries(info).map(([key, value]) => ({ key, value: String(value) }));
};

const infoListToObject = (list) => {
    const obj = {};
    list.forEach(({ key, value }) => {
        if (key.trim()) obj[key.trim()] = value;
    });
    return obj;
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

    const handleInfoChange = (index, field, value) => {
        const newList = [...formData.techInfoList];
        newList[index] = { ...newList[index], [field]: value };
        setFormData({ ...formData, techInfoList: newList });
    };

    const addInfo = () => {
        setFormData({ ...formData, techInfoList: [...formData.techInfoList, { key: '', value: '' }] });
    };

    const removeInfo = (index) => {
        setFormData({ ...formData, techInfoList: formData.techInfoList.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) {
            alert('Vui lòng chọn danh mục cho dự án. Nếu chưa có danh mục nào, vào mục "Danh mục" ở sidebar để tạo trước.');
            return;
        }

        if (formData.gallery.length === 0) {
            alert('Vui lòng thêm ít nhất 1 ảnh cho dự án.');
            return;
        }

        const payload = {
            name: formData.name,
            client: formData.client,
            category: formData.category,
            year: formData.year,
            description: formData.description,
            thumbnail: formData.gallery[0],
            gallery: formData.gallery,
            documents: formData.documents.map((d) => d._id),
            technicalInfo: infoListToObject(formData.techInfoList),
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

    const openEditForm = async (project) => {
        try {
            // The list endpoint doesn't populate "documents" - fetch the
            // full project (which does) so DocumentField shows real names.
            const response = await api.get(`/projects/${project._id}`);
            const full = response.data.data;
            setEditingProject(full);
            setFormData({
                name: full.name,
                client: full.client,
                category: full.category?._id || full.category || '',
                year: full.year,
                description: full.description,
                gallery: full.gallery || [],
                documents: full.documents || [],
                techInfoList: infoObjectToList(full.technicalInfo),
                isFeatured: full.isFeatured || false
            });
            setShowForm(true);
        } catch (error) {
            console.error('Lỗi tải dự án:', error);
        }
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

                            <label style={styles.label}>Mô tả dự án</label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(description) => setFormData({ ...formData, description })}
                                placeholder="Mô tả chi tiết dự án..."
                                minHeight="160px"
                            />

                            <label style={{ ...styles.label, marginTop: '20px' }}>Thông số kỹ thuật</label>
                            {formData.techInfoList.map((info, index) => (
                                <div key={index} style={styles.specRow}>
                                    <input
                                        type="text"
                                        placeholder="Tên thông số (VD: Sức nâng)"
                                        value={info.key}
                                        onChange={(e) => handleInfoChange(index, 'key', e.target.value)}
                                        style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Giá trị (VD: 10 tấn)"
                                        value={info.value}
                                        onChange={(e) => handleInfoChange(index, 'value', e.target.value)}
                                        style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                                    />
                                    <button type="button" onClick={() => removeInfo(index)} style={styles.iconBtn}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addInfo} style={styles.addSpecBtn}>
                                <FiPlus /> Thêm thông số
                            </button>

                            <div style={{ marginTop: '20px' }}>
                                <MultiImageField
                                    label="Hình ảnh dự án (ảnh đầu tiên dùng làm thumbnail)"
                                    value={formData.gallery}
                                    onChange={(gallery) => setFormData({ ...formData, gallery })}
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

            <div className="admin-table-wrap">
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
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '30px 20px', overflowY: 'auto' },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '600px', maxWidth: '100%' },
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

export default ProjectsManager;
