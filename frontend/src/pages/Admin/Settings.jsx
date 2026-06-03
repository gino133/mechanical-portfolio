import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const Settings = () => {
    const { settings, updateSettings } = useSettings();
    const [activeTab, setActiveTab] = useState('general');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        updateSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const tabs = [
        { id: 'general', label: 'Tổng quan' },
        { id: 'colors', label: 'Màu sắc & Font' },
        { id: 'hero', label: 'Trang chủ' },
        { id: 'contact', label: 'Thông tin liên hệ' },
        { id: 'seo', label: 'SEO' }
    ];

    return (
        <div>
            <h2 style={styles.pageTitle}>Cài đặt giao diện</h2>

            {/* Tabs */}
            <div style={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === tab.id ? styles.tabActive : {})
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab General */}
            {activeTab === 'general' && (
                <div style={styles.tabContent}>
                    <h3>Cài đặt chung</h3>
                    
                    <div style={styles.formGroup}>
                        <label>Logo text</label>
                        <input
                            type="text"
                            name="logoText"
                            value={settings.logoText}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Logo URL (ảnh)</label>
                        <input
                            type="text"
                            name="logoImage"
                            value={settings.logoImage}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://..."
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Font chữ chính</label>
                        <select name="fontFamily" value={settings.fontFamily} onChange={handleChange} style={styles.select}>
                            <option value="Segoe UI, Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                            <option value="Arial, Helvetica, sans-serif">Arial</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                            <option value="Open Sans, sans-serif">Open Sans</option>
                            <option value="Times New Roman, serif">Times New Roman</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label>Cỡ chữ cơ bản</label>
                        <select name="fontSize" value={settings.fontSize} onChange={handleChange} style={styles.select}>
                            <option value="14px">Nhỏ (14px)</option>
                            <option value="16px">Trung bình (16px)</option>
                            <option value="18px">Lớn (18px)</option>
                            <option value="20px">Rất lớn (20px)</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label>Độ rộng container (px)</label>
                        <input
                            type="text"
                            name="containerWidth"
                            value={settings.containerWidth}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Độ bo góc (px)</label>
                        <input
                            type="text"
                            name="borderRadius"
                            value={settings.borderRadius}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                </div>
            )}

            {/* Tab Colors & Font */}
            {activeTab === 'colors' && (
                <div style={styles.tabContent}>
                    <h3>Màu sắc chủ đạo</h3>

                    <div style={styles.colorGrid}>
                        <div style={styles.formGroup}>
                            <label>Màu chính</label>
                            <input
                                type="color"
                                name="primaryColor"
                                value={settings.primaryColor}
                                onChange={handleChange}
                                style={styles.colorPicker}
                            />
                            <code style={styles.colorCode}>{settings.primaryColor}</code>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Màu phụ</label>
                            <input
                                type="color"
                                name="secondaryColor"
                                value={settings.secondaryColor}
                                onChange={handleChange}
                                style={styles.colorPicker}
                            />
                            <code style={styles.colorCode}>{settings.secondaryColor}</code>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Màu nhấn</label>
                            <input
                                type="color"
                                name="accentColor"
                                value={settings.accentColor}
                                onChange={handleChange}
                                style={styles.colorPicker}
                            />
                            <code style={styles.colorCode}>{settings.accentColor}</code>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Màu chữ chính</label>
                            <input
                                type="color"
                                name="textColor"
                                value={settings.textColor}
                                onChange={handleChange}
                                style={styles.colorPicker}
                            />
                            <code style={styles.colorCode}>{settings.textColor}</code>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Màu chữ phụ</label>
                            <input
                                type="color"
                                name="textLight"
                                value={settings.textLight}
                                onChange={handleChange}
                                style={styles.colorPicker}
                            />
                            <code style={styles.colorCode}>{settings.textLight}</code>
                        </div>
                    </div>

                    <div style={styles.preview}>
                        <h4>Xem trước</h4>
                        <div style={{ background: settings.primaryColor, padding: '20px', borderRadius: '8px', color: 'white' }}>
                            <p>Màu chính</p>
                        </div>
                        <div style={{ background: settings.secondaryColor, padding: '20px', borderRadius: '8px', color: 'white', marginTop: '10px' }}>
                            <p>Màu phụ</p>
                        </div>
                        <div style={{ background: settings.accentColor, padding: '20px', borderRadius: '8px', color: 'white', marginTop: '10px' }}>
                            <p>Màu nhấn</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Hero */}
            {activeTab === 'hero' && (
                <div style={styles.tabContent}>
                    <h3>Cài đặt trang chủ</h3>

                    <div style={styles.formGroup}>
                        <label>Tiêu đề chính</label>
                        <input
                            type="text"
                            name="heroTitle"
                            value={settings.heroTitle}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Tiêu đề phụ</label>
                        <input
                            type="text"
                            name="heroSubtitle"
                            value={settings.heroSubtitle}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Mô tả</label>
                        <textarea
                            name="heroDescription"
                            value={settings.heroDescription}
                            onChange={handleChange}
                            style={styles.textarea}
                            rows="3"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>URL ảnh nền Hero</label>
                        <input
                            type="text"
                            name="heroImage"
                            value={settings.heroImage}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            )}

            {/* Tab Contact */}
            {activeTab === 'contact' && (
                <div style={styles.tabContent}>
                    <h3>Thông tin liên hệ</h3>

                    <div style={styles.formGroup}>
                        <label>Tên công ty / Cá nhân</label>
                        <input
                            type="text"
                            name="companyName"
                            value={settings.companyName}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <h3>Mạng xã hội</h3>
                    <div style={styles.formGroup}>
                        <label>Facebook</label>
                        <input
                            type="text"
                            name="facebook"
                            value={settings.facebook}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://facebook.com/..."
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>LinkedIn</label>
                        <input
                            type="text"
                            name="linkedin"
                            value={settings.linkedin}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                </div>
            )}

            {/* Tab SEO */}
            {activeTab === 'seo' && (
                <div style={styles.tabContent}>
                    <h3>Cài đặt SEO</h3>

                    <div style={styles.formGroup}>
                        <label>Tiêu đề website</label>
                        <input
                            type="text"
                            name="siteTitle"
                            value={settings.siteTitle}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Mô tả website (Meta Description)</label>
                        <textarea
                            name="siteDescription"
                            value={settings.siteDescription}
                            onChange={handleChange}
                            style={styles.textarea}
                            rows="3"
                        />
                    </div>
                </div>
            )}

            <div style={styles.saveNote}>
                💡 Cài đặt được lưu tự động. Thay đổi sẽ áp dụng ngay trên website.
            </div>
        </div>
    );
};

const styles = {
    pageTitle: {
        marginBottom: '24px',
        fontSize: '24px'
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '24px',
        flexWrap: 'wrap'
    },
    tab: {
        padding: '10px 20px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#666',
        borderRadius: '6px 6px 0 0'
    },
    tabActive: {
        background: '#1a3a5c',
        color: 'white'
    },
    tabContent: {
        background: 'white',
        padding: '24px',
        borderRadius: '8px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        marginTop: '6px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'inherit',
        marginTop: '6px'
    },
    select: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        marginTop: '6px',
        background: 'white'
    },
    colorGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
    },
    colorPicker: {
        width: '60px',
        height: '40px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'block',
        marginTop: '6px'
    },
    colorCode: {
        display: 'block',
        marginTop: '8px',
        fontSize: '12px',
        color: '#666'
    },
    preview: {
        marginTop: '24px',
        padding: '20px',
        background: '#f5f7fa',
        borderRadius: '8px'
    },
    saveNote: {
        marginTop: '20px',
        padding: '12px',
        background: '#e8f4fd',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#1a3a5c',
        textAlign: 'center'
    }
};

export default Settings;