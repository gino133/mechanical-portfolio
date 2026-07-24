import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { settingsAPI } from '../../services/api';
import { FiMail, FiTrash2, FiCheckCircle, FiCpu } from 'react-icons/fi';

// Small built-in stopword list so keyword suggestions aren't cluttered with
// common filler words. Not exhaustive - admin can always edit the result.
const STOPWORDS = new Set([
    'là', 'và', 'của', 'có', 'cho', 'tôi', 'bạn', 'mình', 'em', 'anh', 'chị',
    'với', 'được', 'không', 'này', 'đó', 'các', 'những', 'một', 'khi', 'thì',
    'để', 'như', 'sẽ', 'đã', 'ạ', 'nhé', 'vậy', 'rất', 'cũng', 'còn', 'nên',
    'xin', 'chào', 'giúp', 'muốn', 'cần', 'hỏi', 'về', 'gì', 'ơi', 'shop'
]);

const suggestKeywords = (message) => {
    const words = message
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOPWORDS.has(w));
    const unique = [...new Set(words)].slice(0, 5);
    return unique.join(', ');
};

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [chatbotRules, setChatbotRules] = useState([]);
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [saveKeywords, setSaveKeywords] = useState('');
    const [saving, setSaving] = useState(false);
    const [savedNotice, setSavedNotice] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMessages();
        fetchChatbotRules();
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

    const fetchChatbotRules = async () => {
        try {
            const response = await settingsAPI.get();
            setChatbotRules(response.data.data.chatbotRules || []);
        } catch (error) {
            console.error('Lỗi tải kịch bản trợ lý AI:', error);
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

    const selectMessage = (msg) => {
        setSelectedMessage(msg);
        setReplyText('');
        setShowSaveForm(false);
        setSavedNotice('');
    };

    const openSaveForm = () => {
        setSaveKeywords(suggestKeywords(selectedMessage.message));
        setShowSaveForm(true);
    };

    const handleSaveToChatbot = async () => {
        if (!saveKeywords.trim() || !replyText.trim()) {
            alert('Vui lòng nhập cả từ khóa và nội dung trả lời.');
            return;
        }
        setSaving(true);
        try {
            const newRules = [...chatbotRules, { keywords: saveKeywords.trim(), reply: replyText.trim() }];
            await settingsAPI.update({ chatbotRules: newRules });
            setChatbotRules(newRules);
            setShowSaveForm(false);
            setSavedNotice('✓ Đã lưu vào Trợ lý AI - lần sau khách hỏi câu tương tự, bot sẽ tự trả lời.');
        } catch (error) {
            console.error('Lỗi lưu kịch bản:', error);
            alert('Lưu thất bại, thử lại sau.');
        } finally {
            setSaving(false);
        }
    };

    const mailtoLink = selectedMessage
        ? `mailto:${selectedMessage.email}?subject=${encodeURIComponent('Re: Liên hệ từ website')}&body=${encodeURIComponent(replyText)}`
        : '#';

    if (loading) return <div>Đang tải...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Tin nhắn liên hệ</h2>

            <div className="admin-messages-grid">
                <div style={styles.list}>
                    {messages.length === 0 ? (
                        <div style={styles.empty}>Chưa có tin nhắn nào</div>
                    ) : (
                        messages.map(msg => (
                            <div
                                key={msg._id}
                                onClick={() => selectMessage(msg)}
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

                            <div style={styles.detailField}>
                                <label>Câu trả lời của bạn:</label>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Nhập câu trả lời bạn sẽ gửi cho khách..."
                                    style={styles.replyBox}
                                    rows="4"
                                />
                            </div>

                            {savedNotice && <div style={styles.savedNotice}>{savedNotice}</div>}

                            {showSaveForm && (
                                <div style={styles.saveForm}>
                                    <label style={styles.saveLabel}>Từ khóa nhận diện (sửa lại nếu cần, cách nhau bằng dấu phẩy):</label>
                                    <input
                                        type="text"
                                        value={saveKeywords}
                                        onChange={(e) => setSaveKeywords(e.target.value)}
                                        style={styles.input}
                                    />
                                    <p style={styles.saveHint}>
                                        Sau khi lưu, mỗi khi khách nhắn tin cho Trợ lý AI có chứa 1 trong các từ khóa này, bot sẽ tự trả lời đúng nội dung bạn vừa nhập ở trên.
                                    </p>
                                    <div style={styles.saveFormActions}>
                                        <button onClick={handleSaveToChatbot} disabled={saving} style={styles.confirmSaveBtn}>
                                            {saving ? 'Đang lưu...' : 'Xác nhận lưu'}
                                        </button>
                                        <button onClick={() => setShowSaveForm(false)} style={styles.cancelBtn}>Hủy</button>
                                    </div>
                                </div>
                            )}

                            <div style={styles.detailActions}>
                                {!selectedMessage.isRead && (
                                    <button onClick={() => markAsRead(selectedMessage._id)} style={styles.readBtn}>
                                        <FiCheckCircle /> Đánh dấu đã đọc
                                    </button>
                                )}
                                <a href={mailtoLink} style={styles.emailBtn}>
                                    <FiMail /> Gửi email trả lời
                                </a>
                                <button
                                    onClick={openSaveForm}
                                    disabled={!replyText.trim()}
                                    style={{ ...styles.aiBtn, opacity: replyText.trim() ? 1 : 0.5 }}
                                    title={!replyText.trim() ? 'Nhập câu trả lời trước' : ''}
                                >
                                    <FiCpu /> Lưu vào Trợ lý AI
                                </button>
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
    messageFull: { background: '#f5f7fa', padding: '12px', borderRadius: '6px', marginTop: '8px', lineHeight: '1.6' },
    replyBox: { width: '100%', padding: '10px', marginTop: '8px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' },
    savedNotice: { background: '#d4edda', color: '#155724', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
    saveForm: { background: '#f0f7ff', border: '1px solid #cfe3fb', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
    saveLabel: { fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' },
    saveHint: { fontSize: '12px', color: '#666', marginTop: '8px' },
    saveFormActions: { display: 'flex', gap: '10px', marginTop: '12px' },
    input: { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    confirmSaveBtn: { background: '#1a3a5c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    cancelBtn: { background: '#e0e0e0', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    detailActions: { display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0', flexWrap: 'wrap' },
    readBtn: { background: '#28a745', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    emailBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
    aiBtn: { background: '#6f42c1', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    empty: { textAlign: 'center', padding: '40px', color: '#999' },
    emptyDetail: { textAlign: 'center', padding: '40px', color: '#999' }
};

export default MessagesManager;
