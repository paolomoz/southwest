/**
 * feature-tiles — centered circular-image feature cards, 3-up
 * (flying-with-southwest travel-experience grid).
 * Authoring rows: picture · heading · body · CTA (strong) · *fineprint.
 */
export default function decorate(block) {
  const grid = document.createElement('ul');
  grid.className = 'ft-grid';
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture, img');
    const heading = row.querySelector('h1, h2, h3, h4');
    const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
    const cta = ps.find((p) => p.querySelector('a') && p.querySelector('strong'));
    const plain = ps.filter((p) => p !== cta);
    const fine = plain.filter((p) => p.textContent.trim().startsWith('*'));
    const body = plain.filter((p) => !fine.includes(p));

    const li = document.createElement('li');
    if (pic) {
      const media = document.createElement('div');
      media.className = 'ft-media';
      media.append((pic.closest('picture') || pic).cloneNode(true));
      li.append(media);
    }
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      li.append(h3);
    }
    body.forEach((p) => { const c = p.cloneNode(true); c.className = 'ft-body'; li.append(c); });
    if (cta) {
      const c = cta.cloneNode(true);
      c.className = 'ft-cta';
      li.append(c);
    }
    fine.forEach((p) => { const c = p.cloneNode(true); c.className = 'ft-fine'; li.append(c); });
    grid.append(li);
  });
  block.replaceChildren(grid);
}
