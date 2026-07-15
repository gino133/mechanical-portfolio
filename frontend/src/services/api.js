import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
});

// Request interceptor: Add token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        
        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Bạn không có quyền thực hiện hành động này');
        }
        
        // Handle 500 Server Error
        if (error.response?.status === 500) {
            console.error('Lỗi máy chủ, vui lòng thử lại sau');
        }
        
        return Promise.reject(error);
    }
);

// ==================== AUTH API ====================
export const authAPI = {
    // Login
    login: (email, password) => api.post('/auth/login', { email, password }),
    
    // Get current user info
    getMe: () => api.get('/auth/me'),
    
    // Update profile
    updateProfile: (data) => api.put('/auth/update', data),
    
    // Register new user (admin only)
    register: (userData) => api.post('/auth/register', userData),
    
    // Logout (client side only, no server action needed)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

// ==================== PRODUCT API ====================
export const productAPI = {
    // Get all products with pagination and filters
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category) queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);
        const query = queryParams.toString();
        return api.get(`/products${query ? `?${query}` : ''}`);
    },
    
    // Get featured products (for homepage)
    getFeatured: () => api.get('/products/featured'),
    
    // Get single product by ID
    getById: (id) => api.get(`/products/${id}`),
    
    // Create new product (admin only)
    create: (productData) => api.post('/products', productData),
    
    // Update product (admin only)
    update: (id, productData) => api.put(`/products/${id}`, productData),
    
    // Delete product (admin only)
    delete: (id) => api.delete(`/products/${id}`),
};

// ==================== PROJECT API ====================
export const projectAPI = {
    // Get all projects with pagination and filters
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category) queryParams.append('category', params.category);
        if (params.year) queryParams.append('year', params.year);
        const query = queryParams.toString();
        return api.get(`/projects${query ? `?${query}` : ''}`);
    },

    // Get featured projects (for homepage)
    getFeatured: () => api.get('/projects/featured'),
    
    // Get single project by ID
    getById: (id) => api.get(`/projects/${id}`),
    
    // Create new project (admin only)
    create: (projectData) => api.post('/projects', projectData),
    
    // Update project (admin only)
    update: (id, projectData) => api.put(`/projects/${id}`, projectData),
    
    // Delete project (admin only)
    delete: (id) => api.delete(`/projects/${id}`),
};

// ==================== DOCUMENT API ====================
export const documentAPI = {
    // Get all documents with pagination and filters
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category) queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);
        const query = queryParams.toString();
        return api.get(`/documents${query ? `?${query}` : ''}`);
    },
    
    // Get single document by ID
    getById: (id) => api.get(`/documents/${id}`),
    
    // Get download URL (increment count)
    getDownloadUrl: (id) => api.get(`/documents/download/${id}`),
    
    // Upload document (admin only)
    upload: (formData) => api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    // Delete document (admin only)
    delete: (id) => api.delete(`/documents/${id}`),
};

// ==================== CATEGORY API ====================
export const categoryAPI = {
    // Get all categories
    getAll: () => api.get('/categories'),
    
    // Get categories by type (product, project, document)
    getByType: (type) => api.get(`/categories/type/${type}`),
    
    // Create new category (admin only)
    create: (categoryData) => api.post('/categories', categoryData),
    
    // Update category (admin only)
    update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
    
    // Delete category (admin only)
    delete: (id) => api.delete(`/categories/${id}`),
};

// ==================== CONTACT API ====================
export const contactAPI = {
    // Send contact message (public)
    send: (contactData) => api.post('/contact/send', contactData),
    
    // Get all messages (admin only)
    getMessages: () => api.get('/contact/messages'),
    
    // Mark message as read (admin only)
    markAsRead: (id) => api.put(`/contact/${id}/read`),
    
    // Delete message (admin only)
    delete: (id) => api.delete(`/contact/${id}`),
};

// ==================== SETTINGS API ====================
export const settingsAPI = {
    // Get site-wide settings (public)
    get: () => api.get('/settings'),

    // Update site-wide settings (admin only)
    update: (data) => api.put('/settings', data),
};

// ==================== SEARCH API ====================
export const searchAPI = {
    // Search across products, projects, documents
    search: (keyword) => api.get(`/search?q=${encodeURIComponent(keyword)}`),
};

// ==================== UTILITY FUNCTIONS ====================
// Helper to check if user is logged in
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Helper to get current user
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Helper to save user after login
export const setAuthData = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

// Helper to clear auth data
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Default export for convenience
export default api;
