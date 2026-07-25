const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, min: 0, max: 100, default: 80 }
}, { _id: false });

const certificateSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    name: { type: String, required: true }
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    label: { type: String, required: true },
    path: { type: String, required: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
}, { _id: false });

const homeSectionSchema = new mongoose.Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { _id: false });

const footerLinkSchema = new mongoose.Schema({
    label: { type: String, required: true },
    path: { type: String, required: true }
}, { _id: false });

const chatbotRuleSchema = new mongoose.Schema({
    // Comma-separated keywords, e.g. "giá, báo giá, chi phí"
    keywords: { type: String, required: true },
    reply: { type: String, required: true }
}, { _id: false });

const settingsSchema = new mongoose.Schema({
    // Branding
    logoText: { type: String, default: 'KS. Cơ khí & Điện' },
    logoImage: { type: String, default: '' },
    favicon: { type: String, default: '' },

    // Colors & Fonts
    fontFamily: { type: String, default: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
    fontSize: { type: String, default: '16px' },
    headingFont: { type: String, default: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
    primaryColor: { type: String, default: '#1a3a5c' },
    secondaryColor: { type: String, default: '#2c5a7a' },
    accentColor: { type: String, default: '#e67e22' },
    textColor: { type: String, default: '#333333' },
    textLight: { type: String, default: '#666666' },
    containerWidth: { type: String, default: '1200px' },
    borderRadius: { type: String, default: '8px' },

    // SEO
    siteTitle: { type: String, default: 'Trần Cao Hải - Kỹ thuật Cơ khí & Điện' },
    siteDescription: { type: String, default: 'Website cá nhân lĩnh vực Cơ khí, phụ kiện lưới điện trung hạ thế, thiết bị viễn thông, trụ đèn và thiết bị an toàn giao thông, Tủ điện công nghiệp và dân dụng' },

    // Hero section (trang chủ)
    heroTitle: { type: String, default: 'Trần Cao Hải' },
    heroSubtitle: { type: String, default: 'Kỹ thuật Cơ khí chế tạo và Điện công nghiệp, dân dụng' },
    heroDescription: { type: String, default: 'Giải pháp kỹ thuật toàn diện cho ngành Cơ khí & Điện' },
    heroImage: { type: String, default: '' },

    // Optional background image for the banner at the top of other pages
    // (same style as the homepage Hero, just re-used per page)
    aboutHeroImage: { type: String, default: '' },
    productsHeroImage: { type: String, default: '' },
    projectsHeroImage: { type: String, default: '' },
    documentsHeroImage: { type: String, default: '' },
    contactHeroImage: { type: String, default: '' },
    blogHeroImage: { type: String, default: '' },

    // Intro section (trang chủ)
    introText1: {
        type: String,
        default: 'Tôi là kỹ sư cơ khí với hơn 10 năm kinh nghiệm trong lĩnh vực tole, thép và phụ kiện lưới điện, viễn thông, thiết bị giao thông'
    },
    statYears: { type: String, default: '10+' },
    statYearsLabel: { type: String, default: 'Năm kinh nghiệm' },
    statProjects: { type: String, default: '50+' },
    statProjectsLabel: { type: String, default: 'Dự án hoàn thành' },
    statClients: { type: String, default: '200+' },
    statClientsLabel: { type: String, default: 'Khách hàng' },

    // About page
    aboutIntro1: {
        type: String,
        default: 'Tôi là một Sale trong lĩnh vực cơ khí, điện. Tính đến nay, tôi đã có hơn 10 năm gắn bó với những thanh thép, cuộn tole và các loại thiết bị, vật tư phụ trợ cho ngành cơ khí - điện. Mười năm không phải là quá dài, nhưng đủ để tôi hiểu rõ từng thông số sản phẩm, nắm chắc tiêu chuẩn kỹ thuật và quan trọng nhất là hiểu được thấu đáo những gì mà công trình của anh chị đang thực sự cần.'
    },
    aboutIntro2: {
        type: String,
        default: 'Bên cạnh đó, tôi cũng có kiến thức sâu rộng về hệ thống điện công nghiệp và tự động hóa, giúp tôi có thể đưa ra các giải pháp toàn diện cho khách hàng.'
    },
    avatarImage: { type: String, default: 'https://via.placeholder.com/400x500?text=Avatar' },
    education: { type: String, default: 'Đại học Công Nghiệp TP HCM' },
    skills: { type: [skillSchema], default: [
        { name: 'Thiết kế cơ khí', level: 90 },
        { name: 'SolidWorks / AutoCAD', level: 95 },
        { name: 'Tính toán kết cấu', level: 85 },
        { name: 'Gia công CNC', level: 80 },
        { name: 'Điện công nghiệp', level: 75 },
        { name: 'Lập trình PLC', level: 70 }
    ] },
    certificates: { type: [certificateSchema], default: [
        { year: 2023, name: 'Chứng chỉ SolidWorks Professional' },
        { year: 2022, name: 'Khóa học Tự động hóa Siemens' },
        { year: 2021, name: 'Giải thưởng Sáng tạo Kỹ thuật' }
    ] },
    cvUrlVi: { type: String, default: '' },
    cvUrlEn: { type: String, default: '' },

    // Contact info (used site-wide: Footer, About, Contact page)
    companyName: { type: String, default: 'Trần Cao Hải' },
    email: { type: String, default: 'hakirotomo@email.com' },
    phone: { type: String, default: '0988 154 521' },
    address: { type: String, default: 'Hồ Chí Minh, Việt Nam' },
    workingHours: { type: String, default: 'Thứ 2 - Thứ 6: 8:00 - 16:30' },

    // Footer
    footerAboutTitle: { type: String, default: 'Về tôi' },
    footerAboutText: {
        type: String,
        default: 'Kỹ sư Cơ khí & Điện với 10+ năm kinh nghiệm trong lĩnh vực cơ khí và điện.'
    },
    footerLinksTitle: { type: String, default: 'Liên kết nhanh' },
    footerContactTitle: { type: String, default: 'Thông tin liên hệ' },
    copyrightText: { type: String, default: '© 2026 Trần Cao Hải. All rights reserved.' },
    footerLinks: { type: [footerLinkSchema], default: [
        { label: 'Sản phẩm', path: '/products' },
        { label: 'Dự án', path: '/projects' },
        { label: 'Tài liệu', path: '/documents' },
        { label: 'Liên hệ', path: '/contact' }
    ] },

    // Social links
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },

    // Navigation menu (shared across all visitors)
    menu: { type: [menuItemSchema], default: [
        { id: 1, label: 'Trang chủ', path: '/', order: 1, visible: true },
        { id: 2, label: 'Giới thiệu', path: '/about', order: 2, visible: true },
        { id: 3, label: 'Sản phẩm', path: '/products', order: 3, visible: true },
        { id: 4, label: 'Dự án', path: '/projects', order: 4, visible: true },
        { id: 5, label: 'Tài liệu', path: '/documents', order: 5, visible: true },
        { id: 6, label: 'Liên hệ', path: '/contact', order: 6, visible: true }
    ] },

    // Homepage section layout - which content blocks show on the homepage,
    // and in what order.
    homeSections: { type: [homeSectionSchema], default: [
        { key: 'hero', label: 'Banner đầu trang (Hero)', enabled: true, order: 1 },
        { key: 'intro', label: 'Giới thiệu & Dịch vụ', enabled: true, order: 2 },
        { key: 'products', label: 'Sản phẩm nổi bật', enabled: true, order: 3 },
        { key: 'projects', label: 'Dự án nổi bật', enabled: true, order: 4 },
        { key: 'blog', label: 'Bài viết Blog mới nhất', enabled: false, order: 5 }
    ] },

    // Chatbot / AI assistant widget
    chatbotEnabled: { type: Boolean, default: true },
    chatbotName: { type: String, default: 'Trợ lý AI' },
    chatbotGreeting: {
        type: String,
        default: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn hôm nay?'
    },
    chatbotRules: { type: [chatbotRuleSchema], default: [
        { keywords: 'giá, báo giá, chi phí', reply: 'Cảm ơn bạn quan tâm! Vui lòng để lại thông tin liên hệ hoặc gửi email trực tiếp để nhận báo giá chi tiết nhé!' },
        { keywords: 'cơ khí, gia công', reply: 'Chúng tôi chuyên thiết kế và gia công cơ khí chính xác: băng tải, máy ép thủy lực, cầu trục, kết cấu thép... Bạn quan tâm đến sản phẩm nào cụ thể không?' },
        { keywords: 'điện, plc, tủ điện', reply: 'Dịch vụ điện của chúng tôi bao gồm: thiết kế tủ điện công nghiệp, lập trình PLC, HMI, Scada. Bạn cần tư vấn về hệ thống nào?' },
        { keywords: 'tài liệu, bản vẽ', reply: 'Bạn có thể tải tài liệu kỹ thuật, bản vẽ CAD, SolidWorks tại trang Tài liệu trên website. Nếu cần tài liệu cụ thể, hãy cho tôi biết nhé!' },
        { keywords: 'liên hệ, email, số điện thoại', reply: 'Bạn có thể xem thông tin liên hệ đầy đủ ở cuối trang, hoặc để lại lời nhắn ở trang Liên hệ, tôi sẽ chuyển tới đội ngũ hỗ trợ nhé!' }
    ] },
    chatbotFallback: {
        type: String,
        default: 'Cảm ơn bạn đã quan tâm! Bạn có thể xem thêm thông tin chi tiết tại các trang Sản phẩm, Dự án, hoặc để lại thông tin liên hệ để được tư vấn trực tiếp nhé!'
    }
}, { timestamps: true });

// Singleton helper: there should only ever be one Settings document.
settingsSchema.statics.getSingleton = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
