export type Category = 'necklace' | 'ring' | 'cuff' | 'earring' | 'belt';
export type Stock = 'ok' | 'low' | 'oos';

export interface ShopProduct {
  name: string;
  cat: Category;
  len: number[];
  price: number;
  stone: string;
  artist: string;
  stock: Stock;
  tag: string | null;
  tone: 'cyan' | 'pink' | 'lime' | 'gold';
}

export const shopProducts: ShopProduct[] = [
  { name: 'The Beaded <em>Turquoise</em>', cat: 'necklace', len: [18, 20, 24], price: 640,  stone: 'Kingman',         artist: 'Delvin Begay', stock: 'ok',  tag: 'Featured',     tone: 'cyan' },
  { name: 'Royston <em>Cluster</em>',      cat: 'necklace', len: [20],         price: 1180, stone: 'Royston',         artist: 'Leona Nez',     stock: 'low', tag: '1 of 1',       tone: 'lime' },
  { name: 'Sleeping <em>Beauty</em>',      cat: 'necklace', len: [16, 18],     price: 480,  stone: 'Sleeping Beauty', artist: 'Tom Yazzie',    stock: 'ok',  tag: 'New',          tone: 'cyan' },
  { name: 'Carico <em>Lake</em>',          cat: 'necklace', len: [24, 30],     price: 920,  stone: 'Carico Lake',     artist: 'Ester Tsosie',  stock: 'ok',  tag: null,           tone: 'lime' },
  { name: 'Number <em>Eight</em>',         cat: 'necklace', len: [20],         price: 1560, stone: '#8',              artist: 'Delvin Begay',  stock: 'oos', tag: 'Sold',         tone: 'gold' },
  { name: 'Big <em>Ring</em>',             cat: 'ring',     len: [],           price: 340,  stone: 'Kingman',         artist: 'Leona Nez',     stock: 'ok',  tag: null,           tone: 'cyan' },
  { name: 'Spiderweb <em>Ring</em>',       cat: 'ring',     len: [],           price: 420,  stone: 'Royston',         artist: 'Tom Yazzie',    stock: 'low', tag: 'Low stock',    tone: 'lime' },
  { name: 'Stacked <em>Trio</em>',         cat: 'ring',     len: [],           price: 580,  stone: 'Mixed',           artist: 'Ester Tsosie',  stock: 'ok',  tag: null,           tone: 'pink' },
  { name: 'Heavy <em>Cuff</em>',           cat: 'cuff',     len: [],           price: 1340, stone: 'Kingman',         artist: 'Delvin Begay',  stock: 'ok',  tag: 'Featured',     tone: 'cyan' },
  { name: 'Etched <em>Cuff</em>',          cat: 'cuff',     len: [],           price: 760,  stone: 'Silver',          artist: 'Leona Nez',     stock: 'ok',  tag: null,           tone: 'gold' },
  { name: 'Squash <em>Blossoms</em>',      cat: 'earring',  len: [],           price: 380,  stone: 'Sleeping Beauty', artist: 'Ester Tsosie',  stock: 'ok',  tag: null,           tone: 'cyan' },
  { name: 'Concho <em>Belt</em>',          cat: 'belt',     len: [],           price: 2240, stone: 'Mixed',           artist: 'Tom Yazzie',    stock: 'low', tag: '1 of 1',       tone: 'gold' },
];
