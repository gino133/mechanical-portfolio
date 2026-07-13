import React, { createContext, useState, useContext, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const DEFAULT_SETTINGS = {
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
    workingHours: 'Thứ 2 - Thứ 7: 8:00 - 17:30',

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
    heroImage: '',

    // Intro section
    introText1: 'Tôi là kỹ sư cơ khí với hơn 10 năm kinh nghiệm...',
    statYears: '10+',
    statYearsLabel: 'Năm kinh nghiệm',
    statProjects: '50+',
    statProjectsLabel: 'Dự án hoàn thành',
    statClients: '30+',
    statClientsLabel: 'Khách hàng',

    // About page
    aboutIntro1: '',
    aboutIntro2: '',
    avatarImage: 'https://via.placeholder.com/400x500?text=Avatar',
    education: '',
    skills: [],
    certificates: [],
    cvUrlVi: '',
    cvUrlEn: '',

    // Footer
    footerAboutText: '',
    copyrightText: '© 2026 Nguyễn Văn A. All rights reserved.'
};

const DEFAULT_MENU = [
    { id: 1, label: 'Trang chủ', path: '/', order: 1, visible: true },
    { id: 2, label: 'Giới thiệu', path: '/about', order: 2, visible: true },
    { id: 3, label: 'Sản phẩm', path: '/products', order: 3, visible: true },
    { id: 4, label: 'Dự án', path: '/projects', order: 4, visible: true },
    { id: 5, label: 'Tài liệu', path: '/documents', order: 5, visible: true },
    { id: 6, label: 'Liên hệ', path: '/contact', order: 6, visible: true }
];

export const SettingsProvider = ({ children }) => {
    // Start from localStorage cache (or defaults) so the UI paints instantly,
    // then refresh from the backend - which is the real source of truth
    // shared by every visitor.
    const [settings, setSettings] = useState(() => {
        const cached = localStorage.getItem('site_settings');
        return cached ? { ...DEFAULT_SETTINGS, ...JSON.parse(cached) } : DEFAULT_SETTINGS;
    });
    const [menu, setMenu] = useState(() => {
        const cached = localStorage.getItem('site_menu');
        return cached ? JSON.parse(cached) : DEFAULT_MENU;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await settingsAPI.get();
            const data = response.data.data;
            const { menu: fetchedMenu, ...settingsData } = data;

            const mergedSettings = { ...DEFAULT_SETTINGS, ...settingsData };
            setSettings(mergedSettings);
            localStorage.setItem('site_settings', JSON.stringify(mergedSettings));
            applySettingsToCSS(mergedSettings);

            const mergedMenu = fetchedMenu && fetchedMenu.length > 0 ? fetchedMenu : DEFAULT_MENU;
            setMenu(mergedMenu);
            localStorage.setItem('site_menu', JSON.stringify(mergedMenu));
        } catch (error) {
            console.error('Không tải được cài đặt từ server, dùng dữ liệu tạm:', error);
            applySettingsToCSS(settings);
        } finally {
            setLoading(false);
        }
    };

    // Persist to backend (source of truth for all visitors) + local cache
    const updateSettings = async (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('site_settings', JSON.stringify(newSettings));
        applySettingsToCSS(newSettings);

        try {
            const response = await settingsAPI.update(newSettings);
            const saved = response.data.data;
            const { menu: savedMenu, ...savedSettings } = saved;
            setSettings(savedSettings);
            localStorage.setItem('site_settings', JSON.stringify(savedSettings));
            return { success: true };
        } catch (error) {
            console.error('Lỗi lưu cài đặt lên server:', error);
            return { success: false, error };
        }
    };

    // Menu is now stored server-side (inside the same Settings document) so
    // every visitor sees the same navigation, not just the admin's browser.
    const updateMenu = async (newMenu) => {
        setMenu(newMenu);
        localStorage.setItem('site_menu', JSON.stringify(newMenu));

        try {
            const response = await settingsAPI.update({ menu: newMenu });
            const saved = response.data.data;
            if (saved.menu) {
                setMenu(saved.menu);
                localStorage.setItem('site_menu', JSON.stringify(saved.menu));
            }
            return { success: true };
        } catch (error) {
            console.error('Lỗi lưu menu lên server:', error);
            return { success: false, error };
        }
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
            loading,
            updateSettings,
            updateMenu,
            refetchSettings: fetchSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
