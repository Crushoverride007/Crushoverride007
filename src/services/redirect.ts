import { VercelRequest } from '@vercel/node';

/**
 * The redirect URI Spotify sends the authorization code back to.
 *
 * It has to be byte-identical in /api/login and /api/auth, and identical again
 * to what is registered on the Spotify app - Spotify matches it exactly.
 * Deriving it in one place is the only way to keep those three in step.
 *
 * Spotify prohibits `localhost` and requires HTTPS off the loopback, so the
 * old hardcoded `http://localhost:3000/api/auth` cannot be registered at all
 * any more. Prefer an explicit REDIRECT_URI, fall back to the deployment's own
 * HTTPS origin, and only then to the loopback literal for `vercel dev`.
 */
export function redirectURL(req: { headers: VercelRequest['headers'] }): string {
  if (process.env.REDIRECT_URI) {
    return process.env.REDIRECT_URI;
  }

  // The production alias, e.g. crushoverride007.vercel.app. This is the one
  // registered with Spotify. VERCEL_URL is deliberately not used: it is the
  // per-deployment hostname (crushoverride007-a1b2c3.vercel.app), which
  // changes on every push and would never match the registered URI.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/auth`;
  }

  const host = req.headers.host ?? '127.0.0.1:3000';

  return `http://${host}/api/auth`;
}
