const { body, param, query, validationResult } = require('express-validator');

/**
 * Check validation results middleware
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

/**
 * User validation rules
 */
const validateUser = {
    register: [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        body('email')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),
        validate
    ],
    login: [
        body('email')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password is required'),
        validate
    ],
    updateProfile: [
        body('name')
            .optional()
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        body('email')
            .optional()
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .optional()
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        validate
    ]
};

/**
 * Product validation rules
 */
const validateProduct = {
    create: [
        body('name')
            .notEmpty().withMessage('Product name is required')
            .trim()
            .isLength({ min: 3, max: 200 }).withMessage('Product name must be between 3 and 200 characters'),
        body('code')
            .notEmpty().withMessage('Product code is required')
            .trim()
            .matches(/^[A-Z0-9-]+$/i).withMessage('Product code can only contain letters, numbers, and hyphens'),
        body('category')
            .notEmpty().withMessage('Category is required')
            .isMongoId().withMessage('Invalid category ID'),
        body('thumbnail')
            .notEmpty().withMessage('Thumbnail URL is required')
            .isURL().withMessage('Thumbnail must be a valid URL'),
        body('images')
            .isArray().withMessage('Images must be an array')
            .optional(),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),
        body('isFeatured')
            .optional()
            .isBoolean().withMessage('isFeatured must be a boolean'),
        validate
    ],
    update: [
        param('id')
            .isMongoId().withMessage('Invalid product ID'),
        body('name')
            .optional()
            .trim()
            .isLength({ min: 3, max: 200 }).withMessage('Product name must be between 3 and 200 characters'),
        body('code')
            .optional()
            .trim()
            .matches(/^[A-Z0-9-]+$/i).withMessage('Product code can only contain letters, numbers, and hyphens'),
        validate
    ],
    getById: [
        param('id')
            .isMongoId().withMessage('Invalid product ID'),
        validate
    ],
    delete: [
        param('id')
            .isMongoId().withMessage('Invalid product ID'),
        validate
    ],
    getProducts: [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('category')
            .optional()
            .isString().withMessage('Category must be a string'),
        query('search')
            .optional()
            .isString().withMessage('Search term must be a string'),
        validate
    ]
};

/**
 * Project validation rules
 */
const validateProject = {
    create: [
        body('name')
            .notEmpty().withMessage('Project name is required')
            .trim()
            .isLength({ min: 3, max: 200 }).withMessage('Project name must be between 3 and 200 characters'),
        body('client')
            .notEmpty().withMessage('Client name is required')
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage('Client name must be between 2 and 100 characters'),
        body('category')
            .notEmpty().withMessage('Category is required')
            .isMongoId().withMessage('Invalid category ID'),
        body('year')
            .notEmpty().withMessage('Year is required')
            .isInt({ min: 1900, max: new Date().getFullYear() + 5 }).withMessage('Invalid year'),
        body('thumbnail')
            .notEmpty().withMessage('Thumbnail URL is required')
            .isURL().withMessage('Thumbnail must be a valid URL'),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),
        validate
    ],
    update: [
        param('id')
            .isMongoId().withMessage('Invalid project ID'),
        validate
    ],
    getById: [
        param('id')
            .isMongoId().withMessage('Invalid project ID'),
        validate
    ],
    delete: [
        param('id')
            .isMongoId().withMessage('Invalid project ID'),
        validate
    ]
};

/**
 * Document validation rules
 */
const validateDocument = {
    upload: [
        body('name')
            .optional()
            .trim()
            .isLength({ max: 200 }).withMessage('Document name max 200 characters'),
        body('category')
            .optional()
            .isMongoId().withMessage('Invalid category ID'),
        body('relatedId')
            .optional()
            .isMongoId().withMessage('Invalid related ID'),
        body('relatedType')
            .optional()
            .isIn(['Product', 'Project']).withMessage('relatedType must be Product or Project'),
        body('version')
            .optional()
            .matches(/^\d+\.\d+$/).withMessage('Version must follow format x.y (e.g., 1.0)'),
        validate
    ],
    getById: [
        param('id')
            .isMongoId().withMessage('Invalid document ID'),
        validate
    ],
    download: [
        param('id')
            .isMongoId().withMessage('Invalid document ID'),
        validate
    ],
    delete: [
        param('id')
            .isMongoId().withMessage('Invalid document ID'),
        validate
    ]
};

/**
 * Category validation rules
 */
const validateCategory = {
    create: [
        body('name')
            .notEmpty().withMessage('Category name is required')
            .trim()
            .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
        body('slug')
            .notEmpty().withMessage('Slug is required')
            .trim()
            .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
        body('type')
            .notEmpty().withMessage('Type is required')
            .isIn(['product', 'project', 'document']).withMessage('Type must be product, project, or document'),
        body('description')
            .optional()
            .isLength({ max: 500 }).withMessage('Description max 500 characters'),
        body('order')
            .optional()
            .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
        validate
    ],
    update: [
        param('id')
            .isMongoId().withMessage('Invalid category ID'),
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
        body('slug')
            .optional()
            .trim()
            .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
        validate
    ],
    getByType: [
        param('type')
            .isIn(['product', 'project', 'document']).withMessage('Type must be product, project, or document'),
        validate
    ],
    delete: [
        param('id')
            .isMongoId().withMessage('Invalid category ID'),
        validate
    ]
};

/**
 * Contact validation rules
 */
const validateContact = {
    send: [
        body('name')
            .notEmpty().withMessage('Name is required')
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
        body('email')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('phone')
            .optional()
            .matches(/^[0-9+\-\s()]+$/).withMessage('Phone number contains invalid characters'),
        body('company')
            .optional()
            .trim()
            .isLength({ max: 100 }).withMessage('Company name max 100 characters'),
        body('message')
            .notEmpty().withMessage('Message is required')
            .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
        body('interestedIn')
            .optional()
            .isIn(['product', 'project', 'service', 'other']).withMessage('Invalid interestedIn value'),
        validate
    ],
    markAsRead: [
        param('id')
            .isMongoId().withMessage('Invalid message ID'),
        validate
    ],
    delete: [
        param('id')
            .isMongoId().withMessage('Invalid message ID'),
        validate
    ]
};

/**
 * ID param validation
 */
const validateIdParam = (paramName = 'id') => {
    return [
        param(paramName)
            .isMongoId().withMessage(`Invalid ${paramName}`),
        validate
    ];
};

/**
 * Pagination validation
 */
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt(),
    validate
];

/**
 * Search validation
 */
const validateSearch = [
    query('q')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
    validate
];

module.exports = {
    validate,
    validateUser,
    validateProduct,
    validateProject,
    validateDocument,
    validateCategory,
    validateContact,
    validateIdParam,
    validatePagination,
    validateSearch
};