import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Documents from './pages/Documents';
import Contact from './pages/Contact';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductsManager from './pages/Admin/ProductsManager';
import { SettingsProvider } from './contexts/SettingsContext';
import Settings from './pages/Admin/Settings';
import MenuManager from './pages/Admin/MenuManager';

function App() {
    return (
        <SettingsProvider>
            <Router>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminDashboard />}>
                            <Route path="products" element={<ProductsManager />} />
                            <Route path="projects" element={<div>Quản lý dự án (đang xây dựng)</div>} />
                            <Route path="documents" element={<div>Quản lý tài liệu (đang xây dựng)</div>} />
                            <Route path="messages" element={<div>Quản lý tin nhắn (đang xây dựng)</div>} />
                        </Route>
                        <Route path="/admin/settings" element={<Settings />} />
                        <Route path="/admin/menu" element={<MenuManager />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </SettingsProvider>
    );
}

export default App;
