import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Verify sign and verify work
const testPayload = { userId: '123', role: 'ADMIN' };
const token = jwt.sign(testPayload, privateKey, { algorithm: 'RS256' });
const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
console.log('Key pair verified successfully with test payload:', decoded);

// Format for .env with escaped newlines
const pubEscaped = publicKey.replace(/\r?\n/g, '\\n');
const privEscaped = privateKey.replace(/\r?\n/g, '\\n');

const envPath = path.resolve(process.cwd(), '.env');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Remove any existing JWT_PUBLIC_KEY or JWT_PRIVATE_KEY lines or malformed lines
const lines = envContent.split(/\r?\n/).filter(line => {
  return !line.startsWith('JWT_PUBLIC_KEY=') && !line.startsWith('JWT_PRIVATE_KEY=') && !line.includes('dummy');
});

lines.push(`JWT_PRIVATE_KEY="${privEscaped}"`);
lines.push(`JWT_PUBLIC_KEY="${pubEscaped}"`);

// Ensure PORT, ALLOWED_ORIGINS, NODE_ENV are present
if (!lines.some(l => l.startsWith('PORT='))) {
  lines.push('PORT=5000');
}
if (!lines.some(l => l.startsWith('ALLOWED_ORIGINS='))) {
  lines.push('ALLOWED_ORIGINS=http://localhost:3000');
}
if (!lines.some(l => l.startsWith('NODE_ENV='))) {
  lines.push('NODE_ENV=development');
}

fs.writeFileSync(envPath, lines.filter(Boolean).join('\n') + '\n', 'utf8');
console.log('Successfully updated .env with matching RSA key pair for dev mock tokens!');
