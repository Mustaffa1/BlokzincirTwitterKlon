import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import Tweet from '../models/Tweet.js';
import User from '../models/User.js';
import { vectorizeText } from '../controllers/vectorController.js';
import { decodeVector } from '../services/vectorizer.js';

const router = express.Router();

// POST /api/tweet → Yeni tweet oluştur
router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Tweet metni boş olamaz.' });
  }

  try {
    const vector = vectorizeText(text.trim());

    const newTweet = new Tweet({
      userId: req.user.userId,
      vector,
    });

    const saved = await newTweet.save();
    res.status(201).json({ tweetId: saved._id });
  } catch (err) {
    console.error('Tweet kaydı hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// DELETE /api/tweet/:id → Tweet sil
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet bulunamadı' });
    }

    // sadece tweet sahibi silebilsin
    if (tweet.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Bu tweeti silmeye yetkiniz yok.' });
    }

    await Tweet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tweet başarıyla silindi' });
  } catch (err) {
    console.error('Tweet silme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET /api/tweet/user/:id → Belirli kullanıcıya ait tweet'ler
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    const tweets = await Tweet.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'username name surname avatar');

    const formatted = tweets.map(tweet => ({
      _id: tweet._id,
      userId: tweet.userId,
      vector: tweet.vector,
      text: decodeVector(tweet.vector),
      createdAt: tweet.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Tweet listeleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET /api/tweet/feed → Takip edilen ve kendine ait tweet'ler
router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const followingIds = currentUser.following;
    const allUserIds = [...followingIds, req.user.userId];

    const tweets = await Tweet.find({ userId: { $in: allUserIds } })
      .sort({ createdAt: -1 })
      .populate('userId', 'username name surname avatar');

    const formatted = tweets.map(tweet => ({
      _id: tweet._id,
      userId: tweet.userId,
      vector: tweet.vector,
      text: decodeVector(tweet.vector),
      createdAt: tweet.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Feed tweetlerini çekerken hata:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET /api/tweet → Tüm tweet'ler
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username name surname avatar');

    const formatted = tweets.map(tweet => ({
      _id: tweet._id,
      userId: tweet.userId,
      vector: tweet.vector,
      text: decodeVector(tweet.vector),
      createdAt: tweet.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Tüm tweetleri çekerken hata:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export default router;
