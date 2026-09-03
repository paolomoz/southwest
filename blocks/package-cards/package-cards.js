/**
 * package-cards — Getaways vacation package carousel.
 * Rows after optional [h2]: one per card —
 *   [picture · location p · stars em (number) · h3 title · origin em ·
 *    nights strong · strike s/del (optional) · price strong · points p ·
 *    depart p · Explore link]
 * Carousel facsimile: horizontal scroll, arrow button pages, dot indicators.
 */
const STAR = '<svg viewBox="0 0 20 19" width="15" height="14" fill="#01d8e0"><path d="M10 0l2.6 6.1 6.6.5-5 4.3 1.5 6.4L10 13.9 4.3 17.3l1.5-6.4-5-4.3 6.6-.5z"/></svg>';
const HALF = '<svg viewBox="0 0 20 19" width="15" height="14"><defs><linearGradient id="hg"><stop offset="50%" stop-color="#01d8e0"/><stop offset="50%" stop-color="#c9c9c9"/></linearGradient></defs><path fill="url(#hg)" d="M10 0l2.6 6.1 6.6.5-5 4.3 1.5 6.4L10 13.9 4.3 17.3l1.5-6.4-5-4.3 6.6-.5z"/></svg>';
const BOOK = 'https://www.southwest.com/vacations/';

function card(row) {
  const li = document.createElement('li');
  li.className = 'pk-card';
  const pic = row.querySelector('picture, img');
  const heading = row.querySelector('h3, h4, strong');
  const texts = [...row.querySelectorAll('p')].map((p) => p.textContent.trim());
  const get = (re) => texts.find((t) => re.test(t)) || '';
  const starsTxt = (row.querySelector('em') || {}).textContent || '';
  const stars = parseFloat(starsTxt) || 0;
  const strike = row.querySelector('s, del, code'); // strike price authors as <code> (DA-preserved)
  const a = [...row.querySelectorAll('a')].pop();

  const media = document.createElement('div');
  media.className = 'pk-media';
  if (pic) media.append((pic.closest('picture') || pic).cloneNode(true));
  li.append(media);

  const body = document.createElement('div');
  body.className = 'pk-body';
  const locRow = document.createElement('div');
  locRow.className = 'pk-locrow';
  const loc = document.createElement('span');
  loc.className = 'pk-loc';
  loc.textContent = get(/,/) ? texts.find((t) => /^[A-Z][^$]*,/.test(t) && t.length < 45) || '' : '';
  const starBox = document.createElement('span');
  starBox.className = 'pk-stars';
  for (let i = 1; i <= Math.floor(stars); i += 1) starBox.innerHTML += STAR;
  if (stars % 1) starBox.innerHTML += HALF;
  locRow.append(loc, starBox);
  body.append(locRow);

  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent.trim();
    body.append(h3);
  }
  const push = (cls, txt, tag = 'p') => {
    if (!txt) return null;
    const el = document.createElement(tag);
    el.className = cls;
    el.textContent = txt;
    body.append(el);
    return el;
  };
  push('pk-origin', get(/^from .+\(/));
  push('pk-nights', get(/nights hotel/));
  const priceRow = document.createElement('p');
  priceRow.className = 'pk-price';
  if (strike) priceRow.innerHTML += `<s>${strike.textContent.trim()}</s> `;
  const priceTxt = get(/^\$[\d,.]+$/);
  priceRow.innerHTML += `<strong>${priceTxt}</strong> <span>per guest</span>`;
  body.append(priceRow);
  push('pk-taxes', 'includes estimated taxes & fees');
  push('pk-points', get(/^Earn from/));
  push('pk-depart', get(/^Depart /));

  const cta = document.createElement('a');
  cta.className = 'pk-cta';
  cta.href = a ? a.getAttribute('href') : BOOK;
  cta.textContent = 'Explore package';
  body.append(cta);
  li.append(body);
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2');
  const cardsRows = rows.filter((r) => r.querySelector('picture, img'));
  const ctaRow = rows.find((r) => !r.querySelector('picture, img') && r.querySelector('a') && !r.contains(heading));

  const shell = document.createElement('div');
  shell.className = 'pk-shell';
  const track = document.createElement('ul');
  track.className = 'pk-track';
  cardsRows.forEach((r) => track.append(card(r)));
  shell.append(track);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'pk-next';
  next.setAttribute('aria-label', 'Next packages');
  next.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#304cb2" stroke-width="2.4"><path d="m9 5 7 7-7 7"/></svg>';
  next.addEventListener('click', () => {
    const w = track.clientWidth;
    const max = track.scrollWidth - w - 4;
    track.scrollTo({ left: track.scrollLeft >= max ? 0 : track.scrollLeft + w, behavior: 'smooth' });
  });
  shell.append(next);

  const dots = document.createElement('div');
  dots.className = 'pk-dots';
  const pages = Math.max(1, Math.ceil(cardsRows.length / 4));
  for (let i = 0; i < Math.min(pages, 3); i += 1) {
    const d = document.createElement('span');
    if (i === 0) d.className = 'pk-dot-on';
    dots.append(d);
  }
  track.addEventListener('scroll', () => {
    const page = Math.round(track.scrollLeft / track.clientWidth);
    [...dots.children].forEach((d, i) => d.classList.toggle('pk-dot-on', i === Math.min(page, dots.children.length - 1)));
  }, { passive: true });

  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(shell, dots);
  if (ctaRow) {
    const a = ctaRow.querySelector('a');
    const b = document.createElement('a');
    b.className = 'pk-see-more';
    b.href = a.getAttribute('href');
    b.textContent = a.textContent.trim();
    block.append(b);
  }
}
