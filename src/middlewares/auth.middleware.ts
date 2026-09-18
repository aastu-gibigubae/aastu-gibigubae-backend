import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';

/**
 * The shape we expect the SSO service's JWT payload to carry.
 * Adjust field names once you see a real token from SSO — this is a
 * best guess based on the SRS's User model (id, role).
 */
export interface AuthenticatedUser {
  userId: string;
  role: 'ADMIN' | 'SUB_ADMIN' | 'STUDENT';
  [claim: string]: unknown;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * How the middleware gets the public key to verify against.
 * - Pass a string: static key (current plan — given to us via env var).
 * - Pass an async function: e.g. fetch from a JWKS endpoint later.
 * This is the one seam designed for "we don't know the final contract yet."
 */
export type KeyProvider = string | (() => Promise<string>);

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) return null;

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token || token.trim().length === 0) {
    return null;
  }
  return token.trim();
}

function normalizeUser(decoded: JwtPayload): AuthenticatedUser {
  // Tolerate either a custom "userId" claim or the standard "sub" claim,
  // since we don't yet know exactly which one SSO will issue.
  const userId = (decoded.userId as string) ?? decoded.sub;
  const role = decoded.role as AuthenticatedUser['role'];

  if (!userId) {
    throw new AppError(401, 'Token payload is missing a user identifier');
  }
  if (!role) {
    throw new AppError(401, 'Token payload is missing a role claim');
  }

  return { ...decoded, userId, role };
}

/**
 * Builds the JWT verification middleware.
 *
 * Usage (static key, current plan):
 *   import { config } from '../../config/config';
 *   const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);
 *
 * Usage (future JWKS-style key resolution):
 *   const authenticate = createAuthMiddleware(fetchCurrentSsoPublicKey);
 */
export function createAuthMiddleware(keyProvider: KeyProvider) {
  return async function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        throw new AppError(401, 'Missing or malformed Authorization header');
      }

      const publicKey =
        typeof keyProvider === 'string' ? keyProvider : await keyProvider();

      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'], // pin the algorithm — never trust the token's own header
      });

      if (typeof decoded === 'string') {
        throw new AppError(401, 'Unexpected token payload format');
      }

      req.user = normalizeUser(decoded);
      next();
    } catch (err) {
      next(toAuthError(err));
    }
  };
}

export function createOptionalAuthMiddleware(keyProvider: KeyProvider) {
  return async function optionalAuthenticate(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        return next();
      }

      const publicKey =
        typeof keyProvider === 'string' ? keyProvider : await keyProvider();

      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });

      if (typeof decoded !== 'string') {
        req.user = normalizeUser(decoded);
      }
      next();
    } catch (err) {
      // If token is invalid/expired, we just ignore it for optional auth, or we could throw.
      // Usually, optional auth should still reject invalid tokens, but let's just proceed without a user
      // or maybe we should throw so the frontend knows the token is dead?
      // "If a valid JWT happens to be present... The endpoint must continue to work fully without a JWT."
      // We'll throw if it's invalid so the client knows they need to refresh, but if it's completely missing, we continue.
      next(toAuthError(err));
    }
  };
}

function toAuthError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof jwt.TokenExpiredError) {
    return new AppError(401, 'Token has expired');
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return new AppError(401, 'Invalid token');
  }
  return new AppError(401, 'Authentication failed');
}

/**
 * Role guard — separate from AdminScope (per-module Sub-Admin permissions),
 * which is a later, separate middleware. This only checks the coarse
 * ADMIN / SUB_ADMIN / STUDENT role claim already attached by authenticate().
 */
export function requireRole(...allowedRoles: AuthenticatedUser['role'][]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'Not authenticated'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient role privileges'));
    }
    next();
  };
}