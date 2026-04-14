import jwt from 'jsonwebtoken';
import process from 'node:process';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.admin?.role !== 'admin' && req.admin?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
