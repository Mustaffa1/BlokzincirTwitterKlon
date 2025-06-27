import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';

// 🔗 Route dosyaları
import followRoutes from './routes/follow.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import tweetRoutes from './routes/tweet.js';
import blockchainRoutes from './routes/blockchain.js'; // ✅ eklendi

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/twitter-clone';

// 🧩 Middleware'ler
app.use(cors());
app.use(bodyParser.json());

// 🖼️ Upload klasörünü public yap
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 🛢️ MongoDB bağlantısı
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

// 🚏 Route'lar
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/blockchain', blockchainRoutes); // ✅ eklendi

// ▶ Sunucu başlat
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});

