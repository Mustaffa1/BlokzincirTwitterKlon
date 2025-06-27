import connectFabric from '../blockchain/fabricClient.js';

export const writeTweetToBlockchain = async (req, res) => {
  const { id, user, vector } = req.body;

  if (!id || !user || !vector) {
    return res.status(400).json({ error: 'id, user ve vector zorunludur' });
  }

  try {
    const contract = await connectFabric();
    await contract.submitTransaction('AddTweet', id, user, vector);
    res.status(200).json({ message: '✅ Tweet blokzincire yazıldı' });
  } catch (err) {
    console.error('❌ Blokzincir yazma hatası:', err.message || err);
    res.status(500).json({ error: 'Tweet blokzincire yazılamadı' });
  }
};

