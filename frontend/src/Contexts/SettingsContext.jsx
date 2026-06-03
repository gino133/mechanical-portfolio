import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        // Font settings
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '16px',
        headingFont: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        
        // Color settings
        primaryColor: '#1a3a5c',
        secondaryColor: '#2c5a7a',
        accentColor: '#e67e22',
        textColor: '#333333',
        textLight: '#666666',
        
        // Layout settings
        containerWidth: '1200px',
        borderRadius: '8px',
        
        // Logo & branding
        logoText: 'KS. Cơ khí & Điện',
        logoImage: '',
        favicon: '',
        
        // Contact info
        companyName: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123 456 789',
        address: 'Hà Nội, Việt Nam',
        
        // Social links
        facebook: '',
        youtube: '',
        linkedin: '',
        
        // SEO
        siteTitle: 'Portfolio - Kỹ sư Cơ khí & Điện',
        siteDescription: 'Website portfolio cá nhân lĩnh vực Cơ khí và Điện',
        
        // Hero section
        heroTitle: 'Nguyễn Văn A',
        heroSubtitle: 'Kỹ sư Cơ khí chế tạo & Tự động hóa',
        heroDescription: 'Giải pháp kỹ thuật toàn diện cho ngành công nghiệp',
        heroImage: ''
    });

    const [menu, setMenu] = useState([
        { id: 1, label: 'Trang chủ', path: '/', order: 1, visible: true },
        { id: 2, label: 'Giới thiệu', path: '/about', order: 2, visible: true },
        { id: 3, label: 'Sản phẩm', path: '/products', order: 3, visible: true },
        { id: 4, label: 'Dự án', path: '/projects', order: 4, visible: true },
        { id: 5, label: 'Tài liệu', path: '/documents', order: 5, visible: true },
        { id: 6, label: 'Liên hệ', path: '/contact', order: 6, visible: true }
    ]);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('site_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
        
        const savedMenu = localStorage.getItem('site_menu');
        if (savedMenu) {
            setMenu(JSON.parse(savedMenu));
        }
    }, []);

    // Save settings to localStorage when changed
    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('site_settings', JSON.stringify(newSettings));
        
        // Apply CSS variables dynamically
        applySettingsToCSS(newSettings);
    };

    const updateMenu = (newMenu) => {
        setMenu(newMenu);
        localStorage.setItem('site_menu', JSON.stringify(newMenu));
    };

    const applySettingsToCSS = (settings) => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', settings.primaryColor);
        root.style.setProperty('--secondary-color', settings.secondaryColor);
        root.style.setProperty('--accent-color', settings.accentColor);
        root.style.setProperty('--text-color', settings.textColor);
        root.style.setProperty('--text-light', settings.textLight);
        root.style.setProperty('--font-family', settings.fontFamily);
        root.style.setProperty('--border-radius', settings.borderRadius);
        document.body.style.fontSize = settings.fontSize;
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            menu,
            updateSettings,
            updateMenu
        }}>
            {children}
        </SettingsContext.Provider>
    );
};