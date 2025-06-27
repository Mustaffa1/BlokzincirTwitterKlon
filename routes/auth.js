import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar123';

/* ---------- MULTER: Avatar yükleme ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/* ---------- Kullanıcı Kaydı ---------- */
router.post('/register', async (req, res) => {
  const { username, name, surname, email, password, phone, country } = req.body;

  try {
    if (!username || !name || !surname || !email || !password) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik.' });
    }

    const emailCheck = await User.findOne({ email });
    const usernameCheck = await User.findOne({ username });

    if (emailCheck) return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı.' });
    if (usernameCheck) return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış.' });

    const user = new User({ username, name, surname, email, password, phone, country });
    await user.save();

    res.status(201).json({ message: 'Kayıt başarılı!' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/* ---------- Giriş ---------- */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });

    const payload = { userId: user._id, email: user.email };
    const expiresIn = '1d';
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

    const decoded = jwt.decode(token);

    res.json({
      token,
      expiresAt: decoded.exp * 1000, // 🕒 Frontend için expiration timestamp
      user: {
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        country: user.country,
      },
    });
  } catch (err) {
    console.error('Giriş hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/* ---------- Kullanıcı Bilgisi ---------- */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ user });
  } catch (err) {
    console.error('Me hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/* ---------- Profil Bilgisi Güncelleme ---------- */
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const updateFields = {};
    const allowed = ['name', 'surname', 'phone', 'country', 'bio', 'avatar'];

    allowed.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        updateFields[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profil güncellendi', user: updatedUser });
  } catch (err) {
    console.error('Güncelleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/* ---------- Avatar Güncelleme ---------- */
router.put('/update-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenemedi.' });
    }

    const avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({ message: 'Avatar güncellendi.', user: updatedUser });
  } catch (err) {
    console.error('Avatar hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export default router;
