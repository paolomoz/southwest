/**
 * category-tiles — square image-background link tiles (special-offers hub).
 * Authoring rows: image cell · link cell (label = link text). External hosts
 * get the external-site glyph, matching live.
 */
const EXT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M9 5H5v14h14v-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('ul');
  grid.className = 'ct-grid';
  rows.forEach((row) => {
    const pic = row.querySelector('picture, img');
    const a = row.querySelector('a');
    if (!a) return;
    const li = document.createElement('li');
    const tile = document.createElement('a');
    tile.href = a.getAttribute('href');
    if (pic) {
      const p = pic.closest('picture') || pic;
      const clone = p.cloneNode(true);
      const img = clone.tagName === 'IMG' ? clone : clone.querySelector('img');
      if (img) { img.setAttribute('loading', 'lazy'); img.setAttribute('alt', ''); }
      tile.append(clone);
    }
    const label = document.createElement('span');
    label.className = 'ct-label';
    label.textContent = a.textContent.trim();
    let external = false;
    try { external = new URL(tile.href, window.location.href).hostname !== 'www.southwest.com' && !tile.href.startsWith('/'); } catch { /* relative */ }
    if (external) {
      const ic = document.createElement('span');
      ic.className = 'ct-ext';
      ic.innerHTML = EXT_ICON;
      label.append(ic);
      tile.target = '_blank';
      tile.rel = 'noopener';
    }
    const explore = document.createElement('span');
    explore.className = 'ct-explore';
    explore.textContent = 'Explore';
    label.append(explore);
    tile.append(label);
    li.append(tile);
    grid.append(li);
  });
  block.replaceChildren(grid);
}
