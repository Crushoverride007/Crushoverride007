import React from 'react';

import ConvertSVG from '../ConvertSVG';

export type TopPlayedTheme = 'light' | 'dark';

export interface ITopPlayedProps {
  trackLists: Array<Array<IConvertedTrack>>,
  theme?: TopPlayedTheme,
}

/** Spotify's own definitions for the three time ranges. */
const TITLES: Array<string> = ['All time', 'Last 6 months', 'Last 4 weeks'];

const PALETTES: Record<TopPlayedTheme, Record<string, string>> = {
  light: {
    card: '#ffffff',
    cardBorder: '#d0d7de',
    text: '#1f2328',
    muted: '#656d76',
    faint: '#8c959f',
    accent: '#1db954',
    rule: '#d8dee4',
    shadow: 'rgba(31,35,40,.08)',
  },
  dark: {
    card: '#161b22',
    cardBorder: '#30363d',
    text: '#e6edf3',
    muted: '#8b949e',
    faint: '#6e7681',
    accent: '#1db954',
    rule: '#21262d',
    shadow: 'rgba(0,0,0,.35)',
  },
};

const SPOTIFY_ICON = 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z';

/**
 * Top Played
 * Three ranked lists of tracks, one per Spotify time range.
 */
export const TopPlayed: React.FC<ITopPlayedProps> = ({
  trackLists,
  theme = 'light',
}: ITopPlayedProps) => {
  const p = PALETTES[theme] ?? PALETTES.light;

  return (
    <ConvertSVG
      width="800"
      height="420">
      <div className="wrap">
        <div className="header">
          <svg xmlns="http://www.w3.org/2000/svg" className="mark" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d={SPOTIFY_ICON} fill={p.accent} />
          </svg>
          <span className="heading">Top played</span>
          <span className="source">Spotify</span>
        </div>

        <div className="columns">
          {trackLists.map((list, term) => (
            <div
              key={term}
              className="column">
              <div className="title">{TITLES[term]}</div>

              {list.map((track, trackIndex) => (
                <a
                  key={`${term}-${trackIndex}`}
                  className={`track${trackIndex === 0 ? ' first' : ''}`}
                  href={track.href}
                  style={{ animationDelay: `${120 + trackIndex * 70}ms` }}>
                  <span className="rank">{trackIndex + 1}</span>
                  <img
                    className="cover"
                    src={track.cover ?? null}
                    width="44"
                    height="44"
                    alt="" />
                  <span className="details">
                    <span className="name">{track.track ?? ''}</span>
                    <span className="artist">{track.artist}</span>
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .wrap {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            color: ${p.text};
            padding: 4px 8px;
          }

          .header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 8px 14px;
            opacity: 0;
            animation: appear 300ms ease-out forwards;
          }

          .mark { flex: none; }

          .heading {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -.01em;
          }

          .source {
            margin-left: auto;
            font-size: 12px;
            font-weight: 500;
            color: ${p.faint};
            letter-spacing: .04em;
            text-transform: uppercase;
          }

          .columns {
            display: flex;
            gap: 14px;
          }

          .column {
            flex: 1 1 0;
            min-width: 0;
          }

          .title {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: ${p.muted};
            padding: 0 8px 8px;
            margin-bottom: 8px;
            border-bottom: 1px solid ${p.rule};
            opacity: 0;
            animation: appear 300ms ease-out 60ms forwards;
          }

          a { color: inherit; text-decoration: none; cursor: pointer; }

          .track {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px 8px 8px;
            margin-bottom: 6px;
            border-radius: 8px;
            background: ${p.card};
            border: 1px solid ${p.cardBorder};
            box-shadow: 0 1px 2px ${p.shadow};
            opacity: 0;
            animation: appear 320ms ease-out forwards;
          }

          .track.first { border-color: ${p.accent}; }

          .rank {
            flex: none;
            width: 16px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            color: ${p.faint};
          }

          .track.first .rank { color: ${p.accent}; }

          .cover {
            flex: none;
            border-radius: 6px;
            background: ${p.rule};
          }

          img:not([src]) {
            content: url("data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
          }

          .details {
            display: flex;
            flex-direction: column;
            min-width: 0;
            line-height: 1.35;
          }

          .name, .artist {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .name { font-size: 13px; font-weight: 600; }
          .artist { font-size: 12px; color: ${p.muted}; }

          @keyframes appear {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </ConvertSVG>
  );
};
