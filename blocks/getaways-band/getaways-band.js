/**
 * getaways-band — navy value-props band ("Need even more reasons…").
 * Rows: [h2] · one row per prop [strong] · [Learn more link].
 */
const ICONS = {
  bags: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8"><rect x="4" y="7" width="13" height="13" rx="1.5"/><path d="M8 7V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2M20 9v9"/></svg>',
  payment: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="M3 10h18"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 20s-7-4.6-9-9a5 5 0 0 1 9-3.4A5 5 0 0 1 21 11c-2 4.4-9 9-9 9Z"/></svg>',
  points: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M9 15V9h3.2a2 2 0 1 1 0 4H9"/></svg>',
};
const ORDER = ['bags', 'payment', 'heart', 'points'];

export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2');
  const link = [...block.querySelectorAll('a')].pop();
  const props = rows.map((r) => r.querySelector('strong'))
    .filter(Boolean).map((s) => s.textContent.trim());

  const grid = document.createElement('div');
  grid.className = 'gb-grid';
  props.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'gb-item';
    item.innerHTML = `${ICONS[ORDER[i % 4]]}<span></span>`;
    item.querySelector('span').textContent = t;
    grid.append(item);
  });

  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(grid);
  if (link) {
    const b = document.createElement('a');
    b.className = 'gb-cta';
    b.href = link.getAttribute('href');
    b.textContent = link.textContent.trim();
    block.append(b);
  }
}
