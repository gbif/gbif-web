import { createDecipheriv, createCipheriv, randomBytes } from 'node:crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)

const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export function encryptJSON(o) {
  try {
    return encrypt(JSON.stringify(o));
  } catch (err) {
    throw new Error('Failed to stringify and encrypt json');
  }
}

export function decryptJSON(e) {
  try {
    return JSON.parse(decrypt(e));
  } catch (err) {
    throw new Error('Failed to decrypt and parse json');
  }
}

export default { decrypt, encrypt, encryptJSON, decryptJSON };
