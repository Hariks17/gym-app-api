const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchError');
const AppError = require('../utils/appError');
const User = require('../models/userSchema');

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    next(new AppError('Incorrect email or password', 401));
  }

  const token = signJWT(user._id);

  res.json({ status: 'success', token });
});
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = signJWT(newUser._id);
  res.json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
