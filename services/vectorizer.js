import fs from 'fs';
import path from 'path';

// Sözlüğün bulunduğu dosyanın yolu
const vocabPath = path.join(process.cwd(), 'custom_vocab_from_txts.json');
const word2index = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

// Tersini üret (index -> kelime)
const index2word = Object.fromEntries(
  Object.entries(word2index).map(([word, index]) => [index, word])
);

// Metni kelimelere böl → indeks dizisine çevir
export function vectorize(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(word => word2index[word] || word2index['<unk>'] || 0);  // bilinmeyen kelime için fallback
}

// Vektör dizisini tekrar metne çevir
export function decodeVector(vector) {
  return vector.map(index => index2word[index] || '<unk>').join(' ');
}
