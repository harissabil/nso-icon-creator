import { displayName, sortCategories } from './names';

export type PartKind = 'frames' | 'characters' | 'backgrounds';

export type Category = {
  slug: string;
  name: string;
  bannerUrl: string | null;
  addedAt?: string | null;
  frames: string[];
  characters: string[];
  backgrounds: string[];
};

export type Catalog = {
  source: string;
  generatedAt: string;
  categories: Category[];
};

const STOP = new Set([
  'the',
  'of',
  'and',
  'a',
  'an',
  'to',
  'for',
  'in',
  'plus',
  'nintendo',
  'switch',
  'online',
  'classics',
  'series',
  'edition',
]);

const NO_STORE = new Set([
  'default',
  'happy-halloween',
  'happy-holidays',
  'nintendo-switch-2',
  'splatoon-series',
]);

/** Official Nintendo logo plates — not eShop game headers. */
const BANNER_OVERRIDES: Record<string, string> = {
  default: 'https://www.nintendo.co.jp/common/v2/img/ncommon/_common/logo/switch.svg',
  'nintendo-switch-2':
    'https://upload.wikimedia.org/wikipedia/commons/c/c9/Nintendo_Switch_2_logo.svg',
};

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP.has(w));
}

function bannerBelongsTo(slug: string, url: string | null): boolean {
  if (!url) return false;
  const q = tokens(slug);
  if (!q.length) return false;
  const path = decodeURIComponent(url.toLowerCase());
  const hit = q.filter((w) => path.includes(w)).length;
  return hit / q.length >= 0.8;
}

function keepBanner(slug: string, url: string | null): string | null {
  if (!url) return null;
  if (
    /assets\.nintendo\.com\/image\/upload\/(?:[^/]+\/)*store\/software\//.test(url) ||
    /media\.rawg\.io\//.test(url) ||
    /img-eshop\.cdn\.nintendo\.net\//.test(url)
  ) {
    return url;
  }
  return bannerBelongsTo(slug, url) ? url : null;
}

export function partCount(category: Category): number {
  return category.frames.length + category.characters.length + category.backgrounds.length;
}

export async function loadCatalog(): Promise<Catalog> {
  const res = await fetch(`${import.meta.env.BASE_URL}catalog.json`);
  if (!res.ok) throw new Error('Missing catalog.json — run npm run catalog');
  const data = (await res.json()) as Catalog;
  const named = data.categories.map((c) => ({
    ...c,
    name: displayName(c.slug),
    bannerUrl: BANNER_OVERRIDES[c.slug] ?? (NO_STORE.has(c.slug) ? null : keepBanner(c.slug, c.bannerUrl)),
  }));
  return { ...data, categories: sortCategories(named) };
}

export function getCategory(catalog: Catalog, slug: string): Category | undefined {
  return catalog.categories.find((c) => c.slug === slug);
}
