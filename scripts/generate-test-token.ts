/**
 * Local-only helper — signs a test token with keys/private.pem so you can
 * hit protected routes in Postman without a live SSO service.
 *
 * Usage:
 *   npx tsx scripts/generate-test-token.ts            (defaults to ADMIN)
 *   npx tsx scripts/generate-test-token.ts SUB_ADMIN
 *   npx tsx scripts/generate-test-token.ts STUDENT
 */
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const role = (process.argv[2] ?? 'ADMIN') as 'ADMIN' | 'SUB_ADMIN' | 'STUDENT';
const privateKeyPath = path.join(__dirname, '..', 'keys', 'private.pem');

if (!fs.existsSync(privateKeyPath)) {
  console.error(
    '\n❌  keys/private.pem not found.\n\n' +
    'Generate a key pair first by running:\n\n' +
    '  mkdir -p keys\n' +
    '  openssl genrsa -out keys/private.pem 2048\n' +
    '  openssl rsa -in keys/private.pem -pubout -out keys/public.pem\n\n' +
    'Then copy the contents of keys/public.pem into your .env as JWT_PUBLIC_KEY.\n'
  );
  process.exit(1);
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const token = jwt.sign(
  {
    userId: '11111111-1111-1111-1111-111111111111',
    role,
  },
  privateKey,
  { algorithm: 'RS256', expiresIn: '24h' }
);

console.log(`\n✅  Token generated for role: ${role}\n`);
console.log('Paste this into Postman → Authorization → Bearer Token:\n');
console.log(token);
console.log('\n');