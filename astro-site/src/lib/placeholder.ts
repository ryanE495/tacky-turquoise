// Warm daylight placeholder — cream background + ink-colored label box.
// Replace data-URI calls with real photo paths (e.g. "/images/hero.jpg") when ready.

type Tone = 'cyan' | 'pink' | 'lime' | 'gold' | 'mixed';

const STROKE: Record<Tone, string> = {
  cyan:  '#1d7a82',  // deep turquoise
  pink:  '#e04a94',
  lime:  '#7fa83a',
  gold:  '#d4a332',
  mixed: '#1d7a82',
};

export function placeholder(label: string, w: number, h: number, tone: Tone = 'cyan') {
  const stroke = STROKE[tone];
  const safe = String(label).replace(/&/g, '+').replace(/</g, '').toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <radialGradient id='bg' cx='50%' cy='55%' r='70%'>
        <stop offset='0%' stop-color='#f5ecd8'/>
        <stop offset='60%' stop-color='#ebdfc5'/>
        <stop offset='100%' stop-color='#d8c9a8'/>
      </radialGradient>
      <pattern id='dots' width='32' height='32' patternUnits='userSpaceOnUse'>
        <circle cx='1' cy='1' r='1' fill='${stroke}' opacity='0.20'/>
      </pattern>
    </defs>
    <rect width='${w}' height='${h}' fill='url(#bg)'/>
    <rect width='${w}' height='${h}' fill='url(#dots)'/>
    <rect x='${w/2 - 150}' y='${h/2 - 30}' width='300' height='60' fill='none' stroke='${stroke}' stroke-width='1.5' rx='6'/>
    <text x='${w/2}' y='${h/2 + 6}' font-family='JetBrains Mono, monospace' font-size='14' letter-spacing='2.5' fill='${stroke}' text-anchor='middle' font-weight='500'>${safe}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
