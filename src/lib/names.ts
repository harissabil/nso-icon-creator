const NAME_OVERRIDES: Record<string, string> = {
  'animal-crossing-new-horizons': 'Animal Crossing: New Horizons',
  default: 'Nintendo Switch',
  'detective-pikachu-returns': 'Detective Pikachu Returns',
  'donkey-kong-bananza': 'Donkey Kong Bananza',
  'donkey-kong-country-returns-hd': 'Donkey Kong Country Returns HD',
  'drag-x-drive': 'Drag x Drive',
  'earthbound-beginnings': 'EarthBound Beginnings',
  earthbound: 'EarthBound',
  'endless-ocean-luminous': 'Endless Ocean Luminous',
  'fire-emblem-engage': 'Fire Emblem Engage',
  'fire-emblem-fortunes-weave': "Fire Emblem: Fortune's Weave",
  'fire-emblem-three-houses': 'Fire Emblem: Three Houses',
  'fzero-99': 'F-ZERO 99',
  'game-boy-advance-nintendo-switch-online': 'Game Boy Advance – Nintendo Switch Online',
  'game-boy-nintendo-switch-online': 'Game Boy – Nintendo Switch Online',
  'happy-halloween': 'Happy Halloween',
  'happy-holidays': 'Happy Holidays',
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
  'nintendo-64-nintendo-switch-online': 'Nintendo 64 – Nintendo Switch Online',
  'nintendo-entertainment-system-nintendo-switch-online':
    'Nintendo Entertainment System – Nintendo Switch Online',
  'nintendo-gamecube-nintendo-classics': 'Nintendo GameCube – Nintendo Classics',
  'nintendo-switch-2': 'Nintendo Switch 2',
  'nintendo-switch-sports': 'Nintendo Switch Sports',
  'nintendo-world-championships-nes-edition': 'Nintendo World Championships: NES Edition',
  'paper-mario-the-thousand-year-door': 'Paper Mario: The Thousand-Year Door',
  pikmin: 'Pikmin',
  'pokemon-legends-za': 'Pokémon Legends: Z-A',
  'pokemon-pokopia': 'Pokémon Pokopia',
  'pokemon-scarlet-and-pokemon-violet': 'Pokémon Scarlet and Pokémon Violet',
  'princess-peach-showtime': 'Princess Peach: Showtime!',
  'rhythm-heaven-groove': 'Rhythm Heaven Groove',
  'splatoon-2': 'Splatoon 2',
  'splatoon-3': 'Splatoon 3',
  'splatoon-raiders': 'Splatoon Raiders',
  'splatoon-series': 'Splatoon Series',
  'star-fox': 'Star Fox',
  'super-mario-3d-world-and-bowsers-fury': "Super Mario 3D World + Bowser's Fury",
  'super-mario-bros-wonder': 'Super Mario Bros. Wonder',
  'super-mario-galaxy-series': 'Super Mario Galaxy',
  'super-mario-odyssey': 'Super Mario Odyssey',
  'super-mario-party-jamboree': 'Super Mario Party Jamboree',
  'super-mario-rpg': 'Super Mario RPG',
  'super-nintendo-entertainment-system-nintendo-switch-online':
    'Super Nintendo Entertainment System – Nintendo Switch Online',
  'the-legend-of-zelda-breath-of-the-wild': 'The Legend of Zelda: Breath of the Wild',
  'the-legend-of-zelda-echoes-of-wisdom': 'The Legend of Zelda: Echoes of Wisdom',
  'the-legend-of-zelda-tears-of-the-kingdom': 'The Legend of Zelda: Tears of the Kingdom',
  'tomodachi-life-living-the-dream': 'Tomodachi Life: Living the Dream',
  'virtual-boy-nintendo-classics': 'Virtual Boy – Nintendo Classics',
  'warioware-move-it': "WarioWare: Move It!",
  'xenoblade-chronicles-3': 'Xenoblade Chronicles 3™',
  'yoshi-and-the-mysterious-book': 'Yoshi and the Mysterious Book',
};

const TRADEMARK_SLUGS = new Set([
  'xenoblade-chronicles-3',
  'animal-crossing-new-horizons',
  'splatoon-2',
  'splatoon-3',
  'splatoon-raiders',
  'pokemon-pokopia',
  'pokemon-legends-za',
  'pokemon-scarlet-and-pokemon-violet',
]);

export function displayName(slug: string): string {
  if (NAME_OVERRIDES[slug]) return NAME_OVERRIDES[slug];
  const titled = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return TRADEMARK_SLUGS.has(slug) ? `${titled}™` : titled;
}

export function sortCategories<T extends { slug: string; name: string; addedAt?: string | null }>(
  categories: T[],
): T[] {
  return [...categories].sort((a, b) => {
    const ad = a.addedAt ?? '';
    const bd = b.addedAt ?? '';
    if (ad !== bd) return bd.localeCompare(ad);
    return a.name.localeCompare(b.name);
  });
}

export function plateColor(slug: string): string {
  if (slug === 'default') return '#141414';
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 38% 18%)`;
}
