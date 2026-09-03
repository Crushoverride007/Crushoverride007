import {
  VercelRequest,
  VercelResponse,
} from '@vercel/node';

import {
  renderTopPlayed,
  TopPlayedLayout,
  TopPlayedTheme,
} from '../src/components/spotify/TopPlayed';
import { topPlayed } from '../src/services/spotify';

/**
 * Returns an image displaying top 5 played tracks for 3 time ranges.
 * Query: ?theme=dark|light, ?layout=wide|stack (stack is one column, for phones).
 */
export default async function (req: VercelRequest, res: VercelResponse) {
  const theme: TopPlayedTheme = req.query.theme === 'dark' ? 'dark' : 'light';
  const layout: TopPlayedLayout = req.query.layout === 'stack' ? 'stack' : 'wide';

  const topPlayedTracks: Array<Array<ITrackObject>> = [
    await topPlayed('long_term'),
    await topPlayed('medium_term'),
    await topPlayed('short_term'),
  ];

  // Trim the Spotify objects down to what the card needs, with covers inlined.
  const convertedTracks: Array<Array<IConvertedTrack>> = await Promise.all(topPlayedTracks.map(async (trackList) => {
    return Promise.all(trackList.map(async (track) => {
      const { images = [] } = track.album || {};
      const url: string = images[images.length - 1]?.url;

      let cover: string = null;
      if (url) {
        const buff: ArrayBuffer = await (await fetch(url)).arrayBuffer();
        cover = `data:image/jpeg;base64,${Buffer.from(buff).toString('base64')}`;
      }

      return {
        cover,
        artist: (track.artists || []).map(({ name }) => name).join(', '),
        track: track.name,
        href: track.external_urls.spotify,
      };
    }));
  }));

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  return res.send(renderTopPlayed({ trackLists: convertedTracks, theme, layout }));
}
