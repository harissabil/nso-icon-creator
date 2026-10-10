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

/** Categories that are not a single eShop game — never pick a random store header. */
export const NO_STORE = new Set([
  'default',
  'happy-halloween',
  'happy-holidays',
  'nintendo-switch-2',
  'splatoon-series',
]);

/** Official Nintendo logo plates — not eShop game headers. */
export const BANNER_OVERRIDES = {
  default: 'https://www.nintendo.co.jp/common/v2/img/ncommon/_common/logo/switch.svg',
  'nintendo-switch-2':
    'https://upload.wikimedia.org/wikipedia/commons/c/c9/Nintendo_Switch_2_logo.svg',
};

export const SEARCH_NAMES = {
  'animal-crossing-new-horizons': 'Animal Crossing: New Horizons',
  'detective-pikachu-returns': 'Detective Pikachu Returns',
  'donkey-kong-bananza': 'Donkey Kong Bananza',
  'donkey-kong-country-returns-hd': 'Donkey Kong Country Returns HD',
  'drag-x-drive': 'Drag x Drive',
  'earthbound-beginnings': 'EarthBound Beginnings',
  earthbound: 'EarthBound',
  'endless-ocean-luminous': 'Endless Ocean Luminous',
  'fire-emblem-engage': 'Fire Emblem Engage',
  'fire-emblem-fortunes-weave': "Fire Emblem: Fortune's Weave",
  'fzero-99': 'F-ZERO 99',
  'game-boy-advance-nintendo-switch-online': 'Game Boy Advance Nintendo Switch Online',
  'game-boy-nintendo-switch-online': 'Game Boy Nintendo Switch Online',
  'kirby-air-riders': 'Kirby Air Riders',
  'kirby-and-the-forgotten-land': 'Kirby and the Forgotten Land',
  'kirbys-dream-buffet': "Kirby's Dream Buffet",
  'kirbys-return-to-dream-land-deluxe': "Kirby's Return to Dream Land Deluxe",
  'luigis-mansion-2-hd': "Luigi's Mansion 2 HD",
  'mario-kart-8-deluxe': 'Mario Kart 8 Deluxe',
  'mario-kart-world': 'Mario Kart World',
  'mario-luigi-brothership': 'Mario & Luigi: Brothership',
  'mario-strikers-battle-league': 'Mario Strikers: Battle League',
  'mario-tennis-fever': 'Mario Tennis Fever',
  'mario-vs-donkey-kong': 'Mario vs. Donkey Kong',
  'metroid-dread': 'Metroid Dread',
  'metroid-prime-4-beyond': 'Metroid Prime 4: Beyond',
  'metroid-prime-remastered': 'Metroid Prime Remastered',
  mother3: 'MOTHER 3',
  'nintendo-64-nintendo-switch-online': 'Nintendo 64 Nintendo Switch Online',
  'nintendo-entertainment-system-nintendo-switch-online':
    'Nintendo Entertainment System Nintendo Switch Online',
  'nintendo-gamecube-nintendo-classics': 'Nintendo GameCube Nintendo Classics',
  'nintendo-switch-sports': 'Nintendo Switch Sports',
  'nintendo-world-championships-nes-edition': 'Nintendo World Championships: NES Edition',
  'paper-mario-the-thousand-year-door': 'Paper Mario: The Thousand-Year Door',
  pikmin: 'Pikmin 1',
  'pokemon-legends-za': 'Pokémon Legends: Z-A',
  'pokemon-pokopia': 'Pokémon Pokopia',
  'pokemon-scarlet-and-pokemon-violet': 'Pokémon Scarlet and Pokémon Violet',
  'princess-peach-showtime': 'Princess Peach: Showtime!',
  'rhythm-heaven-groove': 'Rhythm Heaven Groove',
  'splatoon-2': 'Splatoon 2',
  'splatoon-3': 'Splatoon 3',
  'splatoon-raiders': 'Splatoon Raiders',
  'star-fox': 'Star Fox',
  'super-mario-3d-world-and-bowsers-fury': "Super Mario 3D World + Bowser's Fury",
  'super-mario-bros-wonder': 'Super Mario Bros. Wonder',
  'super-mario-galaxy-series': 'Super Mario Galaxy',
  'super-mario-odyssey': 'Super Mario Odyssey',
  'super-mario-party-jamboree': 'Super Mario Party Jamboree',
  'super-mario-rpg': 'Super Mario RPG',
  'super-nintendo-entertainment-system-nintendo-switch-online':
    'Super Nintendo Entertainment System Nintendo Switch Online',
  'the-legend-of-zelda-breath-of-the-wild': 'The Legend of Zelda: Breath of the Wild',
  'the-legend-of-zelda-echoes-of-wisdom': 'The Legend of Zelda: Echoes of Wisdom',
  'the-legend-of-zelda-tears-of-the-kingdom': 'The Legend of Zelda: Tears of the Kingdom',
  'tomodachi-life-living-the-dream': 'Tomodachi Life: Living the Dream',
  'virtual-boy-nintendo-classics': 'Virtual Boy Nintendo Classics',
  'warioware-move-it': 'WarioWare: Move It!',
  'xenoblade-chronicles-3': 'Xenoblade Chronicles 3',
  'yoshi-and-the-mysterious-book': 'Yoshi and the Mysterious Book',
};

export function tokens(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP.has(w));
}

export function titleScore(query, title) {
  const q = tokens(query);
  const t = new Set(tokens(title));
  if (!q.length || !t.size) return 0;
  const hit = q.filter((w) => t.has(w)).length;
  return hit / q.length;
}

const MERCH_TITLE =
  /postcard|amiibo|upgrade pack|expansion pass|happy home paradise|t-shirt|hoodie|pullover|memo pad/i;

function storeKey(urlKey) {
  return String(urlKey)
    .toLowerCase()
    .split('/')
    .pop()
    .replace(/-switch(?:-2)?$/, '');
}

/** Sequels/spin-offs of a -series category (Splatoon 3 is its own card). */
function isOtherGameInSeries(slug, title, urlKey) {
  if (!String(slug).endsWith('-series')) return false;
  const canonical = slug.replace(/-series$/, '');
  const key = storeKey(urlKey || title);
  if (key === canonical || key === slug) return false;
  return key.startsWith(`${canonical}-`);
}

function extraNoise(slug, title, urlKey) {
  if (MERCH_TITLE.test(title)) return 10;
  const t = String(title).toLowerCase();
  if (/bundle|upgrade pack|expansion pass/.test(t)) return 8;

  const key = storeKey(urlKey);
  const canonical = slug.replace(/-series$/, '');
  if (key === slug || key === canonical) return 0;
  if (key.startsWith(`${canonical}-`)) {
    return tokens(key.slice(canonical.length + 1)).length + 2;
  }

  const allowed = new Set(tokens(slug));
  const extras = tokens(title).filter((w) => !allowed.has(w)).length;
  return extras + 4;
}

export function bannerBelongsTo(slug, url) {
  if (!url) return false;
  const q = tokens(slug);
  if (!q.length) return false;
  const path = decodeURIComponent(String(url).toLowerCase());
  const hit = q.filter((w) => path.includes(w)).length;
  return hit / q.length >= 0.8;
}

/** Newer store listings use hashed Cloudinary paths with no game name in the URL. */
export function isHashedStoreImage(url) {
  const value = String(url || '');
  return (
    /assets\.nintendo\.com\/image\/upload\/(?:[^/]+\/)*store\/software\//.test(value) ||
    /media\.rawg\.io\//.test(value) ||
    /img-eshop\.cdn\.nintendo\.net\//.test(value)
  );
}

export function bannerUrlFromHit(hit) {
  const legacy = hit?.horizontalHeaderImage || hit?.headerImage || hit?.background_image || null;
  if (typeof legacy === 'string' && /^https?:\/\//i.test(legacy)) return legacy;
  const product = hit?.productImage;
  if (typeof product === 'string' && product.includes('store/software/')) {
    const path = product.replace(/^\/+/, '');
    return `https://assets.nintendo.com/image/upload/ar_16:9,c_fill,g_auto,w_1280/${path}`;
  }
  return null;
}

export function searchName(slug) {
  if (SEARCH_NAMES[slug]) return SEARCH_NAMES[slug];
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function pickBanner(query, hits, slug = query) {
  const ranked = [];
  for (const hit of hits ?? []) {
    const title = hit.title || hit.name || '';
    if (MERCH_TITLE.test(title)) continue;
    const url = bannerUrlFromHit(hit);
    if (!url) continue;
    const key = hit.urlKey || hit.url || title;
    if (isOtherGameInSeries(slug, title, key)) continue;
    ranked.push({
      title,
      url,
      key,
      score: titleScore(query, title),
      noise: extraNoise(slug, title, key),
    });
  }
  ranked.sort((a, b) => a.noise - b.noise || b.score - a.score);
  for (const best of ranked) {
    if (best.score < 0.85) continue;
    const belongs =
      bannerBelongsTo(slug, best.url) ||
      bannerBelongsTo(query, best.url) ||
      bannerBelongsTo(slug, best.key) ||
      bannerBelongsTo(query, best.key);
    if (belongs || isHashedStoreImage(best.url)) return best;
  }
  return null;
}
