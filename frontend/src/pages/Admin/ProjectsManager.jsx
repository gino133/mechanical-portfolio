import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        year: new Date().getFullYear(),
        description: '',
        thumbnail: '',
        gallery: [],
        technicalInfo: {}
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dự án:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/projects', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchProjects();
            setShowForm(false);
            setEditingProject(null);
            setFormData({ name: '', client: '', year: new Date().getFullYear(), description: '', thumbnail: '', gallery: [], technicalInfo: {} });
        } catch (error) {
            console.error('Lỗi lưu dự án:', error);
            alert('Có lỗi xảy ra');
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
                <button onClick={() => setShowForm(true)} style={styles.addBtn}>
                    + Thêm dự án
                </button>
            </div>

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingProject ? 'Sửa dự án' : 'Thêm dự án mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Tên dự án"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Tên khách hàng"
                                value={formData.client}
                                onChange={(e) => setFormData({...formData, client: e.target.value})}
                                required
                                style={styles.input}
                            />
                            <input
                                type="number"
                                placeholder="Năm thực hiện"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                                required
                                style={styles.input}
                            />
                            <textarea
                                placeholder="Mô tả dự án"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                                style={styles.textarea}
                                rows="4"
                            />
                            <input
                                type="text"
                                placeholder="URL ảnh thumbnail"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                style={styles.input}
                            />
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
                        <th>Năm</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project._id}>
                            <td>{project.name}</td>
                            <td>{project.client}</td>
                            <td>{project.year}</td>
                            <td>
                                <button onClick={() => {
                                    setEditingProject(project);
                                    setFormData(project);
                                    setShowForm(true);
                                }} style={styles.editBtn}>Sửa</button>
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
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' },
    editBtn: { background: '#ffc107', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%' },
    input: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    textarea: { width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default ProjectsManager;