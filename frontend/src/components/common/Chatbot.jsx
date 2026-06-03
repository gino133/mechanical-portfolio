import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Xin chào! Tôi là trợ lý AI của kỹ sư Nguyễn Văn A. Tôi có thể giúp gì cho bạn hôm nay?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Auto-reply logic (simulate AI - for demo)
    // In production, replace with actual OpenAI API call
    const getAutoReply = (userMessage) => {
        const msg = userMessage.toLowerCase();
        
        if (msg.includes('giá') || msg.includes('báo giá')) {
            return "Cảm ơn bạn quan tâm! Vui lòng để lại thông tin liên hệ hoặc gửi email trực tiếp đến nguyenvana@email.com để nhận báo giá chi tiết nhé!";
        }
        if (msg.includes('cơ khí') || msg.includes('gia công')) {
            return "Chúng tôi chuyên thiết kế và gia công cơ khí chính xác: băng tải, máy ép thủy lực, cầu trục, kết cấu thép... Bạn quan tâm đến sản phẩm nào cụ thể không?";
        }
        if (msg.includes('điện') || msg.includes('plc') || msg.includes('tủ điện')) {
            return "Dịch vụ điện của chúng tôi bao gồm: thiết kế tủ điện công nghiệp, lập trình PLC, HMI, Scada. Bạn cần tư vấn về hệ thống nào?";
        }
        if (msg.includes('tài liệu') || msg.includes('bản vẽ')) {
            return "Bạn có thể tải tài liệu kỹ thuật, bản vẽ CAD, SolidWorks tại trang Tài liệu trên website. Nếu cần tài liệu cụ thể, hãy cho tôi biết nhé!";
        }
        if (msg.includes('liên hệ') || msg.includes('email') || msg.includes('số điện thoại')) {
            return "📧 Email: nguyenvana@email.com\n📞 Điện thoại: 0123 456 789\n🏢 Địa chỉ: Hà Nội, Việt Nam";
        }
        
        return "Cảm ơn bạn đã quan tâm! Bạn có thể xem thêm thông tin chi tiết tại các trang Sản phẩm, Dự án, hoặc để lại thông tin liên hệ để tôi gọi lại tư vấn trực tiếp nhé!";
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = { type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const reply = getAutoReply(inputValue);
            setMessages(prev => [...prev, { type: 'bot', text: reply }]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    ...styles.chatButton,
                    transform: isOpen ? 'scale(0)' : 'scale(1)'
                }}
            >
                <FiMessageSquare size={28} />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={styles.chatWindow}>
                    {/* Header */}
                    <div style={styles.chatHeader}>
                        <div style={styles.chatHeaderInfo}>
                            <div style={styles.chatAvatar}>🤖</div>
                            <div>
                                <div style={styles.chatTitle}>Trợ lý AI</div>
                                <div style={styles.chatStatus}>Online</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={styles.chatMessages}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.message,
                                    ...(msg.type === 'user' ? styles.userMessage : styles.botMessage)
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={styles.typingIndicator}>
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div style={styles.chatInput}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            style={styles.input}
                        />
                        <button onClick={handleSendMessage} style={styles.sendBtn}>
                            <FiSend size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    chatButton: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'transform 0.2s',
        zIndex: 999
    },
    chatWindow: {
        position: 'fixed',
        bottom: '96px',
        right: '24px',
        width: '360px',
        height: '500px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 999,
        fontFamily: 'inherit'
    },
    chatHeader: {
        background: 'var(--primary-color)',
        color: 'white',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    chatHeaderInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    chatAvatar: {
        width: '40px',
        height: '40px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
    },
    chatTitle: {
        fontWeight: 'bold',
        fontSize: '16px'
    },
    chatStatus: {
        fontSize: '12px',
        opacity: 0.8
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '4px'
    },
    chatMessages: {
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#f5f7fa'
    },
    message: {
        maxWidth: '80%',
        padding: '10px 14px',
        borderRadius: '16px',
        fontSize: '14px',
        lineHeight: '1.4',
        wordWrap: 'break-word'
    },
    userMessage: {
        background: 'var(--primary-color)',
        color: 'white',
        alignSelf: 'flex-end',
        borderBottomRightRadius: '4px'
    },
    botMessage: {
        background: 'white',
        color: '#333',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    typingIndicator: {
        background: 'white',
        padding: '10px 14px',
        borderRadius: '16px',
        alignSelf: 'flex-start',
        fontSize: '14px',
        display: 'flex',
        gap: '4px'
    },
    chatInput: {
        display: 'flex',
        padding: '12px',
        borderTop: '1px solid #e0e0e0',
        background: 'white'
    },
    input: {
        flex: 1,
        padding: '10px 12px',
        border: '1px solid #e0e0e0',
        borderRadius: '24px',
        fontSize: '14px',
        outline: 'none'
    },
    sendBtn: {
        background: 'var(--primary-color)',
        border: 'none',
        color: 'white',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '8px',
        cursor: 'pointer'
    }
};

export default Chatbot;