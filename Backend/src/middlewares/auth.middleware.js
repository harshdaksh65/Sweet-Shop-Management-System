const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authMiddleware(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = decoded
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Forbidden: Admins only',
        });
    }
    next();
}

module.exports = {
    authMiddleware,
    adminOnly,
};