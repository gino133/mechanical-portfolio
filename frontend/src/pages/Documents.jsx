import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiEye } from 'react-icons/fi';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = ['Tất cả', 'Bản vẽ CAD', 'Bản vẽ SolidWorks', 'Thuyết minh', 'Tiêu chuẩn', 'Hướng dẫn'];

    useEffect(() => {
        const demoDocuments = [
            { id: 1, name: 'Ban ve khung bang tai.dwg', type: 'Bản vẽ CAD', size: '2.5MB', date: '15/05/2026', project: 'Băng tải' },
            { id: 2, name: 'Thiet ke cau truc 10 tan.pdf', type: 'Thuyết minh', size: '1.2MB', date: '10/05/2026', project: 'Cầu trục' },
            { id: 3, name: 'Tieu chuan TCVN 5575-2024.docx', type: 'Tiêu chuẩn', size: '0.8MB', date: '05/05/2026', project: 'Tiêu chuẩn' },
            { id: 4, name: 'Huong dan lap dat tu dien PLC.pdf', type: 'Hướng dẫn', size: '3.1MB', date: '01/05/2026', project: 'Tủ điện' },
            { id: 5, name: '3D model bang tai.SLDPRT', type: 'Bản vẽ SolidWorks', size: '15MB', date: '28/04/2026', project: 'Băng tải' },
            { id: 6, name: 'Ban ve chi tiet con lan.dwg', type: 'Bản vẽ CAD', size: '0.5MB', date: '20/04/2026', project: 'Con lăn' }
        ];
        setDocuments(demoDocuments);
        setFilteredDocs(demoDocuments);
        setLoading(false);
    }, []);

    useEffect(() => {
        let filtered = documents;
        
        if (activeCategory !== 'all') {
            filtered = filtered.filter(d => d.type === activeCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(d => 
                d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.project.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredDocs(filtered);
    }, [searchTerm, activeCategory, documents]);

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <section style={styles.hero}>
                <div className="container">
                    <h1 style={styles.title}>Thư viện tài liệu</h1>
                    <p style={styles.subtitle}>Tài liệu kỹ thuật, bản vẽ, thuyết minh dự án</p>
                </div>
            </section>

            <section style={styles.section}>
                <div className="container">
                    <div style={styles.searchBox}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.categories}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat === 'Tất cả' ? 'all' : cat)}
                                style={{
                                    ...styles.categoryBtn,
                                    ...(activeCategory === (cat === 'Tất cả' ? 'all' : cat) && styles.categoryBtnActive)
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Tên tài liệu</th>
                                    <th>Loại</th>
                                    <th>Dung lượng</th>
                                    <th>Ngày cập nhật</th>
                                    <th>Dự án liên quan</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.map(doc => (
                                    <tr key={doc.id}>
                                        <td style={styles.fileName}>{doc.name}</td>
                                        <td><span style={styles.typeBadge}>{doc.type}</span></td>
                                        <td>{doc.size}</td>
                                        <td>{doc.date}</td>
                                        <td>{doc.project}</td>
                                        <td>
                                            <button style={styles.actionBtn} title="Xem trước">
                                                <FiEye />
                                            </button>
                                            <button style={styles.actionBtn} title="Tải xuống">
                                                <FiDownload />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredDocs.length === 0 && (
                        <p style={styles.noResults}>Không tìm thấy tài liệu nào</p>
                    )}
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
    searchBox: {
        position: 'relative',
        maxWidth: '500px',
        margin: '0 auto 32px'
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#999'
    },
    searchInput: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        border: '1px solid var(--border-color)',
       