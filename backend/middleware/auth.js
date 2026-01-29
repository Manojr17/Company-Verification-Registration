import jwt from 'jsonwebtoken';
import admin from '../config/firebase.js';

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided or invalid format' 
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return res.status(401).json({ 
      error: 'Invalid or expired Firebase token' 
    });
  }
};

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided or invalid format' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ 
      error: 'Invalid or expired JWT token' 
    });
  }
};

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firebaseUid: user.firebase_uid,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
  );
};