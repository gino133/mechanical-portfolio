const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Project = require('../models/Project');
const Document = require('../models/Document');
const Blog = require('../models/Blog');
const removeDiacritics = require('../utils/removeDiacritics');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Backfills the searchText field for records that existed before
// diacritic-insensitive search was added. New records get this field
// automatically via each model's pre-save hook - this script only needs
// to run once for old data.
// Usage: node src/seeds/backfillSearchText.js
const run = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is undefined - check that backend/.env exists and has this key');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find();
        for (const p of products) {
            p.searchText = removeDiacritics(`${p.name} ${p.code}`);
            await p.save();
        }
        console.log(`Updated ${products.length} products`);

        const projects = await Project.find();
        for (const p of projects) {
            p.searchText = removeDiacritics(`${p.name} ${p.client}`);
            await p.save();
        }
        console.log(`Updated ${projects.length} projects`);

        const documents = await Document.find();
        for (const d of documents) {
            d.searchText = removeDiacritics(d.name);
            await d.save();
        }
        console.log(`Updated ${documents.length} documents`);

        const posts = await Blog.find();
        for (const b of posts) {
            b.searchText = removeDiacritics(`${b.title} ${b.excerpt}`);
            await b.save();
        }
        console.log(`Updated ${posts.length} blog posts`);

        console.log('Backfill complete!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
