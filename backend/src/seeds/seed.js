const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Project = require('../models/Project');

dotenv.config({ path: '../.env' });

const categories = [
    { name: 'Cơ khí', slug: 'co-khi', type: 'product', order: 1 },
    { name: 'Điện', slug: 'dien', type: 'product', order: 2 },
    { name: 'Cơ khí', slug: 'co-khi', type: 'project', order: 1 },
    { name: 'Điện', slug: 'dien', type: 'project', order: 2 },
    { name: 'Bản vẽ CAD', slug: 'ban-ve-cad', type: 'document', order: 1 },
    { name: 'Thuyết minh', slug: 'thuyet-minh', type: 'document', order: 2 },
];

const products = [
    {
        name: 'Băng tải cao su',
        code: 'BT-100',
        specifications: { material: 'Cao su chịu mài mòn', dimensions: 'Dài 10m, Rộng 500mm', load: '500kg/m' },
        description: 'Băng tải cao su chất lượng cao cho nhà máy sản xuất',
        thumbnail: 'https://via.placeholder.com/300x200',
        images: ['https://via.placeholder.com/600x400'],
        isFeatured: true
    },
    {
        name: 'Máy ép thủy lực 50T',
        code: 'EP-50',
        specifications: { pressure: '50 tấn', stroke: '300mm', motor: '7.5kW' },
        description: 'Máy ép thủy lực công suất lớn, điều khiển PLC',
        thumbnail: 'https://via.placeholder.com/300x200',
        images: ['https://via.placeholder.com/600x400'],
        isFeatured: true
    }
];

const projects = [
    {
        name: 'Cầu trục 10 tấn',
        client: 'Nhà máy XYZ',
        year: 2024,
        description: 'Thiết kế và chế tạo cầu trục 10 tấn cho nhà máy sản xuất thép',
        thumbnail: 'https://via.placeholder.com/400x250',
        gallery: ['https://via.placeholder.com/800x500'],
        technicalInfo: { capacity: '10 tấn', span: '20m', liftingHeight: '12m' }
    },
    {
        name: 'Hệ thống băng tải tự động',
        client: 'Công ty ABC',
        year: 2023,
        description: 'Hệ thống băng tải vận chuyển than cốc cho nhà máy xi măng',
        thumbnail: 'https://via.placeholder.com/400x250',
        gallery: ['https://via.placeholder.com/800x500'],
        technicalInfo: { length: '150m', capacity: '200 tấn/h' }
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
        await Project.deleteMany();

        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        });
        console.log('Admin user created');

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories created');

        // Create products with category references
        const mechanicalCat = createdCategories.find(c => c.name === 'Cơ khí' && c.type === 'product');
        const electricalCat = createdCategories.find(c => c.name === 'Điện' && c.type === 'product');

        for (let product of products) {
            product.category = mechanicalCat._id;
            await Product.create(product);
        }
        console.log('Products created');

        // Create projects with category references
        const mechanicalProjCat = createdCategories.find(c => c.name === 'Cơ khí' && c.type === 'project');
        
        for (let project of projects) {
            project.category = mechanicalProjCat._id;
            await Project.create(project);
        }
        console.log('Projects created');

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
