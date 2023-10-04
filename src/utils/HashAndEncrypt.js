import bcrypt from "bcryptjs";
import CryptoJS from"crypto-js";

// Hash
export const hash = ({ plaintext, salt = process.env.SALT_ROUND } = {}) => {
  const hashResult = bcrypt.hashSync(plaintext, parseInt(salt));
  return hashResult;
};
//Compare
export const compare = ({ plaintext, hashValue } = {}) => {
  const match = bcrypt.compareSync(plaintext, hashValue);
  return match;
};
// Encrypt
export const encryptData = (plaintext) => {
  return CryptoJS.AES.encrypt(plaintext, process.env.encryption_Key).toString();
};
// Decrypt
export const decryptData = (encryptData) => { 
   return CryptoJS.AES.decrypt(encryptData, process.env.encryption_Key)}
