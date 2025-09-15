import CryptoJS from 'crypto-js';

export const encryptMessage = (plainText, secret) => {
  if (!plainText || !secret) return '';
  const ciphertext = CryptoJS.AES.encrypt(plainText, secret).toString();
  return ciphertext;
};

export const decryptMessage = (ciphertext, secret) => {
  if (!ciphertext || !secret) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    // If decryption fails (e.g., wrong key), originalText will be empty.
    return originalText || '[Decryption failed]';
  } catch (error) {
    console.error('Decryption error:', error);
    return '[Decryption failed]';
  }
};
