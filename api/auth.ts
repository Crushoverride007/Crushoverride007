import {
  VercelRequest,
  VercelResponse,
} from '@vercel/node';

import { redirectURL } from '../src/services/redirect';

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  STATE,
} = process.env;

interface IAuthResponse {
  refresh_token: string,
  access_token: string,
}

/**
 * Retrieves access token, for repo owner only
 *
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 * @returns {IAuthResponse}
 */
export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    code,
    state,
  } = req.query;

  if (code && state && state === STATE) {
    const body = new URLSearchParams({
      code: String(code),
      redirect_uri: redirectURL(req),
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
      body,
    });

    const data: any = await response.json();

    // Spotify answers 400 with a JSON body rather than throwing, so an
    // unchecked read here would return `{}` and look like a silent success.
    if (!response.ok) {
      return res.status(response.status).send(data);
    }

    const result: IAuthResponse = {
      refresh_token: data.refresh_token,
      access_token: data.access_token,
    };

    return res.send(result);
  }

  return res.send(false);
};
