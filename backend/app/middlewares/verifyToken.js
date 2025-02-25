const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Middleware xác thực access token
const verifyAccessToken = asyncHandler(async (req, res, next) => {
    // Kiểm tra xem header Authorization có bắt đầu bằng "Bearer" không
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        // Lấy token từ header Authorization
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        // Xác thực token
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if (error) {
                // Trả về lỗi nếu token không hợp lệ
                return res.status(401).json({
                    success: false,
                    message: 'Invalid access Token!'
                });
            }
            // In thông tin giải mã của token ra console (tùy chọn)
            console.log(decode);
            // Lưu thông tin người dùng vào req.user để sử dụng trong các middleware tiếp theo
            req.user = decode;
            // Chuyển sang middleware tiếp theo
            next();
        });
    } else {
        // Trả về lỗi nếu không có token trong header Authorization
        return res.status(401).json({
            success: false,
            message: 'Require authentication!'
        });
    }
});
module.exports = {
    verifyAccessToken,
}
