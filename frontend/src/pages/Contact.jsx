import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here will call API later
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const contactInfo = [
        { icon: <FiMapPin />, title: 'Địa chỉ', content: 'Hà Nội, Việt Nam' },
        { icon: <FiPhone />, title: 'Điện thoại', content: '0123 456 789' },
        { icon: <FiMail />, title: 'Email', content: 'nguyenvana@email.com' },
        { icon: <FiClock />, title: 'Thời gian làm việc', content: 'Thứ 2 - Thứ 7: 8:00 - 17:30' }
    ];

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <h1 style={styles.title}>Liên hệ</h1>
                    <p style={styles.subtitle}>Hãy liên hệ với tôi để được tư vấn và hỗ trợ</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.grid}>
                        <div>
                            <h2>Thông tin liên hệ</h2>
                            <div style={styles.infoList}>
                                {contactInfo.map((item, index) => (
                                    <div key={index} style={styles.infoItem}>
                                        <div style={styles.infoIcon}>{item.icon}</div>
                                        <div>
                                            <h3 style={styles.infoTitle}>{item.title}</h3>
                                            <p>{item.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.mapPlaceholder}>
                                <div style={styles.mapBox}>
                                    <p>📍 Bản đồ Google Maps sẽ hiển thị tại đây</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2>Gửi tin nhắn</h2>
                            {submitted && (
                                <div style={styles.successMsg}>
                                    ✓ Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất.
                                </div>
                            )}
                            <form onSubmit={handleSubmit} style={styles.form}>
                                <div style={styles.formGroup}>
                                    <label>Họ tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label>Công ty</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label>Nội dung *</label>
                                    <textarea
                                        name="message"
                                        rows="5"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        style={styles.textarea}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" style={styles.btn}>
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '60px 0',
        textAlign: 'center'
    },
    title: {
        fontSize: '36px',
        marginBottom: '16px'
    },
    subtitle: {
        fontSize: '18px',
        opacity: 0.9
    },
    section: {
        padding: '60px 0'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px'
    },
    infoList: {
        marginTop: '24px'
    },
    infoItem: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px'
    },
    infoIcon: {
        fontSize: '24px',
        color: 'var(--primary-color)'
    },
    infoTitle: {
        fontSize: '16px',
        marginBottom: '4px'
    },
    mapPlaceholder: {
        marginTop: '32px'
    },
    mapBox: {
        background: '#f0f0f0',
        height: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px'
    },
    form: {
        marginTop: '24px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        fontSize: '16px',
        marginTop: '4px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        fontSize: '16px',
        fontFamily: 'inherit',
        marginTop: '4px'
    },
    btn: {
        width: '100%'
    },
    successMsg: {
        background: '#d4edda',
        color: '#155724',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px'
    }
};

export default Contact;