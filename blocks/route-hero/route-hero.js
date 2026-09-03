/**
 * route-hero — /en/flights route-page hero: photo (or gradient) background,
 * white card with H1 + static booking bar facsimile (Search links to the
 * live booking flow). Departure/return dates compute client-side (today+5 /
 * today+12, matching the live widget's rolling defaults).
 * Rows: [picture (optional bg)] · [h1] · [destination display value].
 */
function fmt(d) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()}`;
}

function field(label, value, ph, icon) {
  const f = document.createElement('div');
  f.className = 'rh-field';
  const l = document.createElement('span');
  l.className = 'rh-label';
  l.textContent = label;
  const box = document.createElement('div');
  box.className = `rh-input${value ? ' rh-filled' : ''}${icon ? ` rh-ico-${icon}` : ''}`;
  box.textContent = value || ph;
  f.append(l, box);
  return f;
}

export default function decorate(block) {
  const rows = [...block.children];
  const pic = block.querySelector('picture');
  const h1 = block.querySelector('h1, h2');
  const destRow = rows[rows.length - 1];
  const dest = destRow && !destRow.contains(h1) && !destRow.querySelector('picture')
    ? destRow.textContent.trim() : '';

  const section = block.closest('.section');
  if (pic) {
    const img = pic.querySelector('img');
    if (img) section.style.backgroundImage = `url(${img.currentSrc || img.src})`;
    section.classList.add('rh-photo');
  }

  const card = document.createElement('div');
  card.className = 'rh-card';
  if (h1) card.append(h1);

  const chips = document.createElement('div');
  chips.className = 'rh-chips';
  [['Round-trip', 'solid'], ['1 Passenger', 'solid'], ['Promo Code', 'ghost']].forEach(([t, k]) => {
    const c = document.createElement('span');
    c.className = `rh-chip rh-chip-${k}`;
    c.textContent = t;
    chips.append(c);
  });

  const bar = document.createElement('div');
  bar.className = 'rh-bar';
  const dep = new Date(); dep.setDate(dep.getDate() + 5);
  const ret = new Date(); ret.setDate(ret.getDate() + 12);
  bar.append(
    field('FROM', '', 'Input origin', 'plane'),
    field('TO', dest, 'Input destination', 'land'),
    field('DEPARTURE', fmt(dep), '', 'cal'),
    field('RETURN', fmt(ret), '', 'cal'),
  );
  const search = document.createElement('a');
  search.className = 'rh-search';
  search.href = 'https://www.southwest.com/air/booking/';
  search.textContent = 'Search';
  bar.append(search);

  card.append(chips, bar);
  block.replaceChildren(card);
}
