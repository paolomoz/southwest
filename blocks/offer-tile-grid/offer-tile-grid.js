/**
 * offer-tile-grid — partner offer cards (replica: home 'Special Offers' row).
 * Schema: stardust/eds-schema/index.json § special-offers (3 × ARTICLE.offer-card).
 * Decode tier: RECONSTRUCTIVE — authors add/remove cards.
 * Authoring: one row per card; cells (flat siblings tolerated, #52/#62):
 *   picture · badge (<strong> lead, e.g. "Cruises") · h3 title · body · optional
 *   fineprint (*-prefixed) · CTA paragraph.
 * Section head ("Special Offers" h2) is DEFAULT CONTENT before the block (D1),
 * styled in place via .offer-tile-grid-container .default-content-wrapper.
 */

const BADGE_ICONS = {
  cruises: '<svg viewBox="0 0 24 24"><path d="M3 17c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0M5 14l-1-4 8-2 8 2-1 4M12 8V4h-2"/></svg>',
  cars: '<svg viewBox="0 0 24 24"><path d="M4 16.5 5.5 11a2 2 0 0 1 2-1.5h9a2 2 0 0 1 2 1.5l1.5 5.5M4 16.5h16M4 16.5V19m16-2.5V19M7 14h.01M17 14h.01"/></svg>',
  hotels: '<svg viewBox="0 0 24 24"><path d="M3 20V6m0 8h18v6m0-6v-2a2 2 0 0 0-2-2h-9v4M6 11h.01"/></svg>',
};

function cardFromNodes(nodes) {
  const card = document.createElement('article');
  card.className = 'offer-card';

  const media = nodes.map((n) => (n.matches && n.matches('picture, img') ? n : n.querySelector && n.querySelector('picture, img'))).find(Boolean);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const badgeNode = nodes.find((n) => n.querySelector && n.querySelector('strong') && !n.querySelector('a') && n.textContent.trim().length < 30);
  const ctaNode = nodes.find((n) => n.querySelector && n.querySelector('a'));
  const textNodes = nodes.filter((n) => n !== heading && n !== badgeNode && n !== ctaNode
    && !(n.matches && n.matches('picture, img')) && !(n.querySelector && n.querySelector('picture, img'))
    && n.textContent.trim());
  const fineprint = textNodes.find((n) => n.textContent.trim().startsWith('*'));
  const body = textNodes.find((n) => n !== fineprint);

  const figure = document.createElement('figure');
  if (media) {
    const m = media.cloneNode(true);
    const img = m.tagName === 'IMG' ? m : m.querySelector('img');
    if (img) img.setAttribute('loading', 'lazy');
    figure.append(m);
  }
  if (badgeNode) {
    const label = badgeNode.textContent.trim();
    const key = label.toLowerCase();
    const badge = document.createElement('span');
    badge.className = 'offer-badge';
    badge.innerHTML = (BADGE_ICONS[key] || '') + label;
    figure.append(badge);
  }
  card.append(figure);

  const bodyWrap = document.createElement('div');
  bodyWrap.className = 'offer-body';
  if (heading) {
    const h3 = document.createElement('h3');
    const inner = heading.querySelector('h1, h2, h3, h4') || heading;
    [...inner.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
    bodyWrap.append(h3);
  }
  if (body) {
    const p = document.createElement('p');
    [...body.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    bodyWrap.append(p);
  }
  if (fineprint) {
    const p = document.createElement('p');
    p.className = 'fineprint';
    p.textContent = fineprint.textContent.trim();
    bodyWrap.append(p);
  }
  if (ctaNode) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaNode.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    bodyWrap.append(actions);
  }
  card.append(bodyWrap);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'offer-grid';

  // one-row-per-card shape (#63 order 0)
  const cardRows = rows.filter((r) => r.querySelector('h1, h2, h3, h4') || r.querySelector('picture, img'));
  if (cardRows.length >= 2) {
    cardRows.forEach((row) => {
      const nodes = [];
      row.querySelectorAll(':scope > div').forEach((cell) => {
        const kids = [...cell.children];
        if (kids.length) nodes.push(...kids);
        else if (cell.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = cell.textContent.trim();
          nodes.push(p);
        }
      });
      grid.append(cardFromNodes(nodes));
    });
  } else {
    // flattened single-cell shape (#52): segment on most-frequent heading tag
    const nodes = [];
    block.querySelectorAll(':scope > div > div').forEach((cell) => nodes.push(...cell.children));
    const tags = nodes.filter((n) => /^H[1-6]$/.test(n.tagName)).map((n) => n.tagName);
    const boundary = tags.sort((a, b) => tags.filter((t) => t === b).length - tags.filter((t) => t === a).length)[0];
    let group = [];
    const groups = [];
    nodes.forEach((n) => {
      if (n.tagName === boundary && group.length) { groups.push(group); group = []; }
      group.push(n);
    });
    if (group.length) groups.push(group);
    groups.forEach((g) => grid.append(cardFromNodes(g)));
  }

  block.replaceChildren(grid);
}
