import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { generateKeyPairSync } from 'crypto';
import { createAuthMiddleware, createOptionalAuthMiddleware, requireRole } from '../../src/middlewares/auth.middleware.js';
import { errorHandler } from '../../src/middlewares/errorHandler.middleware.js';

function makeRsaKeyPair() {
  return generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}

const { publicKey, privateKey } = makeRsaKeyPair();

function buildTestApp() {
  const app = express();
  const authenticate = createAuthMiddleware(publicKey);

  app.get('/protected', authenticate, (req, res) => {
    res.json({ user: req.user });
  });

  app.get('/admin-only', authenticate, requireRole('ADMIN'), (_req, res) => {
    res.json({ ok: true });
  });

  app.use(errorHandler);
  return app;
}

function signToken(payload: Record<string, unknown>, options: jwt.SignOptions = {}) {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h',
    ...options,
  });
}

describe('auth middleware', () => {
  it('rejects a request with no Authorization header', async () => {
    const res = await request(buildTestApp()).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/missing or malformed/i);
  });

  it('rejects a malformed Authorization header (wrong scheme)', async () => {
    const res = await request(buildTestApp())
      .get('/protected')
      .set('Authorization', 'Token some.value.here');
    expect(res.status).toBe(401);
  });

  it('rejects a token signed by a different key (forged/wrong-issuer token)', async () => {
    const { privateKey: otherPrivateKey } = makeRsaKeyPair();
    const forged = jwt.sign({ userId: 'u1', role: 'ADMIN' }, otherPrivateKey, {
      algorithm: 'RS256',
    });
    const res = await request(buildTestApp())
      .get('/protected')
      .set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid token/i);
  });

  it('rejects an expired token', async () => {
    const token = signToken({ userId: 'u1', role: 'ADMIN' }, { expiresIn: '-10s' });
    const res = await request(buildTestApp())
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/expired/i);
  });

  it('rejects a validly-signed token missing a role claim', async () => {
    const token = signToken({ userId: 'u1' });
    const res = await request(buildTestApp())
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/role claim/i);
  });

  it('accepts a valid token and attaches the user to the request', async () => {
    const token = signToken({ userId: 'u1', role: 'STUDENT' });
    const res = await request(buildTestApp())
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.userId).toBe('u1');
    expect(res.body.user.role).toBe('STUDENT');
  });

  it('falls back to the standard "sub" claim if "userId" is absent', async () => {
    const token = signToken({ sub: 'u-sub-id', role: 'STUDENT' });
    const res = await request(buildTestApp())
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.userId).toBe('u-sub-id');
  });

  it('blocks a non-admin from an admin-only route (403, not 401)', async () => {
    const token = signToken({ userId: 'u2', role: 'STUDENT' });
    const res = await request(buildTestApp())
      .get('/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('allows an admin through an admin-only route', async () => {
    const token = signToken({ userId: 'u3', role: 'ADMIN' });
    const res = await request(buildTestApp())
      .get('/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('createOptionalAuthMiddleware', () => {
  function buildOptionalApp() {
    const app = express();
    const optionalAuth = createOptionalAuthMiddleware(publicKey);

    app.get('/optional', optionalAuth, (req, res) => {
      res.json({ user: (req as any).user || null });
    });

    app.use(errorHandler);
    return app;
  }

  it('passes through anonymously if no token is provided', async () => {
    const res = await request(buildOptionalApp()).get('/optional');
    expect(res.status).toBe(200);
    expect(res.body.user).toBeNull();
  });

  it('rejects an invalid token', async () => {
    const res = await request(buildOptionalApp())
      .get('/optional')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });

  it('attaches user if valid token is provided', async () => {
    const token = signToken({ userId: 'u1', role: 'STUDENT' });
    const res = await request(buildOptionalApp())
      .get('/optional')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.userId).toBe('u1');
  });
});