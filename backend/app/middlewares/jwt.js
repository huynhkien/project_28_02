const jwt = require('jsonwebtoken');

// Hàm tạo access token
const generateAccessToken = (uid) => {
    return jwt.sign({_id: uid}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

// Hàm tạo refresh token
const generateRefreshToken = (uid) => {
    return jwt.sign({_id: uid}, process.env.JWT_SECRET, {expiresIn: '7d'});
}
module.exports = {
    generateAccessToken,
    generateRefreshToken
}
