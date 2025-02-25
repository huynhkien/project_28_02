const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');



const User = new  mongoose.Schema({
  name: {type: String, maxLength: 255, require: true},
  password: {type: String, maxLength:255, require: true},
  email: {type: String, maxLength: 255, require: true},
  phone: {type: String, maxLength: 255, require: true},
  address: {type: String, maxLength: 255, require: true },
  refreshToken: {type: String,},
  passwordChangedAt: {  type: String},
  passwordResetToken: { type: String },
  passwordResetExpires: { type: String},  
  registerToken: { type: String },

}, {
  timestamps: true,
});

User.pre('save', async function(next) {
  if(!this.isModified('password')){
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});
User.methods = {
  isCorrectPassword: async function(password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangeToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000; 
    return resetToken;
  }
}
module.exports = mongoose.model('User', User);
