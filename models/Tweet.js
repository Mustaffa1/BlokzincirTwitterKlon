import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 👤 Kullanıcıya referans
    required: true,
  },
  vector: {
    type: [Number], // Örnek: vektörleştirilmiş sayı listesi
    default: [],
  },
}, { timestamps: true }); // createdAt, updatedAt otomatik eklenir

const Tweet = mongoose.model('Tweet', tweetSchema);
export default Tweet;
