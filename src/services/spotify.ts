
const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic: string = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const Authorization: string = `Basic ${basic}`;

/**
 * Uses my refresh token to get a brand new spotify auth token!
 *
 * @returns {Promise<string>} Authorization header for Spotify requests
 */
async function getAuthorizationToken(): Promise<string> {
  const url: URL = new URL('https://accounts.spotify.com/api/token');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
  });

  const response: IAuthorizationTokenResponse = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  }).then((r) => r.json() as Promise<IAuthorizationTokenResponse>);

  return `Bearer ${response.access_token}`;
}

/**
 * Requests top played tracks from Spotify
 *
 * @param {string} timeRange Spotify param for top played time range
 * @returns {Promise<Array<ITrackObject>>} Array of Spotify track objects
 */
export async function topPlayed(timeRange: string): Promise<Array<ITrackObject>> {
  const Authorization: string = await getAuthorizationToken();
  const response: Response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=${timeRange}`, {
    headers: {
      Authorization,
    },
  });

  const { status } = response;

  if (status === 200) {
    const data = await response.json() as IPagingObject<ITrackObject>;
    return data.items;
  } else {
    return [];
  }
};
