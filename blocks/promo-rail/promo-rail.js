/**
 * promo-rail — stacked merchandising tiles beside a form panel
 * (yellow partner tile + navy app tile on transactional pages).
 * Authoring rows: image · heading · body · optional fineprint · CTA link.
 * Row style cycles yellow → navy (matching live).
 */
export default function decorate(block) {
  const rail = document.createElement('div');
  rail.className = 'pr-rail';
  [...block.children].forEach((row, i) => {
    const pic = row.querySelector('picture, img');
    const heading = row.querySelector('h1, h2, h3, h4, strong');
    const a = [...row.querySelectorAll('a')].pop();
    const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img, a, strong'));
    const fine = ps.find((p) => p.textContent.trim().startsWith('*'));
    const body = ps.filter((p) => p !== fine);

    const tile = document.createElement('div');
    tile.className = `pr-tile ${i % 2 === 0 ? 'pr-yellow' : 'pr-navy'}`;
    if (pic) {
      const media = document.createElement('div');
      media.className = 'pr-media';
      media.append((pic.closest('picture') || pic).cloneNode(true));
      tile.append(media);
    }
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      tile.append(h3);
    }
    body.forEach((p) => { const c = p.cloneNode(true); c.className = 'pr-body'; tile.append(c); });
    const foot = document.createElement('div');
    foot.className = 'pr-foot';
    if (fine) { const f = fine.cloneNode(true); f.className = 'pr-fine'; foot.append(f); }
    if (a) {
      const cta = document.createElement('a');
      cta.className = 'pr-cta';
      cta.href = a.getAttribute('href');
      cta.textContent = a.textContent.trim();
      foot.append(cta);
    }
    tile.append(foot);
    rail.append(tile);
  });
  block.replaceChildren(rail);
}
