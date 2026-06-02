const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

/**
 * Get file extension from filename
 * @param {string} filename - Tên file
 * @returns {string} - File extension (lowercase, without dot)
 */
const getFileExtension = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return ext.startsWith('.') ? ext.substring(1) : ext;
};

/**
 * Get file type based on extension
 * @param {string} filename - Tên file
 * @returns {string} - File type
 */
const getFileType = (filename) => {
    const ext = getFileExtension(filename);
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const cadTypes = ['dwg', 'dxf', 'dgn', 'stl', 'step', 'iges', 'stp'];
    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'];
    const compressedTypes = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
    
    if (imageTypes.includes(ext)) return 'image';
    if (cadTypes.includes(ext)) return 'cad';
    if (documentTypes.includes(ext)) return 'document';
    if (compressedTypes.includes(ext)) return 'compressed';
    if (videoTypes.includes(ext)) return 'video';
    
    return 'other';
};

/**
 * Get MIME type from file extension
 * @param {string} filename - Tên file
 * @returns {string} - MIME type
 */
const getMimeType = (filename) => {
    const ext = getFileExtension(filename);
    
    const mimeTypes = {
        // Images
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'bmp': 'image/bmp',
        
        // CAD
        'dwg': 'application/acad',
        'dxf': 'application/dxf',
        'stl': 'application/sla',
        'step': 'application/step',
        'stp': 'application/step',
        
        // Documents
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'txt': 'text/plain',
        'rtf': 'application/rtf',
        
        // Compressed
        'zip': 'application/zip',
        'rar': 'application/vnd.rar',
        '7z': 'application/x-7z-compressed',
        'tar': 'application/x-tar',
        'gz': 'application/gzip',
        
        // Video
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'mkv': 'video/x-matroska'
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Format file size to human readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    if (bytes < 0) return 'Invalid size';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file type against allowed types
 * @param {string} filename - Tên file
 * @param {string[]} allowedTypes - Array of allowed extensions
 * @returns {boolean}
 */
const isValidFileType = (filename, allowedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'dwg', 'dxf']) => {
    const ext = getFileExtension(filename);
    return allowedTypes.includes(ext);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean}
 */
const isValidFileSize = (size, maxSizeMB = 50) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
};

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalName) => {
    const ext = getFileExtension(originalName);
    const nameWithoutExt = path.basename(originalName, `.${ext}`);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    
    // Remove special characters and spaces
    const cleanName = nameWithoutExt
        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
        .substring(0, 50);
    
    return `${cleanName}_${timestamp}_${random}.${ext}`;
};

/**
 * Ensure directory exists, create if not
 * @param {string} dirPath - Directory path
 * @returns {Promise<void>}
 */
const ensureDirectoryExists = async (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            await mkdirAsync(dirPath, { recursive: true });
            console.log(`✅ Created directory: ${dirPath}`);
        }
    } catch (error) {
        console.error(`❌ Error creating directory ${dirPath}:`, error.message);
        throw error;
    }
};

/**
 * Delete file from filesystem
 * @param {string} filePath - Full path to file
 * @returns {Promise<boolean>}
 */
const deleteFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await unlinkAsync(filePath);
            console.log(`🗑️ Deleted file: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ Error deleting file ${filePath}:`, error.message);
        return false;
    }
};

/**
 * Clean up old files in directory
 * @param {string} dirPath - Directory path
 * @param {number} maxAgeHours - Maximum age in hours
 * @returns {Promise<number>} - Number of files deleted
 */
const cleanupOldFiles = async (dirPath, maxAgeHours = 24) => {
    try {
        if (!fs.existsSync(dirPath)) return 0;
        
        const files = await readdirAsync(dirPath);
        const now = Date.now();
        const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
        let deletedCount = 0;
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await statAsync(filePath);
            const age = now - stats.mtimeMs;
            
            if (age > maxAgeMs && stats.isFile()) {
                await deleteFile(filePath);
                deletedCount++;
            }
        }
        
        console.log(`🧹 Cleaned up ${deletedCount} old files from ${dirPath}`);
        return deletedCount;
    } catch (error) {
        console.error(`❌ Error cleaning up ${dirPath}:`, error.message);
        return 0;
    }
};

/**
 * Read file as buffer
 * @param {string} filePath - File path
 * @returns {Promise<Buffer>}
 */
const readFileAsBuffer = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

/**
 * Write buffer to file
 * @param {string} filePath - Output file path
 * @param {Buffer} buffer - Data buffer
 * @returns {Promise<void>}
 */
const writeBufferToFile = async (filePath, buffer) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, buffer, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

/**
 * Get file statistics
 * @param {string} filePath - File path
 * @returns {Promise<Object|null>}
 */
const getFileStats = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return null;
        
        const stats = await statAsync(filePath);
        return {
            size: stats.size,
            sizeFormatted: formatFileSize(stats.size),
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
        };
    } catch (error) {
        console.error(`❌ Error getting stats for ${filePath}:`, error.message);
        return null;
    }
};

/**
 * List files in directory
 * @param {string} dirPath - Directory path
 * @returns {Promise<Array>}
 */
const listFiles = async (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) return [];
        
        const files = await readdirAsync(dirPath);
        const fileList = [];
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await statAsync(filePath);
            
            if (stats.isFile()) {
                fileList.push({
                    name: file,
                    path: filePath,
                    size: stats.size,
                    sizeFormatted: formatFileSize(stats.size),
                    modifiedAt: stats.mtime,
                    extension: getFileExtension(file),
                    type: getFileType(file)
                });
            }
        }
        
        return fileList;
    } catch (error) {
        console.error(`❌ Error listing files in ${dirPath}:`, error.message);
        return [];
    }
};

/**
 * Parse Cloudinary URL to extract info
 * @param {string} url - Cloudinary URL
 * @returns {Object}
 */
const parseCloudinaryUrl = (url) => {
    try {
        // Example: https://res.cloudinary.com/cloud_name/raw/upload/v1234567890/folder/file.pdf
        const regex = /\/upload\/(?:v\d+\/)?(.+)/;
        const match = url.match(regex);
        
        if (match) {
            const fullPath = match[1];
            const lastSlash = fullPath.lastIndexOf('/');
            const filename = lastSlash !== -1 ? fullPath.substring(lastSlash + 1) : fullPath;
            const folder = lastSlash !== -1 ? fullPath.substring(0, lastSlash) : '';
            const publicId = fullPath.split('.').slice(0, -1).join('.');
            const extension = filename.split('.').pop();
            
            return {
                url,
                filename,
                folder,
                publicId,
                extension,
                type: getFileType(filename),
                isValid: true
            };
        }
        
        return {
            url,
            filename: 'unknown',
            publicId: 'unknown',
            extension: 'unknown',
            type: 'unknown',
            isValid: false
        };
    } catch (error) {
        return {
            url,
            filename: 'unknown',
            publicId: 'unknown',
            extension: 'unknown',
            type: 'unknown',
            isValid: false,
            error: error.message
        };
    }
};

/**
 * Get safe filename (remove invalid characters)
 * @param {string} filename - Original filename
 * @returns {string}
 */
const getSafeFilename = (filename) => {
    return filename
        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5.-]/g, '_')
        .replace(/_+/g, '_')
        .substring(0, 200);
};

/**
 * Check if file is an image
 * @param {string} filename - Filename
 * @returns {boolean}
 */
const isImage = (filename) => {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    return imageExts.includes(getFileExtension(filename));
};

/**
 * Check if file is a CAD file
 * @param {string} filename - Filename
 * @returns {boolean}
 */
const isCadFile = (filename) => {
    const cadExts = ['dwg', 'dxf', 'dgn', 'stl', 'step', 'iges', 'stp'];
    return cadExts.includes(getFileExtension(filename));
};

/**
 * Check if file is a PDF
 * @param {string} filename - Filename
 * @returns {boolean}
 */
const isPdf = (filename) => {
    return getFileExtension(filename) === 'pdf';
};

module.exports = {
    // Core functions
    getFileExtension,
    getFileType,
    getMimeType,
    formatFileSize,
    
    // Validation
    isValidFileType,
    isValidFileSize,
    isImage,
    isCadFile,
    isPdf,
    
    // File operations
    generateUniqueFilename,
    getSafeFilename,
    ensureDirectoryExists,
    deleteFile,
    cleanupOldFiles,
    readFileAsBuffer,
    writeBufferToFile,
    getFileStats,
    listFiles,
    
    // Utilities
    parseCloudinaryUrl
};