import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar123';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded.userId burada olacak
    next();
  } catch (err) {
    console.error('JWT doğrulama hatası:', err);
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

export default authMiddleware;
