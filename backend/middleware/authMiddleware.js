const User = require('../models/userModel');

const protect = async (req, res, next) => {
  const userId = req.headers['user-id'];
  
  if (userId) {
    try {
      req.user = await User.findById(userId).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid user ID' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no user ID provided' });
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
