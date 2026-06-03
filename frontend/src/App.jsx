import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Chatbot from './components/Chatbot';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Documents from './pages/Documents';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import Settings from './pages/Admin/Settings';
import MenuManager from './pages/Admin/MenuManager';
import ProductsManager from './pages/Admin/ProductsManager';
import ProjectsManager from './pages/Admin/ProjectsManager';
import DocumentsManager from './pages/Admin/DocumentsManager';
import MessagesManager from './pages/Admin/MessagesManager';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

function App() {
    return (
        <SettingsProvider>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:id" element={<ProjectDetail />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route path="/contact" element={<Contact />} />
                            
                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }>
                                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="dashboard" element={<div style={styles.dashboardHome}>
                                    <h2>Chào mừng đến với trang quản trị</h2>
                                    <p>Chọn một mục bên trái để bắt đầu quản lý.</p>
                                </div>} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="menu" element={<MenuManager />} />
                                <Route path="products" element={<ProductsManager />} />
                                <Route path="projects" element={<ProjectsManager />} />
                                <Route path="documents" element={<DocumentsManager />} />
                                <Route path="messages" element={<MessagesManager />} />
                            </Route>
                            
                            {/* 404 - Not Found */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <Footer />
                    <Chatbot />
                </div>
            </Router>
        </SettingsProvider>
    );
}

// 404 Page
const NotFound = () => {
    return (
        <div style={styles.notFound}>
            <h1>404</h1>
            <h2>Không tìm thấy trang</h2>
            <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
            <a href="/" style={styles.backHome}>Về trang chủ</a>
        </div>
    );
};

const styles = {
    dashboardHome: {
        textAlign: 'center',
        padding: '60px 20px',
        background: 'white',
        borderRadius: '8px'
    },
    notFound: {
        textAlign: 'center',
        padding: '100px 20px',
        background: 'white',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backHome: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 24px',
        background: 'var(--primary-color)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px'
    }
};

export default App;