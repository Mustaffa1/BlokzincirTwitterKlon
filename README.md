# BlokzincirTwitterKlon# 🧠 Blokzincir Tabanlı Twitter Uygulaması

Bu proje, geleneksel sosyal medya sistemlerinden farklı olarak merkeziyetsiz ve güvenilir veri saklama yaklaşımını benimseyen bir Twitter klonudur. Tweet verileri vektörlere dönüştürülerek daha verimli biçimde depolanmakta ve tweet kimlik bilgileri Hyperledger Fabric blokzincir ağı üzerinde saklanmaktadır.

---

## 🚀 Proje Özellikleri

- 📝 Tweet paylaşma ve görüntüleme
- 👤 Kullanıcı kayıt ve giriş sistemi (JWT ile kimlik doğrulama)
- 🔐 Korunan sayfalara erişim kontrolü
- 🔄 Takip et / Takibi bırak sistemi
- 🧠 Tweet içeriklerinin kelime vektörlerine dönüştürülerek MongoDB'de saklanması
- ⛓️ Tweet ID'lerinin Hyperledger Fabric blokzincir ağına yazılması
- 📁 IPFS entegrasyonu ile tweet içeriklerini merkeziyetsiz olarak saklayabilme (opsiyonel)
- 👤 Profil düzenleme ve avatar yükleme
- 📬 Gerçek zamanlı mesajlaşma (gelecekteki geliştirme için planlandı)

---

## 🧱 Kullanılan Teknolojiler

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB
- **Blokzincir:** Hyperledger Fabric (chaincode: `tweetcc`)
- **Dosya Saklama (opsiyonel):** IPFS / Web3.Storage
- **Vektörleme Servisi:** Python FastAPI (JSON tabanlı kelime indeksleme)

---

## ⚙️ Kurulum

### 1. Backend


cd backend
npm install
npm start

### 2.Frontend
cd frontend
npm install
npm start
