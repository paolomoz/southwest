/**
 * partner-offer — white offer card on navy ground, overlapping the hero.
 * One block serves all 9 car-rental partner pages (hertz archetype).
 *
 * Authoring rows (classified by content, not position — authors omit rows):
 *   partner logo picture · headline · intro · tier list (ul) · promo-code
 *   paragraph · CTA. Terms live OUTSIDE the block as default content.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const card = document.createElement('div');
  card.className = 'po-card';

  const head = document.createElement('div');
  head.className = 'po-head';
  const headCopy = document.createElement('div');

  let logoDone = false;
  rows.forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const pic = cell.querySelector('picture, img');
    const heading = cell.querySelector('h1, h2, h3');
    const list = cell.querySelector('ul');
    const link = cell.querySelector('a');

    if (pic && !logoDone) {
      const wrap = document.createElement('div');
      wrap.className = 'po-logo';
      wrap.append((pic.closest('picture') || pic).cloneNode(true));
      head.prepend(wrap);
      logoDone = true;
    } else if (heading) {
      const h2 = document.createElement('h2');
      [...heading.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
      headCopy.append(h2);
    } else if (list) {
      const ul = list.cloneNode(true);
      ul.className = 'po-tiers';
      card.append(ul);
    } else if (link && (link.classList.contains('button') || cell.querySelector('strong'))) {
      const a = link.cloneNode(true);
      a.classList.add('button', 'primary');
      card.append(a);
    } else {
      [...cell.querySelectorAll('p')].forEach((p) => {
        const out = p.cloneNode(true);
        out.className = /promotion code/i.test(p.textContent) ? 'po-promo' : 'po-intro';
        card.append(out);
      });
    }
  });

  head.append(headCopy);

  const hr = document.createElement('hr');
  const intro = card.querySelector('.po-intro, .po-promo, .po-tiers');
  card.prepend(head, hr);
  if (intro) card.insertBefore(hr, intro);

  rows.forEach((r) => r.remove());
  block.append(card);
}
