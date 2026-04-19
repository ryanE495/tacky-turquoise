export interface Strand {
  name: string;
  variant: string;
  tag: string | null;
  tagHot: boolean;
  tone: string;
}

export const strands: Strand[] = [
  { name: 'Coral Strand',     variant: 'Red Mediterranean', tag: 'New',           tagHot: true,  tone: 'pink' },
  { name: 'Spiny Oyster',     variant: 'Sunset orange',     tag: '1 of 1',        tagHot: false, tone: 'pink' },
  { name: 'Freshwater Pearl', variant: 'Cream + silver',    tag: null,            tagHot: false, tone: 'gold' },
  { name: 'Heishi Shell',     variant: 'Santo Domingo',     tag: 'New',           tagHot: true,  tone: 'cyan' },
  { name: 'Onyx + Turquoise', variant: 'High-contrast',     tag: 'Low stock',     tagHot: false, tone: 'cyan' },
  { name: 'Jet + Silver',     variant: 'Monochrome',        tag: null,            tagHot: false, tone: 'gold' },
  { name: 'Red Jasper',       variant: 'Earth tones',       tag: null,            tagHot: false, tone: 'pink' },
  { name: 'Hematite Shine',   variant: 'Graphite',          tag: 'Made to order', tagHot: false, tone: 'cyan' },
];
