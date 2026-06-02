const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
    });

    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid user data'
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        }
    });
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
        success: true,
        data: user
    });
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/update
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            }
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile
};