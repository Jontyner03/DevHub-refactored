import jwt from 'jsonwebtoken';
import User from '../schema/User.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; //Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //Verify token
    const user = await User.findById(decoded.id); //Find user by ID from token

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; //Attach validated user to the request 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;