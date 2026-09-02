import {
  VercelRequest,
  VercelResponse,
} from '@vercel/node';

import { redirectURL } from '../src/services/redirect';

const {
  SPOTIFY_CLIENT_ID: client_id,
  STATE: state,
} = process.env;

/**
 * Returns Spotify authorization link, for repo owner only
 *
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 */
export default async function (req: VercelRequest, res: VercelResponse) {
  const scopes: Array<string> = [
    'user-read-playback-position',
    'user-read-recently-played',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-top-read',
  ];

  // Space-separated per the OAuth spec. URLSearchParams encodes it once;
  // joining on '%20' here would double-encode into '%2520' and Spotify would
  // read the whole thing as a single unknown scope.
  const params = new URLSearchParams({
    client_id,
    redirect_uri: redirectURL(req),
    response_type: 'code',
    scope: scopes.join(' '),
    show_dialog: 'false',
    state,
  });

  const url: string = `https://accounts.spotify.com/authorize?${params}`;

  return res.send(url);
};
