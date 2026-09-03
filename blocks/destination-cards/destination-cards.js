/**
 * destination-cards — filterable destination grid (travel-inspiration).
 * Interactive category filter (business logic in the block — demo beat):
 * pills derive from each card's <em> category tags; clicking filters client-side.
 * Authoring rows: picture · city heading · code · blurb · categories (em, comma
 * separated) · Explore link.
 */
const PILLS = ['All', 'Hawaii', 'International', 'U.S. Beaches', 'Snow', 'National Parks', 'Popular Cities', 'Fall Foliage', 'Family Trips'];
const CAT_MAP = {
  hawaii: 'Hawaii',
  international: 'International',
  beaches: 'U.S. Beaches',
  snow: 'Snow',
  national: 'National Parks',
  cities: 'Popular Cities',
  foliage: 'Fall Foliage',
  family: 'Family Trips',
};

export default function decorate(block) {
  const bar = document.createElement('div');
  bar.className = 'dc-filter';
  const barInner = document.createElement('div');
  barInner.className = 'dc-filter-inner';
  PILLS.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = p;
    btn.dataset.cat = p;
    if (i === 0) btn.classList.add('dc-active');
    barInner.append(btn);
  });
  bar.append(barInner);

  const grid = document.createElement('ul');
  grid.className = 'dc-grid';
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture, img');
    const heading = row.querySelector('h1,h2,h3,h4,strong');
    const a = [...row.querySelectorAll('a')].pop();
    const cats = [...row.querySelectorAll('em')].map((e) => e.textContent.trim().split(/\s*,\s*/)).flat()
      .map((c) => CAT_MAP[c.toLowerCase()] || c).filter(Boolean);
    const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture,img,a,em,strong'));
    const code = ps.map((p) => p.textContent.trim()).find((t) => /^[A-Z]{3}$/.test(t));
    const blurb = ps.find((p) => p.textContent.trim().length > 50);

    const li = document.createElement('li');
    li.className = 'dc-card';
    li.dataset.cats = cats.join('|');
    if (pic) {
      const m = document.createElement('div');
      m.className = 'dc-media';
      const p = (pic.closest('picture') || pic).cloneNode(true);
      const img = p.tagName === 'IMG' ? p : p.querySelector('img');
      if (img) img.setAttribute('loading', 'lazy');
      m.append(p);
      li.append(m);
    }
    const copy = document.createElement('div');
    copy.className = 'dc-copy';
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      copy.append(h3);
    }
    if (code) {
      const c = document.createElement('p');
      c.className = 'dc-code';
      c.textContent = code;
      copy.append(c);
    }
    if (blurb) {
      const b = blurb.cloneNode(true);
      b.className = 'dc-blurb';
      copy.append(b);
    }
    if (a) {
      const cta = document.createElement('a');
      cta.className = 'dc-cta';
      cta.href = a.getAttribute('href');
      cta.textContent = a.textContent.trim();
      copy.append(cta);
    }
    li.append(copy);
    grid.append(li);
  });

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    barInner.querySelectorAll('button').forEach((b) => b.classList.toggle('dc-active', b === btn));
    const cat = btn.dataset.cat;
    grid.querySelectorAll('.dc-card').forEach((card) => {
      card.hidden = cat !== 'All' && !(card.dataset.cats || '').split('|').includes(cat);
    });
  });

  block.replaceChildren(bar, grid);
}
