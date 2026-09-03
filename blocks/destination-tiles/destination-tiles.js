/**
 * destination-tiles — Getaways photo tiles with white overlay labels.
 * Default `mosaic`: rows 1-2 double-wide, rest quarter tiles (hub layout).
 * Variant `quad`: uniform 4-up.
 * Rows after optional [h2]: [picture · label link]. Optional trailing CTA row
 * (link only, no picture) renders as centered outline button.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2');
  const grid = document.createElement('div');
  grid.className = 'dt-grid';
  let cta = null;
  rows.forEach((row) => {
    const pic = row.querySelector('picture, img');
    const a = row.querySelector('a');
    if (!pic) {
      if (a) cta = a;
      return;
    }
    const tile = document.createElement('a');
    tile.className = 'dt-tile';
    tile.href = a ? a.getAttribute('href') : '#';
    const m = (pic.closest('picture') || pic).cloneNode(true);
    const label = document.createElement('span');
    label.className = 'dt-label';
    label.textContent = a ? a.textContent.trim() : row.textContent.trim();
    tile.append(m, label);
    grid.append(tile);
  });
  if (!block.classList.contains('quad')) {
    [...grid.children].forEach((t, i) => { if (i < 2) t.classList.add('dt-wide'); });
  }
  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(grid);
  if (cta) {
    const b = document.createElement('a');
    b.className = 'dt-cta';
    b.href = cta.getAttribute('href');
    b.textContent = cta.textContent.trim();
    block.append(b);
  }
}
