/**
 * Local-only helper: signs a test token with keys/private.pem so you can
 * hit your protected routes with a real, valid-looking JWT without a live
 * SSO service. Run: npx ts-node scripts/generate-test-token.ts [role]
 */
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const role = process.argv[2] ?? 'ADMIN';
const privateKeyPath = path.join(__dirname, '..', 'keys', 'private.pem');

if (!fs.existsSync(privateKeyPath)) {
  console.error(
    'keys/private.pem not found. Generate one first:\n' +
      '  mkdir -p keys\n' +
      '  openssl genrsa -out keys/private.pem 2048\n' +
      '  openssl rsa -in keys/private.pem -pubout -out keys/public.pem'
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
  { algorithm: 'RS256', expiresIn: '1h' }
);

console.log(token);