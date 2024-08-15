const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchError');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const User = require('../models/userSchema');
module.exports = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    next(
      new AppError('Your are not logged in! Please log in to get access.', 403),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  req.user = freshUser;
  next();
});
