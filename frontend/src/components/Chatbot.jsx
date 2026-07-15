import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { useSettings } from '../contexts/SettingsContext';

const Chatbot = () => {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Seed the greeting once settings have loaded from the server (falls
    // back to the default greeting if settings are still loading).
    useEffect(() => {
        setMessages([{ type: 'bot', text: settings.chatbotGreeting }]);
    }, [settings.chatbotGreeting]);

    // Simple keyword matching against admin-configured rules. This is a
    // basic canned-reply bot, not a real AI model - each rule is a set of
    // comma-separated keywords mapped to one reply, editable from
    // Admin > Cài đặt > Trợ lý AI.
    const getAutoReply = (userMessage) => {
        const msg = userMessage.toLowerCase();
        const rules = settings.chatbotRules || [];

        for (const rule of rules) {
            const keywords = (rule.keywords || '').split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
            if (keywords.some(k => k && msg.includes(k))) {
                return rule.reply;
            }
        }

        return settings.chatbotFallback;
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = { type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const reply = getAutoReply(inputValue);
            setMessages(prev => [...prev, { type: 'bot', text: reply }]);
            setIsTyping(false);
        }, 800);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Admin can turn the widget off entirely from Cài đặt > Trợ lý AI
    if (!settings.chatbotEnabled) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    ...styles.chatButton,
                    transform: isOpen ? 'scale(0)' : 'scale(1)'
                }}
            >
                <FiMessageSquare size={28} />
            </button>

            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.chatHeader}>
                        <div style={styles.chatHeaderInfo}>
                            <div style={styles.chatAvatar}>🤖</div>
                            <div>
                                <div style={styles.chatTitle}>{settings.chatbotName}</div>
                                <div style={styles.chatStatus}>Online</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
                            <FiX size={20} />
                        </button>
                    </div>

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
        maxWidth: '92vw',
        height: '500px',
        maxHeight: '75vh',
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
        wordWrap: 'break-word',
        whiteSpace: 'pre-line'
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
