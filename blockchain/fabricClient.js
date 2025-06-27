import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

const connectFabric = async () => {
  try {
    const ccpPath = path.resolve('fabric', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.resolve('blockchain', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'Admin@org1.example.com',
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('tweetcc');
    return contract;
    
  } catch (err) {
    console.error('❌ Fabric bağlantı hatası:', err);
    throw err;
  }
};

export default connectFabric;

