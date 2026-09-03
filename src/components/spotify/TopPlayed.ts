/**
 * Top Played card, rendered as plain SVG (no foreignObject) so it scales
 * correctly everywhere, including Safari on iOS.
 */

export type TopPlayedTheme = 'light' | 'dark';
export type TopPlayedLayout = 'wide' | 'stack';

export interface ITopPlayedProps {
  trackLists: Array<Array<IConvertedTrack>>,
  theme?: TopPlayedTheme,
  layout?: TopPlayedLayout,
}

interface IPalette {
  card: string,
  cardBorder: string,
  text: string,
  muted: string,
  faint: string,
  accent: string,
  rule: string,
}

const PALETTES: Record<TopPlayedTheme, IPalette> = {
  light: { card: '#ffffff', cardBorder: '#d0d7de', text: '#1f2328', muted: '#656d76', faint: '#8c959f', accent: '#1db954', rule: '#d8dee4' },
  dark: { card: '#161b22', cardBorder: '#30363d', text: '#e6edf3', muted: '#8b949e', faint: '#6e7681', accent: '#1db954', rule: '#21262d' },
};

/** Spotify's own definitions for the three time ranges. */
const TITLES: Array<string> = ['All time', 'Last 6 months', 'Last 4 weeks'];

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const SPOTIFY_ICON = 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z';

// Geometry shared by both layouts.
const PAD = 12;
const ROW_H = 62;
const ROW_GAP = 6;
const COVER = 44;
const HEADER_H = 46;
const TITLE_H = 30;
const AVG_CHAR = 0.56;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(text: string, fontSize: number, maxWidth: number): string {
  const width = (t: string) => t.length * fontSize * AVG_CHAR;
  if (width(text) <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && width(`${out}…`) > maxWidth) out = out.slice(0, -1);
  return `${out}…`;
}

function header(width: number, p: IPalette): string {
  return `<g class="a" style="animation-delay:0ms">
    <g transform="translate(${PAD + 4}, 12)"><path d="${SPOTIFY_ICON}" transform="scale(0.917)" fill="${p.accent}" /></g>
    <text x="${PAD + 34}" y="28" class="heading">Top played</text>
    <text x="${width - PAD - 4}" y="27" class="source" text-anchor="end">SPOTIFY</text>
  </g>`;
}

function columnTitle(x: number, y: number, w: number, title: string, p: IPalette): string {
  return `<g class="a" style="animation-delay:60ms">
    <text x="${x + 8}" y="${y + 12}" class="title">${title.toUpperCase()}</text>
    <line x1="${x}" y1="${y + TITLE_H - 8}" x2="${x + w}" y2="${y + TITLE_H - 8}" stroke="${p.rule}" />
  </g>`;
}

function trackRow(track: IConvertedTrack, x: number, y: number, w: number, index: number, id: string, p: IPalette): string {
  const first = index === 0;
  const coverX = x + 8 + 16 + 10;
  const textX = coverX + COVER + 10;
  const textW = x + w - 10 - textX;
  const title = escapeXml(truncate(track.track ?? '', 13, textW));
  const artist = escapeXml(truncate(track.artist ?? '', 12, textW));
  const delay = 120 + index * 70;
  return `<a href="${escapeXml(track.href)}" target="_blank">
  <g class="a" style="animation-delay:${delay}ms">
    <rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${ROW_H - 1}" rx="8" fill="${p.card}" stroke="${first ? p.accent : p.cardBorder}" />
    <text x="${x + 8 + 8}" y="${y + ROW_H / 2 + 4}" class="rank" text-anchor="middle" fill="${first ? p.accent : p.faint}">${index + 1}</text>
    <clipPath id="${id}"><rect x="${coverX}" y="${y + (ROW_H - COVER) / 2}" width="${COVER}" height="${COVER}" rx="6" /></clipPath>
    <rect x="${coverX}" y="${y + (ROW_H - COVER) / 2}" width="${COVER}" height="${COVER}" rx="6" fill="${p.rule}" />
    ${track.cover ? `<image href="${track.cover}" x="${coverX}" y="${y + (ROW_H - COVER) / 2}" width="${COVER}" height="${COVER}" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice" />` : ''}
    <text x="${textX}" y="${y + 27}" class="name">${title}</text>
    <text x="${textX}" y="${y + 44}" class="artist">${artist}</text>
  </g>
  </a>`;
}

function styles(p: IPalette): string {
  return `<style>
    .heading { font: 600 18px ${FONT}; fill: ${p.text}; letter-spacing: -.01em; }
    .source { font: 500 12px ${FONT}; fill: ${p.faint}; letter-spacing: .06em; }
    .title { font: 600 11px ${FONT}; fill: ${p.muted}; letter-spacing: .08em; }
    .rank { font: 600 12px ${MONO}; }
    .name { font: 600 13px ${FONT}; fill: ${p.text}; }
    .artist { font: 400 12px ${FONT}; fill: ${p.muted}; }
    .a { opacity: 0; animation: appear 320ms ease-out forwards; }
    @keyframes appear { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  </style>`;
}

export function renderTopPlayed({ trackLists, theme = 'light', layout = 'wide' }: ITopPlayedProps): string {
  const p = PALETTES[theme] ?? PALETTES.light;
  const lists = trackLists.slice(0, 3);
  const rows = Math.max(...lists.map((l) => l.length), 0);

  let width: number;
  let height: number;
  let body = '';

  if (layout === 'stack') {
    // One column: each time range under the previous.
    width = 360;
    const colW = width - PAD * 2;
    const sectionH = TITLE_H + rows * (ROW_H + ROW_GAP);
    height = HEADER_H + lists.length * (sectionH + 10) + 2;
    lists.forEach((list, term) => {
      const top = HEADER_H + term * (sectionH + 10);
      body += columnTitle(PAD, top, colW, TITLES[term], p);
      list.forEach((track, i) => {
        body += trackRow(track, PAD, top + TITLE_H + i * (ROW_H + ROW_GAP), colW, i, `c${term}-${i}`, p);
      });
    });
  } else {
    // Three columns side by side.
    width = 800;
    const gap = 14;
    const colW = (width - PAD * 2 - gap * (lists.length - 1)) / lists.length;
    height = HEADER_H + TITLE_H + rows * (ROW_H + ROW_GAP) + 4;
    lists.forEach((list, term) => {
      const x = PAD + term * (colW + gap);
      body += columnTitle(x, HEADER_H, colW, TITLES[term], p);
      list.forEach((track, i) => {
        body += trackRow(track, x, HEADER_H + TITLE_H + i * (ROW_H + ROW_GAP), colW, i, `c${term}-${i}`, p);
      });
    });
  }

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Top played on Spotify">
  ${styles(p)}
  ${header(width, p)}
  ${body}
</svg>`;
}
