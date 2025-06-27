// backend/fabricClient.js
import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

const ccpPath = path.resolve('backend', 'fabric', 'connection-org1.json');
const walletPath = path.resolve('backend', 'fabric', 'wallet');

async function getContract() {
  // 1. Connection profile yükle
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  // 2. Cüzdanı yükle
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  // 3. Kullanıcı kimliği kontrolü
  const identity = await wallet.get('appUser');
  if (!identity) {
    throw new Error('❌ appUser bulunamadı. Önce registerUser.js ile kaydedin.');
  }

  // 4. Gateway oluştur
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  // 5. Ağ ve sözleşme bağlantısı
  const network = await gateway.getNetwork('mychannel');
  const contract = network.getContract('tweetcc');

  return contract;
}

export default getContract;
