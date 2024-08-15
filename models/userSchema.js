const { default: mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userScheme = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'Please tell us your First name!'],
  },
  last_name: {
    type: String,
    required: [true, 'Please tell us your Last name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
});

userScheme.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userScheme.methods.comparePassword = async (password, userpassword) => {
  return await bcrypt.compare(password, userpassword);
};
const User = mongoose.model('User', userScheme, 'users');
module.exports = User;
