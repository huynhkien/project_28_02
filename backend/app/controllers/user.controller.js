const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto-js');


const register = asyncHandler(async(req, res) => {
    const { name, email, password, address, phone } = req.body;
    if(!(email || name || password || address || phone)){
        return res.status(400).json({
            status: false,
            message: 'Thiếu thông tin'
        });
    }
    const user = await User.findOne({email});
    if(user) {
        return res.status(400).json({
            success: false,
            message: "Email đã đăng ký"
        })
    }else{
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: true,
            message: newUser ? "Đăng ký tài khoản thành công" : "Đăng ký tài khoản thất bại"
        })
    }

})
const login = asyncHandler(async(res, req) => {
    const {email, password} = req.body;
    if(!(email || password)){
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin"
        });
    }
    const user = await User.findOne({email});
    if(user && user.isCorrectPassword(password)){
        const { password, refreshToken, ...userData } = user.toObject();
        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        
        await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true });
        
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            accessToken,
            userData,
        });
    }else{
        return res.status(401).json({
            success: false,
            message: 'Tài khoản hoặc mật khẩu không chính xác'
        });
    }
})
const forgotPassword = asyncHandler(async(res, req) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({
        success: false,
        message: "Thiếu thông tin"
    });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
        success: false,
        message: "Không tìm thấy địa chỉ email"
    });
    
    const resetToken = user.createPasswordChangeToken();
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.URL_CLIENT}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Quên mật khẩu'
    }
    const rs = await sendMail(data);
    return res.status(200).json({
        success: rs? false : true,
        message: rs? 'Vui lòng thử lại!' : 'Check mail của bạn'
    });

});
const resetPassword = asyncHandler(async (res, req) =>{
    const {password, token} = req.body;
    if(!password || !token) return res.status(400).json({
        success: false,
        message: "Thiếu thông tin"
    });
    const passwordResetToken = crypto.SHA256(token).toString(crypto.enc.Hex);
    const user = await User.findOne({passwordResetToken, passwordResetExpires:{$gt: Date.now()}});
    if (!user) throw new Error('Thông tin không hợp lệ')
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Mật khẩu đã được cập nhật' : 'Gặp lỗi xảy ra trong quá trình cập nhaật'
    });

});
const getUser = asyncHandler(async(res, req) => {
    const {uid} = req.params;
    const user = await User.findById(uid);
    return res.status(200).json({
        success: user ? true : false,
        data: user? user : 'Không tìm thấy'
    });
})
module.exports = {
   register,
   login,
   forgotPassword,
   resetPassword,
   getUser
}  
  