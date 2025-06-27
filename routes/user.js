import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import User from '../models/User.js';

const router = express.Router();


// GET /api/user/search
router.get('/search', authMiddleware, async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim() === '') {
    return res.json([]);
  }

  try {
    const regex = new RegExp(query, 'i'); // büyük/küçük harf duyarsız
    const users = await User.find({
      $or: [
        { username: regex },
        { name: regex },
        { surname: regex },
      ],
    }).select('username name surname avatar');

    res.json(users);
  } catch (err) {
    console.error('Kullanıcı arama hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});
//  GET /api/user/:id → Kullanıcı profilini getir
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Kullanıcı profili getirilemedi:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export default router;
