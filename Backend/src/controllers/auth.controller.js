const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');

async function registerUser(req, res){ 
    const {username, email, password, fullname: { firstname, lastname} } = req.body;

    const isUserAlereadyExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    });

    if(isUserAlereadyExists){
        return res.status(400).json({
            message:"User with this username or email already exists"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        fullname:{
            firstname,
            lastname
        }
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '1d'})

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
        },
        role: user.role,
    })
}

async function loginUser(req, res){
    const { username, email, password}  = req.body;

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    }).select('+password');

    if(!user){
        return res.status(400).json({
            message: "Invalid Credentials"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            message: "Invalid Credentials"
        });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '1d'});

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
        },
        role: user.role,
    })
}

async function getCurrentUser(req, res){
    return res.status(200).json({
        message: "Current user fetched successfully",
        user: req.user
    });
}

async function logoutUser(req, res) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.status(200).json({
            message: 'User logged out successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to logout user',
            error: error.message,
        });
    }
}

module.exports = { 
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
}