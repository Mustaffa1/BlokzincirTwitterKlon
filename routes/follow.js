import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// ✅ TAKİP ET
router.post('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const targetId = req.params.id;

  if (userId === targetId) {
    return res.status(400).json({ error: 'Kendini takip edemezsin.' });
  }

  try {
    const [user, targetUser] = await Promise.all([
      User.findById(userId),
      User.findById(targetId),
    ]);

    if (!targetUser) return res.status(404).json({ error: 'Hedef kullanıcı bulunamadı.' });
    if (user.following.includes(targetId)) {
      return res.status(400).json({ error: 'Zaten takip ediyorsun.' });
    }

    user.following.push(targetId);
    targetUser.followers.push(userId);

    await Promise.all([user.save(), targetUser.save()]);

    res.json({ message: 'Takip edildi.' });
  } catch (err) {
    console.error('Takip etme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ✅ TAKİBİ BIRAK
router.post('/unfollow/:id', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const targetId = req.params.id;

  if (userId === targetId) {
    return res.status(400).json({ error: 'Kendini takipten çıkaramazsın.' });
  }

  try {
    const [user, targetUser] = await Promise.all([
      User.findById(userId),
      User.findById(targetId),
    ]);

    if (!targetUser) return res.status(404).json({ error: 'Hedef kullanıcı bulunamadı.' });

    user.following = user.following.filter(id => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);

    await Promise.all([user.save(), targetUser.save()]);

    res.json({ message: 'Takipten çıkıldı.' });
  } catch (err) {
    console.error('Takipten çıkma hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ✅ TAKİP DURUMU
router.get('/is-following/:id', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const targetId = req.params.id;

  try {
    const user = await User.findById(userId);
    const isFollowing = user.following.includes(targetId);
    res.json({ isFollowing });
  } catch (err) {
    console.error('Takip kontrol hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ✅ TAKİPÇİLERİ LİSTELE
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username name avatar');
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ followers: user.followers });
  } catch (err) {
    console.error('Takipçiler alınamadı:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// ✅ TAKİP ETTİKLERİ LİSTELE
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'username name avatar');
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ following: user.following });
  } catch (err) {
    console.error('Takip edilenler alınamadı:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export default router;
