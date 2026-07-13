import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const Settings = () => {
    const { settings, updateSettings, loading } = useSettings();
    const [activeTab, setActiveTab] = useState('general');
    const [form, setForm] = useState(settings);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    // Keep the local edit form in sync whenever fresh settings arrive
    // (first load from the server, or after a successful save).
    useEffect(() => {
        setForm(settings);
    }, [settings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSkillChange = (index, field, value) => {
        const newSkills = [...(form.skills || [])];
        newSkills[index] = { ...newSkills[index], [field]: field === 'level' ? Number(value) : value };
        setForm(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
        setForm(prev => ({ ...prev, skills: [...(prev.skills || []), { name: '', level: 80 }] }));
    };

    const removeSkill = (index) => {
        setForm(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    };

    const handleCertChange = (index, field, value) => {
        const newCerts = [...(form.certificates || [])];
        newCerts[index] = { ...newCerts[index], [field]: field === 'year' ? Number(value) : value };
        setForm(prev => ({ ...prev, certificates: newCerts }));
    };

    const addCert = () => {
        setForm(prev => ({ ...prev, certificates: [...(prev.certificates || []), { year: new Date().getFullYear(), name: '' }] }));
    };

    const removeCert = (index) => {
        setForm(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== index) }));
    };

    const handleFooterLinkChange = (index, field, value) => {
        const newLinks = [...(form.footerLinks || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setForm({ ...form, footerLinks: newLinks });
    };

    const addFooterLink = () => {
        setForm({ ...form, footerLinks: [...(form.footerLinks || []), { label: '', path: '/' }] });
    };

    const removeFooterLink = (index) => {
        setForm({ ...form, footerLinks: (form.footerLinks || []).filter((_, i) => i !== index) });
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveMsg('');
        const result = await updateSettings(form);
        setSaving(false);
        setSaveMsg(result.success ? '✓ Đã lưu thành công! Thay đổi đã áp dụng trên toàn bộ website.' : '✗ Lưu thất bại, vui lòng thử lại.');
        setTimeout(() => setSaveMsg(''), 4000);
    };

    const tabs = [
        { id: 'general', label: 'Tổng quan' },
        { id: 'colors', label: 'Màu sắc & Font' },
        { id: 'hero', label: 'Trang chủ' },
        { id: 'about', label: 'Giới thiệu' },
        { id: 'contact', label: 'Thông tin liên hệ' },
        { id: 'footer', label: 'Footer' },
        { id: 'seo', label: 'SEO' }
    ];

    if (loading) {
        return <div>Đang tải cài đặt...</div>;
    }

    return (
        <div>
            <h2 style={styles.pageTitle}>Cài đặt giao diện & nội dung</h2>

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
                        <input type="text" name="logoText" value={form.logoText || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Logo URL (ảnh)</label>
                        <input type="text" name="logoImage" value={form.logoImage || ''} onChange={handleChange} style={styles.input} placeholder="https://..." />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Font chữ chính</label>
                        <select name="fontFamily" value={form.fontFamily || ''} onChange={handleChange} style={styles.select}>
                            <option value="Segoe UI, Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                            <option value="Arial, Helvetica, sans-serif">Arial</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                            <option value="Open Sans, sans-serif">Open Sans</option>
                            <option value="Times New Roman, serif">Times New Roman</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label>Cỡ chữ cơ bản</label>
                        <select name="fontSize" value={form.fontSize || ''} onChange={handleChange} style={styles.select}>
                            <option value="14px">Nhỏ (14px)</option>
                            <option value="16px">Trung bình (16px)</option>
                            <option value="18px">Lớn (18px)</option>
                            <option value="20px">Rất lớn (20px)</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label>Độ rộng container (px)</label>
                        <input type="text" name="containerWidth" value={form.containerWidth || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Độ bo góc (px)</label>
                        <input type="text" name="borderRadius" value={form.borderRadius || ''} onChange={handleChange} style={styles.input} />
                    </div>
                </div>
            )}

            {/* Tab Colors & Font */}
            {activeTab === 'colors' && (
                <div style={styles.tabContent}>
                    <h3>Màu sắc chủ đạo</h3>

                    <div style={styles.colorGrid}>
                        {[
                            { key: 'primaryColor', label: 'Màu chính' },
                            { key: 'secondaryColor', label: 'Màu phụ' },
                            { key: 'accentColor', label: 'Màu nhấn' },
                            { key: 'textColor', label: 'Màu chữ chính' },
                            { key: 'textLight', label: 'Màu chữ phụ' }
                        ].map(c => (
                            <div style={styles.formGroup} key={c.key}>
                                <label>{c.label}</label>
                                <input type="color" name={c.key} value={form[c.key] || '#000000'} onChange={handleChange} style={styles.colorPicker} />
                                <code style={styles.colorCode}>{form[c.key]}</code>
                            </div>
                        ))}
                    </div>

                    <div style={styles.preview}>
                        <h4>Xem trước</h4>
                        <div style={{ background: form.primaryColor, padding: '20px', borderRadius: '8px', color: 'white' }}>
                            <p>Màu chính</p>
                        </div>
                        <div style={{ background: form.secondaryColor, padding: '20px', borderRadius: '8px', color: 'white', marginTop: '10px' }}>
                            <p>Màu phụ</p>
                        </div>
                        <div style={{ background: form.accentColor, padding: '20px', borderRadius: '8px', color: 'white', marginTop: '10px' }}>
                            <p>Màu nhấn</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Hero (trang chủ) */}
            {activeTab === 'hero' && (
                <div style={styles.tabContent}>
                    <h3>Phần giới thiệu đầu trang (Hero)</h3>

                    <div style={styles.formGroup}>
                        <label>Tiêu đề chính</label>
                        <input type="text" name="heroTitle" value={form.heroTitle || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Tiêu đề phụ</label>
                        <input type="text" name="heroSubtitle" value={form.heroSubtitle || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Mô tả</label>
                        <textarea name="heroDescription" value={form.heroDescription || ''} onChange={handleChange} style={styles.textarea} rows="3" />
                    </div>

                    <div style={styles.formGroup}>
                        <label>URL ảnh nền Hero</label>
                        <input type="text" name="heroImage" value={form.heroImage || ''} onChange={handleChange} style={styles.input} placeholder="https://..." />
                    </div>

                    <h3>Phần "Giới thiệu" trên trang chủ</h3>

                    <div style={styles.formGroup}>
                        <label>Đoạn văn giới thiệu ngắn</label>
                        <textarea name="introText1" value={form.introText1 || ''} onChange={handleChange} style={styles.textarea} rows="4" />
                    </div>

                    <h3>Số liệu thống kê</h3>
                    <div style={styles.colorGrid}>
                        <div style={styles.formGroup}>
                            <label>Số năm kinh nghiệm</label>
                            <input type="text" name="statYears" value={form.statYears || ''} onChange={handleChange} style={styles.input} placeholder="10+" />
                            <input type="text" name="statYearsLabel" value={form.statYearsLabel || ''} onChange={handleChange} style={{ ...styles.input, marginTop: '6px' }} placeholder="Nhãn, VD: Năm kinh nghiệm" />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Số dự án</label>
                            <input type="text" name="statProjects" value={form.statProjects || ''} onChange={handleChange} style={styles.input} placeholder="50+" />
                            <input type="text" name="statProjectsLabel" value={form.statProjectsLabel || ''} onChange={handleChange} style={{ ...styles.input, marginTop: '6px' }} placeholder="Nhãn, VD: Dự án hoàn thành" />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Số khách hàng</label>
                            <input type="text" name="statClients" value={form.statClients || ''} onChange={handleChange} style={styles.input} placeholder="30+" />
                            <input type="text" name="statClientsLabel" value={form.statClientsLabel || ''} onChange={handleChange} style={{ ...styles.input, marginTop: '6px' }} placeholder="Nhãn, VD: Khách hàng" />
                        </div>
                    </div>
                </div>
            )}

            {/* Tab About (trang Giới thiệu) */}
            {activeTab === 'about' && (
                <div style={styles.tabContent}>
                    <h3>Trang "Giới thiệu"</h3>

                    <div style={styles.formGroup}>
                        <label>Ảnh đại diện (URL)</label>
                        <input type="text" name="avatarImage" value={form.avatarImage || ''} onChange={handleChange} style={styles.input} placeholder="https://..." />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Đoạn giới thiệu 1</label>
                        <textarea name="aboutIntro1" value={form.aboutIntro1 || ''} onChange={handleChange} style={styles.textarea} rows="4" />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Đoạn giới thiệu 2</label>
                        <textarea name="aboutIntro2" value={form.aboutIntro2 || ''} onChange={handleChange} style={styles.textarea} rows="4" />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Học vấn</label>
                        <input type="text" name="education" value={form.education || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Link CV (Tiếng Việt, PDF)</label>
                        <input type="text" name="cvUrlVi" value={form.cvUrlVi || ''} onChange={handleChange} style={styles.input} placeholder="https://..." />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Link CV (English, PDF)</label>
                        <input type="text" name="cvUrlEn" value={form.cvUrlEn || ''} onChange={handleChange} style={styles.input} placeholder="https://..." />
                    </div>

                    <h3>Kỹ năng chuyên môn</h3>
                    {(form.skills || []).map((skill, index) => (
                        <div key={index} style={styles.listRow}>
                            <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                style={{ ...styles.input, flex: 2 }}
                                placeholder="Tên kỹ năng"
                            />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={skill.level}
                                onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                                style={{ ...styles.input, flex: 1 }}
                                placeholder="% (0-100)"
                            />
                            <button onClick={() => removeSkill(index)} style={styles.iconBtn} title="Xóa">
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                    <button onClick={addSkill} style={styles.addBtn}><FiPlus /> Thêm kỹ năng</button>

                    <h3 style={{ marginTop: '32px' }}>Chứng chỉ & Giải thưởng</h3>
                    {(form.certificates || []).map((cert, index) => (
                        <div key={index} style={styles.listRow}>
                            <input
                                type="number"
                                value={cert.year}
                                onChange={(e) => handleCertChange(index, 'year', e.target.value)}
                                style={{ ...styles.input, flex: 1 }}
                                placeholder="Năm"
                            />
                            <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => handleCertChange(index, 'name', e.target.value)}
                                style={{ ...styles.input, flex: 3 }}
                                placeholder="Tên chứng chỉ / giải thưởng"
                            />
                            <button onClick={() => removeCert(index)} style={styles.iconBtn} title="Xóa">
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                    <button onClick={addCert} style={styles.addBtn}><FiPlus /> Thêm chứng chỉ</button>
                </div>
            )}

            {/* Tab Contact */}
            {activeTab === 'contact' && (
                <div style={styles.tabContent}>
                    <h3>Thông tin liên hệ</h3>

                    <div style={styles.formGroup}>
                        <label>Tên công ty / Cá nhân</label>
                        <input type="text" name="companyName" value={form.companyName || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={form.email || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Số điện thoại</label>
                        <input type="text" name="phone" value={form.phone || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Địa chỉ</label>
                        <input type="text" name="address" value={form.address || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Thời gian làm việc</label>
                        <input type="text" name="workingHours" value={form.workingHours || ''} onChange={handleChange} style={styles.input} placeholder="Thứ 2 - Thứ 7: 8:00 - 17:30" />
                    </div>

                    <h3>Mạng xã hội</h3>
                    <div style={styles.formGroup}>
                        <label>Facebook</label>
                        <input type="text" name="facebook" value={form.facebook || ''} onChange={handleChange} style={styles.input} placeholder="https://facebook.com/..." />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Youtube</label>
                        <input type="text" name="youtube" value={form.youtube || ''} onChange={handleChange} style={styles.input} placeholder="https://youtube.com/..." />
                    </div>

                    <div style={styles.formGroup}>
                        <label>LinkedIn</label>
                        <input type="text" name="linkedin" value={form.linkedin || ''} onChange={handleChange} style={styles.input} placeholder="https://linkedin.com/in/..." />
                    </div>
                </div>
            )}

            {/* Tab Footer */}
            {activeTab === 'footer' && (
                <div style={styles.tabContent}>
                    <h3>Footer (chân trang)</h3>

                    <div style={styles.formGroup}>
                        <label>Đoạn giới thiệu ngắn ở footer</label>
                        <textarea name="footerAboutText" value={form.footerAboutText || ''} onChange={handleChange} style={styles.textarea} rows="3" />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Dòng bản quyền (copyright)</label>
                        <input type="text" name="copyrightText" value={form.copyrightText || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <h3 style={{ marginTop: '32px' }}>Liên kết nhanh (cột giữa Footer)</h3>
                    <p style={styles.hint}>Danh sách này độc lập với Menu chính ở header - bạn có thể đặt khác nhau.</p>
                    {(form.footerLinks || []).map((link, index) => (
                        <div key={index} style={styles.listRow}>
                            <input
                                type="text"
                                value={link.label}
                                onChange={(e) => handleFooterLinkChange(index, 'label', e.target.value)}
                                style={{ ...styles.input, flex: 2 }}
                                placeholder="Tên hiển thị (VD: Sản phẩm)"
                            />
                            <input
                                type="text"
                                value={link.path}
                                onChange={(e) => handleFooterLinkChange(index, 'path', e.target.value)}
                                style={{ ...styles.input, flex: 2 }}
                                placeholder="Đường dẫn (VD: /products)"
                            />
                            <button onClick={() => removeFooterLink(index)} style={styles.iconBtn} type="button"><FiTrash2 /></button>
                        </div>
                    ))}
                    <button onClick={addFooterLink} style={styles.addBtn} type="button"><FiPlus /> Thêm liên kết</button>
                </div>
            )}

            {/* Tab SEO */}
            {activeTab === 'seo' && (
                <div style={styles.tabContent}>
                    <h3>Cài đặt SEO</h3>

                    <div style={styles.formGroup}>
                        <label>Tiêu đề website</label>
                        <input type="text" name="siteTitle" value={form.siteTitle || ''} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Mô tả website (Meta Description)</label>
                        <textarea name="siteDescription" value={form.siteDescription || ''} onChange={handleChange} style={styles.textarea} rows="3" />
                    </div>
                </div>
            )}

            <div style={styles.saveBar}>
                <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                {saveMsg && <span style={styles.saveMsg}>{saveMsg}</span>}
            </div>

            <div style={styles.saveNote}>
                💡 Nhớ bấm "Lưu thay đổi" sau khi chỉnh sửa — thay đổi sẽ áp dụng ngay cho mọi người xem website, không chỉ riêng bạn.
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
    listRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '10px',
        alignItems: 'center'
    },
    iconBtn: {
        background: '#fee',
        color: '#c00',
        border: 'none',
        borderRadius: '6px',
        padding: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#eef4fb',
        color: '#1a3a5c',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 16px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '4px'
    },
    saveBar: {
        marginTop: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    saveBtn: {
        background: '#1a3a5c',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '12px 32px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    saveMsg: {
        fontSize: '14px'
    },
    saveNote: {
        marginTop: '16px',
        padding: '12px',
        background: '#e8f4fd',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#1a3a5c',
        textAlign: 'center'
    }
};

export default Settings;
