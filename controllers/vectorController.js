// controllers/vectorController.js
import { vectorize } from '../services/vectorizer.js';

// Artık async değil çünkü dış istek yok
export const vectorizeText = (text) => {
  return vectorize(text);
};
