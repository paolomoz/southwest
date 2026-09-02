/**
 * promo-cards — offer card grid (special-offers listing pages).
 * Card = one authored row: picture · copy cell (optional <strong> badge line,
 * optional <em> eyebrow, h3 title, body, *fineprint, CTA link). The whole
 * card links to the CTA href, matching live.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('ul');
  grid.className = 'pc-grid';

  rows.forEach((row) => {
    const pic = row.querySelector('picture, img');
    const heading = row.querySelector('h1, h2, h3, h4');
    const link = row.querySelector('a');
    const badge = [...row.querySelectorAll('strong')].map((s) => s.textContent.trim())
      .find((t) => /^(featured|ending soon|new)$/i.test(t));
    const eyebrow = row.querySelector('em');
    const ps = [...row.querySelectorAll('p')];
    const body = ps.filter((p) => !p.querySelector('a, picture, img, em')
      && !(/^(featured|ending soon|new)$/i.test(p.textContent.trim()))
      && !p.textContent.trim().startsWith('*') && p.textContent.trim().length > 5);
    const fine = ps.filter((p) => p.textContent.trim().startsWith('*'));

    const li = document.createElement('li');
    const card = document.createElement(link ? 'a' : 'div');
    card.className = 'pc-card';
    if (link) card.href = link.getAttribute('href');

    const media = document.createElement('div');
    media.className = 'pc-media';
    if (pic) {
      const p = (pic.closest('picture') || pic).cloneNode(true);
      const img = p.tagName === 'IMG' ? p : p.querySelector('img');
      if (img) img.setAttribute('loading', 'lazy');
      const isLogo = /logo|\.svg/i.test(img ? img.src : '');
      if (isLogo) media.classList.add('pc-logo');
      media.append(p);
    }
    if (badge) {
      const pill = document.createElement('span');
      pill.className = 'pc-badge';
      pill.textContent = badge;
      media.append(pill);
    }
    card.append(media);

    const copy = document.createElement('div');
    copy.className = 'pc-copy';
    if (eyebrow) {
      const ey = document.createElement('span');
      ey.className = 'pc-eyebrow';
      ey.textContent = eyebrow.textContent.trim();
      copy.append(ey);
    }
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      copy.append(h3);
    }
    body.forEach((p) => { const c = p.cloneNode(true); c.className = 'pc-body'; copy.append(c); });
    fine.forEach((p) => { const c = p.cloneNode(true); c.className = 'pc-fine'; copy.append(c); });
    if (link) {
      const cta = document.createElement('span');
      cta.className = 'pc-cta';
      cta.textContent = link.textContent.trim();
      copy.append(cta);
    }
    card.append(copy);
    li.append(card);
    grid.append(li);
  });

  block.replaceChildren(grid);
}
