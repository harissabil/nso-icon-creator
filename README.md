# NSO Icon Creator
[![Deploy](https://github.com/harissabil/nso-icon-creator/actions/workflows/deploy.yml/badge.svg)](https://github.com/harissabil/nso-icon-creator/actions/workflows/deploy.yml)

Pick a game, stack a background, a character and a frame, then download the
result as a PNG.

## Screenshot

![](https://github.com/user-attachments/assets/bd672087-4786-4d36-bf69-f7ae5a64f915)

<details>
  <summary><b>More Screenshots</b></summary>

![](https://github.com/user-attachments/assets/5f81f9e4-ed64-42b8-b5d2-0ce8774e136a)
![](https://github.com/user-attachments/assets/1673bba7-523b-45c1-a7ea-7b6e6e0f5acd)
![](https://github.com/user-attachments/assets/380c1acf-4224-44d0-8a05-a6e1292d600c)

</details>

</table>


## Controls

It navigates like the console does, so there is no clicking around required.

| | Keyboard | Gamepad |
|---|---|---|
| Move | Arrows / WASD | D-pad / left stick |
| Confirm | Enter | A |
| Back | Esc | B |
| See More / Hide Shadow | Y | Y |

## Running locally

```bash
npm install
npm run catalog   # builds the icon catalog, needs network, takes a few minutes
npm run dev
```

The `npm run catalog` command reads the icon repo listing and looks up cover art for each
game, then writes `public/catalog.json`. You only need to run it again when new
icon packs are added upstream.

Optional: copy `.env.example` to `.env` and fill in a [RAWG](https://rawg.io/apidocs)
key so games without an eShop listing still get artwork. A `GITHUB_TOKEN` raises
the GitHub API rate limit, which the catalog build otherwise runs into.

```
RAWG_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
```

## How it works

Icon parts are never bundled. They stream from
[nso-icons](https://github.com/henry-debruin/nso-icons) over jsDelivr, and a
build step groups them into frames, characters and backgrounds per game.

Layers are composited pixel by pixel instead of with canvas blend modes,
because the source art needs repair first. The Switch frames ship as opaque
images with a near-white plate where the cutout should be, and characters carry
a drop shadow baked into the artwork, which is what the Hide Shadow toggle
strips out.

Built with React, Vite and Zustand. No UI framework, no router.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. Add `RAWG_API_KEY` under Settings > Secrets and
variables > Actions so cover art resolves there too.

The site is served from `/nso-icon-creator/` on GitHub Pages, so asset paths are
built with that prefix. The build also writes the full site URL into the canonical link, the social
preview tags and `sitemap.xml`. To host it somewhere else, set both of these,
either in `.env` or as workflow variables:

```
BASE_PATH=/                     # path the app is served from
SITE_URL=https://example.com/   # absolute public URL
```

## Credits

Icon artwork comes from [nso-icons](https://github.com/henry-debruin/nso-icons).
Cover art is fetched from the Nintendo eShop listing API and [RAWG](https://rawg.io).

An unofficial fan project, not affiliated with or endorsed by Nintendo. All game
artwork and trademarks belong to their respective owners.
