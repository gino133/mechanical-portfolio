import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Chatbot from './components/Chatbot';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public pages - lazy-loaded so a visitor to the public site never
// downloads the (much heavier) admin bundle.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Documents = lazy(() => import('./pages/Documents'));
const DocumentCategory = lazy(() => import('./pages/DocumentCategory'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const SearchResults = lazy(() => import('./pages/SearchResults'));

// Admin pages - lazy-loaded into their own chunk(s), only fetched when
// someone actually navigates to /admin/*.
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Settings = lazy(() => import('./pages/Admin/Settings'));
const MenuManager = lazy(() => import('./pages/Admin/MenuManager'));
const PagesManager = lazy(() => import('./pages/Admin/PagesManager'));
const ProductsManager = lazy(() => import('./pages/Admin/ProductsManager'));
const ProjectsManager = lazy(() => import('./pages/Admin/ProjectsManager'));
const DocumentsManager = lazy(() => import('./pages/Admin/DocumentsManager'));
const CategoriesManager = lazy(() => import('./pages/Admin/CategoriesManager'));
const BlogManager = lazy(() => import('./pages/Admin/BlogManager'));
const ServicesManager = lazy(() => import('./pages/Admin/ServicesManager'));
const MessagesManager = lazy(() => import('./pages/Admin/MessagesManager'));

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

// 404 Page component
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

function App() {
    return (
        <SettingsProvider>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <main style={{ flex: 1 }}>
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:id" element={<ProjectDetail />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route path="/documents/category/:categoryId" element={<DocumentCategory />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<BlogDetail />} />
                            <Route path="/services/:slug" element={<ServiceDetail />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/search" element={<SearchResults />} />
                            
                            {/* Admin Login - no layout */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            
                            {/* Admin Dashboard with layout and protected */}
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }>
                                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="dashboard" element={
                                    <div style={styles.dashboardHome}>
                                        <h2>Chào mừng đến với trang quản trị</h2>
                                        <p>Chọn một mục bên trái để bắt đầu quản lý nội dung website.</p>
                                        <div style={styles.stats}>
                                            <div style={styles.statCard}>
                                                <h3>📦 Sản phẩm</h3>
                                                <p>Quản lý danh sách sản phẩm</p>
                                            </div>
                                            <div style={styles.statCard}>
                                                <h3>🏗️ Dự án</h3>
                                                <p>Quản lý danh sách dự án</p>
                                            </div>
                                            <div style={styles.statCard}>
                                                <h3>📄 Tài liệu</h3>
                                                <p>Upload và quản lý tài liệu</p>
                                            </div>
                                            <div style={styles.statCard}>
                                                <h3>💬 Tin nhắn</h3>
                                                <p>Xem tin nhắn liên hệ</p>
                                            </div>
                                        </div>
                                    </div>
                                } />
                                <Route path="settings" element={<Settings />} />
                                <Route path="menu" element={<MenuManager />} />
                                <Route path="pages" element={<PagesManager />} />
                                <Route path="categories" element={<CategoriesManager />} />
                                <Route path="blog" element={<BlogManager />} />
                                <Route path="services" element={<ServicesManager />} />
                                <Route path="products" element={<ProductsManager />} />
                                <Route path="projects" element={<ProjectsManager />} />
                                <Route path="documents" element={<DocumentsManager />} />
                                <Route path="messages" element={<MessagesManager />} />
                            </Route>
                            
                            {/* 404 - Not Found */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        </Suspense>
                    </main>
                    <Footer />
                    <Chatbot />
                </div>
            </Router>
        </SettingsProvider>
    );
}

const styles = {
    dashboardHome: {
        textAlign: 'center',
        padding: '40px 20px',
        background: 'white',
        borderRadius: '12px'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '32px'
    },
    statCard: {
        background: '#f5f7fa',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
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
