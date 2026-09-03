/**
 * rr-band — Rapid Rewards benefits band (route pages).
 * Row 1: [lead p with inline link · Sign up now link]
 * Rows 2..n-1: [h3/strong + body p] benefit columns (icon drawn per index)
 * Last row: [footnote p]
 */
const ICONS = [
  '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#304cb2" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 9.5h18M8 3v4M16 3v4"/><rect x="7" y="12.5" width="3" height="3" fill="#304cb2" stroke="none"/><rect x="12" y="12.5" width="3" height="3" fill="#304cb2" stroke="none"/></svg>',
  '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#304cb2" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.5"/></svg>',
];

export default function decorate(block) {
  const rows = [...block.children];
  const head = document.createElement('div');
  head.className = 'rr-head';
  if (rows[0]) {
    const cells = [...rows[0].children];
    const lead = cells[0] && cells[0].querySelector('p');
    if (lead) {
      lead.className = 'rr-lead';
      head.append(lead);
    }
    const signup = cells[1] && cells[1].querySelector('a');
    if (signup) {
      signup.className = 'rr-signup';
      head.append(signup);
    }
  }

  const last = rows[rows.length - 1];
  const foot = rows.length > 2 ? last.querySelector('p') : null;
  if (foot) foot.className = 'rr-foot';

  const grid = document.createElement('div');
  grid.className = 'rr-grid';
  rows.slice(1, foot ? -1 : undefined).forEach((row, i) => {
    const col = document.createElement('div');
    col.className = 'rr-col';
    const h = row.querySelector('h2,h3,h4,strong');
    if (h) {
      const h3 = document.createElement('h3');
      [...h.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      col.append(h3);
    }
    [...row.querySelectorAll('p')].filter((p) => !p.querySelector('strong') || p.textContent.trim() !== (h && h.textContent.trim()))
      .forEach((p) => col.append(p.cloneNode(true)));
    grid.append(col);
    if (i < 2) {
      const ico = document.createElement('div');
      ico.className = 'rr-icon';
      ico.innerHTML = ICONS[i];
      grid.append(ico);
    }
  });

  block.replaceChildren(head, grid);
  if (foot) block.append(foot);
}
