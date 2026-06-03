import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { FiMenu, FiTrash2, FiEdit2, FiPlus, FiGripVertical } from 'react-icons/fi';

const MenuManager = () => {
    const { menu, updateMenu } = useSettings();
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        path: '',
        visible: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        let newMenu = [...menu];
        
        if (editingItem) {
            newMenu = newMenu.map(item => 
                item.id === editingItem.id ? { ...item, ...formData } : item
            );
        } else {
            const newId = Math.max(...menu.map(m => m.id), 0) + 1;
            newMenu.push({
                id: newId,
                ...formData,
                order: newMenu.length + 1
            });
        }
        
        updateMenu(newMenu);
        setShowForm(false);
        setEditingItem(null);
        setFormData({ label: '', path: '', visible: true });
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa mục này?')) {
            const newMenu = menu.filter(item => item.id !== id);
            updateMenu(newMenu);
        }
    };

    const handleToggleVisible = (id) => {
        const newMenu = menu.map(item =>
            item.id === id ? { ...item, visible: !item.visible } : item
        );
        updateMenu(newMenu);
    };

    const moveItem = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newMenu = [...menu];
            [newMenu[index], newMenu[index - 1]] = [newMenu[index - 1], newMenu[index]];
            updateMenu(newMenu);
        } else if (direction === 'down' && index < menu.length - 1) {
            const newMenu = [...menu];
            [newMenu[index], newMenu[index + 1]] = [newMenu[index + 1], newMenu[index]];
            updateMenu(newMenu);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <h2>Quản lý menu</h2>
                <button onClick={() => {
                    setEditingItem(null);
                    setFormData({ label: '', path: '', visible: true });
                    setShowForm(true);
                }} style={styles.addBtn}>
                    <FiPlus /> Thêm mục mới
                </button>
            </div>

            <div style={styles.menuList}>
                {menu.map((item, index) => (
                    <div key={item.id} style={styles.menuItem}>
                        <div style={styles.dragHandle}>
                            <FiGripVertical />
                        </div>
                        <div style={styles.menuContent}>
                            <div style={styles.menuLabel}>
                                <FiMenu />
                                <span style={{ textDecoration: item.visible ? 'none' : 'line-through', opacity: item.visible ? 1 : 0.5 }}>
                                    {item.label}
                                </span>
                                <code style={styles.path}>{item.path}</code>
                            </div>
                            <div style={styles.menuActions}>
                                <button
                                    onClick={() => handleToggleVisible(item.id)}
                                    style={styles.visibleBtn}
                                    title={item.visible ? 'Ẩn' : 'Hiện'}
                                >
                                    {item.visible ? '👁️' : '🙈'}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingItem(item);
                                        setFormData({ label: item.label, path: item.path, visible: item.visible });
                                        setShowForm(true);
                                    }}
                                    style={styles.editBtn}
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    style={styles.deleteBtn}
                                >
                                    <FiTrash2 />
                                </button>
                                <div style={styles.moveBtns}>
                                    <button
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                        style={styles.moveBtn}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === menu.length - 1}
                                        style={styles.moveBtn}
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>{editingItem ? 'Sửa mục menu' : 'Thêm mục menu mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label>Tên hiển thị</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                                    required
                                    style={styles.input}
                                    placeholder="VD: Sản phẩm"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label>Đường dẫn (URL)</label>
                                <input
                                    type="text"
                                    value={formData.path}
                                    onChange={(e) => setFormData({...formData, path: e.target.value})}
                                    required
                                    style={styles.input}
                                    placeholder="VD: /products"
                                />
                                <small style={styles.hint}>Bắt đầu bằng dấu / (ví dụ: /san-pham)</small>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={formData.visible}
                                        onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                                    />
                                    Hiển thị trên menu
                                </label>
                            </div>
                            <div style={styles.modalButtons}>
                                <button type="submit" style={styles.saveBtn}>Lưu</button>
                                <button type="button" onClick={() => {
                                    setShowForm(false);
                                    setEditingItem(null);
                                }} style={styles.cancelBtn}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={styles.note}>
                <p>💡 Mẹo: Kéo thả để sắp xếp thứ tự menu. Menu sẽ tự động cập nhật trên website.</p>
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
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    menuList: {
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        padding: '12px 16px'
    },
    dragHandle: {
        cursor: 'grab',
        color: '#999',
        marginRight: '12px'
    },
    menuContent: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    menuLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    path: {
        background: '#f0f0f0',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
    },
    menuActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    visibleBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '4px 8px'
    },
    editBtn: {
        background: '#ffc107',
        border: 'none',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    deleteBtn: {
        background: '#dc3545',
        border: 'none',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        color: 'white'
    },
    moveBtns: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    moveBtn: {
        background: '#6c757d',
        border: 'none',
        padding: '2px 6px',
        borderRadius: '3px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '10px'
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
    formGroup: {
        marginBottom: '16px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginTop: '6px'
    },
    hint: {
        display: 'block',
        marginTop: '4px',
        fontSize: '12px',
        color: '#999'
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '20px'
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
    },
    note: {
        marginTop: '20px',
        padding: '12px',
        background: '#e8f4fd',
        borderRadius: '6px',
        fontSize: '14px'
    }
};

export default MenuManager;