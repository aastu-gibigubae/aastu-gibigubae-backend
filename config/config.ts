import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env against config/.env.example.`
    );
  }
  return value;
}

/**
 * PEM keys often get stored in .env as a single line with literal "\n"
 * sequences instead of real newlines (some hosting dashboards force this).
 * This normalizes either form so jsonwebtoken doesn't choke on a malformed key.
 */
function normalizePem(value: string): string {
  return value.includes('\\n') ? value.replace(/\\n/g, '\n') : value;
}

export const config = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : ['http://localhost:3000'],
  // Given to us by the SSO team. If they later move to a JWKS endpoint
  // instead of a static key, only this file + the key-provider wiring in
  // app.ts need to change — the middleware itself doesn't care.
  JWT_PUBLIC_KEY: normalizePem(required('JWT_PUBLIC_KEY')),
};