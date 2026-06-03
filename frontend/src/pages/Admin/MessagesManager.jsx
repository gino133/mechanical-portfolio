import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiMail, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/contact/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.data);
        } catch (error) {
            console.error('Lỗi tải tin nhắn:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/contact/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
        } catch (error) {
            console.error('Lỗi đánh dấu đã đọc:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa tin nhắn này?')) {
            try {
                await api.delete(`/contact/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchMessages();
                if (selectedMessage?._id === id) setSelectedMessage(null);
            } catch (error) {
                console.error('Lỗi xóa tin nhắn:', error);
            }
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Tin nhắn liên hệ</h2>
            
            <div style={styles.grid}>
                {/* List of messages */}
                <div style={styles.list}>
                    {messages.length === 0 ? (
                        <div style={styles.empty}>Chưa có tin nhắn nào</div>
                    ) : (
                        messages.map(msg => (
                            <div
                                key={msg._id}
                                onClick={() => setSelectedMessage(msg)}
                                style={{
                                    ...styles.messageItem,
                                    ...(!msg.isRead && styles.unread)
                                }}
                            >
                                <div style={styles.messageHeader}>
                                    <strong>{msg.name}</strong>
                                    <span style={styles.messageDate}>
                                        {new Date(msg.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div style={styles.messageInfo}>
                                    {msg.email} • {msg.phone || 'Không có SĐT'}
                                </div>
                                <div style={styles.messagePreview}>
                                    {msg.message.substring(0, 80)}...
                                </div>
                                {!msg.isRead && <span style={styles.unreadBadge}>Mới</span>}
                            </div>
                        ))
                    )}
                </div>

                {/* Detail view */}
                <div style={styles.detail}>
                    {selectedMessage ? (
                        <div>
                            <h3>Chi tiết tin nhắn</h3>
                            <div style={styles.detailField}>
                                <label>Họ tên:</label>
                                <p>{selectedMessage.name}</p>
                            </div>
                            <div style={styles.detailField}>
                                <label>Email:</label>
                                <p>{selectedMessage.email}</p>
                            </div>
                            <div style={styles.detailField}>
                                <label>Điện thoại:</label>
                                <p>{selectedMessage.phone || 'Không cung cấp'}</p>
                            </div>
                            <div style={styles.detailField}>
                                <label>Công ty:</label>
                                <p>{selectedMessage.company || 'Không cung cấp'}</p>
                            </div>
                            <div style={styles.detailField}>
                                <label>Nội dung:</label>
                                <p style={styles.messageFull}>{selectedMessage.message}</p>
                            </div>
                            <div style={styles.detailActions}>
                                {!selectedMessage.isRead && (
                                    <button onClick={() => markAsRead(selectedMessage._id)} style={styles.readBtn}>
                                        <FiCheckCircle /> Đánh dấu đã đọc
                                    </button>
                                )}
                                <button onClick={() => handleDelete(selectedMessage._id)} style={styles.deleteBtn}>
                                    <FiTrash2 /> Xóa tin nhắn
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.emptyDetail}>Chọn một tin nhắn để xem chi tiết</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px' },
    title: { marginBottom: '20px', fontSize: '24px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' },
    list: { background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    messageItem: { padding: '16px', borderBottom: '1px solid #e0e0e0', cursor: 'pointer', transition: 'background 0.2s', position: 'relative' },
    unread: { background: '#e8f4fd' },
    messageHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    messageDate: { fontSize: '12px', color: '#999' },
    messageInfo: { fontSize: '13px', color: '#666', marginBottom: '8px' },
    messagePreview: { fontSize: '14px', color: '#333' },
    unreadBadge: { position: 'absolute', top: '16px', right: '16px', background: '#dc3545', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '10px' },
    detail: { background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    detailField: { marginBottom: '16px' },
    detailField: { marginBottom: '16px' },
    messageFull: { background: '#f5f7fa', padding: '12px', borderRadius: '6px', marginTop: '8px', lineHeight: '1.6' },
    detailActions: { display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' },
    readBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    empty: { textAlign: 'center', padding: '40px', color: '#999' },
    emptyDetail: { textAlign: 'center', padding: '40px', color: '#999' }
};

export default MessagesManager;