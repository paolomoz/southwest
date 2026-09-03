/**
 * plan-tiles — "Plan your trip" 3-up band (route pages).
 * Rows: [h2] then one row per tile: [img · h3 · body p · link].
 */
export default function decorate(block) {
  const rows = [...block.children];
  const heading = rows[0] && rows[0].querySelector('h1,h2,h3');

  const grid = document.createElement('div');
  grid.className = 'pt-grid';
  rows.slice(heading ? 1 : 0).forEach((row) => {
    const tile = document.createElement('div');
    tile.className = 'pt-tile';
    const pic = row.querySelector('picture, img');
    const h = row.querySelector('h2,h3,h4,strong');
    const a = [...row.querySelectorAll('a')].pop();
    const body = [...row.querySelectorAll('p')].find((p) => !p.querySelector('picture,img,a,strong'));
    if (pic) {
      const m = document.createElement('div');
      m.className = 'pt-icon';
      m.append((pic.closest('picture') || pic).cloneNode(true));
      tile.append(m);
    }
    if (h) {
      const h3 = document.createElement('h3');
      [...h.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      tile.append(h3);
    }
    if (body) tile.append(body.cloneNode(true));
    if (a) {
      const cta = document.createElement('a');
      cta.className = 'pt-cta';
      cta.href = a.getAttribute('href');
      cta.textContent = a.textContent.trim();
      tile.append(cta);
    }
    grid.append(tile);
  });

  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(grid);
}
